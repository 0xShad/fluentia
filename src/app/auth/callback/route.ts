import { NextResponse } from 'next/server'
import { createClient } from '@/lib/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const rawNext = searchParams.get('next') ?? '/dashboard'
  // Reject absolute URLs and protocol-relative URLs to prevent open redirect
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/dashboard'

  // Use the Host header so redirects work from any device on the network.
  // request.url resolves to localhost on the server even when the client
  // connected via the network IP, which breaks mobile access.
  const host = request.headers.get('host') ?? 'localhost:3000'
  const proto = request.headers.get('x-forwarded-proto') ?? 'http'
  const origin = `${proto}://${host}`

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const oauthAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture || ""
        const oauthFullName = user.user_metadata?.full_name || user.user_metadata?.name || ""
        const nameParts = oauthFullName.trim().split(/\s+/)
        const oauthFirst = user.user_metadata?.first_name || nameParts[0] || ""
        const oauthLast = user.user_metadata?.last_name || nameParts.slice(1).join(" ") || ""

        const { data: existing } = await supabase
          .from("profiles")
          .select("avatar_url, full_name, first_name, last_name")
          .eq("id", user.id)
          .maybeSingle()

        const patch: Record<string, string> = { id: user.id }
        if (!existing?.avatar_url && oauthAvatar) patch.avatar_url = oauthAvatar
        if (!existing?.full_name && oauthFullName) patch.full_name = oauthFullName
        if (!existing?.first_name && oauthFirst) patch.first_name = oauthFirst
        if (!existing?.last_name && oauthLast) patch.last_name = oauthLast

        if (Object.keys(patch).length > 1) {
          await supabase.from("profiles").upsert(patch)
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/authentication/login?error=oauth-failed`)
}

# Security Analysis — Fluentia

## 2. Threat & Vulnerability Identification

The following threats and vulnerabilities were identified through a security analysis and codebase scan of Fluentia prior to and during development:

| Threat | Possible Vulnerability | Impact on System |
|---|---|---|
| Unauthorized Access to User Data | API routes scope database queries with `.eq("user_id", user.id)` in application code. No Row Level Security (RLS) policies are defined in the codebase, so if a server-side client is misconfigured or a bug bypasses the application filter, the database itself has no row-level guard. | An authenticated user could read or modify another user's session records and feedback data stored in Supabase. |
| API Credential Theft & Abuse | `VAPI_PRIVATE_KEY` and `GEMINI_API_KEY` are stored in `.env.local` and accessed in server-side API routes. If these variables were accidentally prefixed with `NEXT_PUBLIC_` or committed to version control, they would be exposed in the client bundle or repository history. Additionally, the in-memory rate limiter (`src/lib/rate-limit.ts`) resets on serverless cold starts, so the per-user call limits on `/api/feedback` and `/api/recording` are not reliably enforced across instances. | Exposed keys allow unauthorized calls to the Gemini and Vapi APIs. Insufficient rate limiting allows an authenticated user to exhaust paid API quotas, causing service disruption and unexpected cost. |
| Prompt Injection via Transcript Input | User-controlled fields (`transcript` text, `scenarioTitle`, `aiRole`) are sanitized by stripping control characters and capping string length before being interpolated into the Gemini prompt. This does not prevent natural-language instruction injection (e.g., "Ignore previous instructions") embedded within the transcript body itself. | A crafted transcript could attempt to redirect the LLM's scoring behaviour. Server-side score caps (`hardCap`) partially limit the impact on final scores for short sessions, but do not prevent manipulation of the qualitative feedback text. |
| Malicious File in Recording Pipeline | The recording route fetches audio server-side from a URL provided by the Vapi API response. Without validating the source domain and actual file content, a non-audio or oversized file could pass through and be stored in Supabase Storage, then served back to the user. | A malformed or oversized file could consume storage quota or cause unexpected client-side behaviour when a user attempts to play back the recording. |

---

## 3. Security Implementation

The following security controls were implemented in Fluentia to address the identified threats. Each control was verified against the actual codebase.

### 3.1 Security Control #1: Server-Side User Authentication — `getUser()`

| | |
|---|---|
| **Name of Control** | Server-Side User Authentication (`getUser()`) |
| **Threat Addressed** | Unauthorized Access to User Data |
| **CIA Principle** | Confidentiality |

**Description**: Every API route authenticates the incoming request before any other processing. `supabase.auth.getUser()` validates the session cookie server-side and returns the authenticated user object. If no valid session exists, the route returns `401 Unauthorized` immediately — no request body is parsed and no database query runs. All subsequent database operations include `.eq("user_id", user.id)`, scoping results exclusively to the authenticated user's records. This pattern is applied consistently across all four API routes: `/api/feedback`, `/api/recording`, `/api/recordings`, and `/api/sessions`.

**Code Snippet** (`src/app/api/feedback/route.ts`, lines 32–36 and 99):

```ts
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
if (!user) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// All subsequent queries are scoped to the authenticated user
.eq("user_id", user.id)
```

---

### 3.2 Security Control #2: Middleware Route Protection — `getClaims()`

| | |
|---|---|
| **Name of Control** | Middleware Route Protection (`getClaims()`) |
| **Threat Addressed** | Unauthorized Access to User Data |
| **CIA Principle** | Confidentiality, Integrity |

**Description**: `src/lib/supabase-middleware.ts` runs on every incoming request via Next.js middleware (`src/proxy.ts`). It calls `supabase.auth.getClaims()` to validate the user's JWT without making a database round-trip. Unauthenticated requests to any `/dashboard/*` path are redirected to `/authentication/login`. Authenticated users visiting `/authentication/*`, `/login`, `/register`, or the root `/` are redirected to `/dashboard`. This prevents any protected page from rendering to an unauthenticated visitor, even via direct URL navigation.

**Code Snippet** (`src/lib/supabase-middleware.ts`, lines 38–54):

```ts
const { data } = await supabase.auth.getClaims()
const user = data?.claims

const isProtectedRoute = pathname.startsWith('/dashboard');
const isAuthRoute = pathname.startsWith('/authentication') || pathname === '/login' || pathname === '/register';

if (!user && isProtectedRoute) {
  const url = request.nextUrl.clone()
  url.pathname = '/authentication/login'
  return NextResponse.redirect(url)
}

if (user && (pathname === '/' || isAuthRoute)) {
  const url = request.nextUrl.clone()
  url.pathname = '/dashboard'
  return NextResponse.redirect(url)
}
```

---

### 3.3 Security Control #3: Server-Side Key Isolation

| | |
|---|---|
| **Name of Control** | Server-Side Isolation of Private API Keys |
| **Threat Addressed** | API Credential Theft & Abuse |
| **CIA Principle** | Confidentiality |

**Description**: `GEMINI_API_KEY` and `VAPI_PRIVATE_KEY` carry no `NEXT_PUBLIC_` prefix, so Next.js excludes them from the client-side JavaScript bundle at build time. They are only read inside server-executed API route handlers. The browser-facing Vapi client uses only `NEXT_PUBLIC_VAPI_PUBLIC_KEY`, which has limited permissions and cannot access private API endpoints. Inspecting the compiled client bundle or browser network traffic exposes no private credentials.

**Code Snippet** (`src/app/api/feedback/route.ts` line 14; `src/app/api/recording/route.ts` line 79):

```ts
// feedback/route.ts — server-side only, never in client bundle
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// recording/route.ts — server-side only, never in client bundle
const privateKey = process.env.VAPI_PRIVATE_KEY;
```

---

### 3.4 Security Control #4: Per-User Rate Limiting

| | |
|---|---|
| **Name of Control** | Per-User Rate Limiting |
| **Threat Addressed** | API Credential Theft & Abuse |
| **CIA Principle** | Availability |

**Description**: A sliding-window counter keyed on `{endpoint}:{user.id}` limits how often each user can trigger calls to external AI services. Requests over the threshold return `429 Too Many Requests` before any call to Gemini or Vapi is made. The `/api/feedback` route allows 5 requests per 10 minutes per user; `/api/recording` allows 10. The counter is implemented in `src/lib/rate-limit.ts` using an in-memory `Map`, which means it does not persist across serverless cold starts or share state across concurrent function instances.

**Code Snippet** (`src/app/api/feedback/route.ts`, lines 39–44):

```ts
if (!rateLimit(`feedback:${user.id}`, 5, 10 * 60 * 1000)) {
  return NextResponse.json(
    { error: "Too many requests. Please wait before analysing another session." },
    { status: 429 }
  );
}
```

---

### 3.5 Security Control #5: Input Sanitization and Category Whitelist

| | |
|---|---|
| **Name of Control** | Input Sanitization and Category Whitelist |
| **Threat Addressed** | Prompt Injection via Transcript Input |
| **CIA Principle** | Integrity |

**Description**: Before any user-supplied string is interpolated into the Gemini prompt, `sanitize()` strips control characters (Unicode range 0x00–0x1F and 0x7F) and truncates the string to a maximum character length. `scenarioTitle` and `aiRole` are capped at 300 characters; individual transcript lines are capped at 2000. The `category` field is validated against a fixed array of five known values (`VALID_CATEGORIES`); any value outside this set returns `400 Bad Request` before the prompt is constructed.

**Code Snippet** (`src/app/api/feedback/route.ts`, lines 10–12, 59–61, 145–149):

```ts
function sanitize(s: unknown, maxLen = 2000): string {
  return String(s ?? "").replace(/[\x00-\x1F\x7F]/g, "").slice(0, maxLen);
}

if (!VALID_CATEGORIES.includes(category)) {
  return NextResponse.json({ error: "Invalid category" }, { status: 400 });
}

const safeTitle = sanitize(scenarioTitle, 300);
const safeRole  = sanitize(aiRole, 300);
const formatted = (transcript as { speaker: string; text: string }[])
  .map((l) => `${l.speaker === "AI" ? safeRole : "You"}: ${sanitize(l.text)}`)
  .join("\n");
```

---

### 3.6 Security Control #6: Magic-Byte Audio Validation and File Size Check

| | |
|---|---|
| **Name of Control** | Magic-Byte Audio Validation and File Size Check |
| **Threat Addressed** | Malicious File in Recording Pipeline |
| **CIA Principle** | Integrity |

**Description**: Before an audio file is stored in Supabase Storage, two checks run in sequence. First, the file's byte length is compared against a 50 MB ceiling (`MAX_RECORDING_BYTES`). Second, the first 12 bytes of the file buffer are compared against known audio format signatures: ID3-tagged MP3, raw MP3 frame sync, WAV (RIFF…WAVE), OGG (OggS), and WebM/EBML headers. The `Content-Type` header sent by the source is ignored entirely. Files that fail either check are rejected with `422 Unprocessable Entity` before the upload reaches storage.

**Code Snippet** (`src/app/api/recording/route.ts`, lines 17–35, 119–128):

```ts
function detectAudio(buf: ArrayBuffer): { ext: string; mime: string } | null {
  const h = new Uint8Array(buf.slice(0, 12));
  if (h[0] === 0x49 && h[1] === 0x44 && h[2] === 0x33)
    return { ext: "mp3", mime: AUDIO_MIME.mp3 }; // ID3-tagged MP3
  if (h[0] === 0xff && (h[1] & 0xe0) === 0xe0)
    return { ext: "mp3", mime: AUDIO_MIME.mp3 }; // raw MP3 frame
  if (h[0]===0x52&&h[1]===0x49&&h[2]===0x46&&h[3]===0x46&&
      h[8]===0x57&&h[9]===0x41&&h[10]===0x56&&h[11]===0x45)
    return { ext: "wav", mime: AUDIO_MIME.wav };  // WAV RIFF
  if (h[0]===0x4f&&h[1]===0x67&&h[2]===0x67&&h[3]===0x53)
    return { ext: "ogg", mime: AUDIO_MIME.ogg };  // OGG
  if (h[0]===0x1a&&h[1]===0x45&&h[2]===0xdf&&h[3]===0xa3)
    return { ext: "webm", mime: AUDIO_MIME.webm }; // WebM/EBML
  return null;
}

if (audioBuffer.byteLength > MAX_RECORDING_BYTES) {
  return NextResponse.json({ error: "Recording exceeds maximum allowed size" }, { status: 422 });
}
const detected = detectAudio(audioBuffer);
if (!detected) {
  return NextResponse.json({ error: "Invalid audio format" }, { status: 422 });
}
```

---

### 3.7 Security Control #7: SSRF Protection on Recording Downloads

| | |
|---|---|
| **Name of Control** | SSRF Domain Whitelist on Recording Downloads |
| **Threat Addressed** | Malicious File in Recording Pipeline |
| **CIA Principle** | Integrity, Availability |

**Description**: The Vapi API response includes a URL pointing to the audio file on Vapi's CDN. Before the server makes the outbound fetch, the URL's hostname is parsed and checked against a whitelist: only `*.vapi.ai` and `vapi.ai` are accepted. Any URL pointing to a different host is rejected before the fetch is attempted, preventing the server from being directed to internal network addresses or arbitrary external hosts.

**Code Snippet** (`src/app/api/recording/route.ts`, lines 101–108):

```ts
try {
  const audioHost = new URL(vapiAudioUrl).hostname;
  if (!audioHost.endsWith(".vapi.ai") && audioHost !== "vapi.ai") {
    console.error("Recording rejected: audio URL not on vapi.ai domain", audioHost);
    return NextResponse.json({ error: "Invalid recording source" }, { status: 422 });
  }
} catch {
  return NextResponse.json({ error: "Invalid recording URL" }, { status: 422 });
}
```

---

### 3.8 Security Control #8: Ownership Verification and UUID Validation

| | |
|---|---|
| **Name of Control** | Ownership Verification and UUID Validation |
| **Threat Addressed** | Unauthorized Access to User Data |
| **CIA Principle** | Confidentiality, Integrity |

**Description**: Before any operation on a session record, the `sessionId` parameter is validated against a UUID regex. The database query then requires both the session ID and the authenticated user's ID to match, so a user cannot read, modify, or delete another user's session by guessing or enumerating IDs. This ownership check is applied in both the single-session delete (`/api/sessions`) and the recording fetch route (`/api/recording`).

**Code Snippet** (`src/app/api/recording/route.ts`, lines 5, 52–64):

```ts
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

if (!sessionId || !UUID_RE.test(sessionId)) {
  return NextResponse.json({ error: "sessionId required" }, { status: 400 });
}

const { data: session, error: sessionErr } = await supabase
  .from("session_feedback")
  .select("id, vapi_call_id, recording_url")
  .eq("id", sessionId)
  .eq("user_id", user.id)  // ownership check
  .single();

if (sessionErr || !session) {
  return NextResponse.json({ error: "Session not found" }, { status: 404 });
}
```

---

## 4. CIA Triad Application

### 4.1 Confidentiality

Fluentia protects confidentiality through server-side authentication on every API route using `supabase.auth.getUser()`, ensuring only authenticated users can access system resources. All database queries are scoped to the authenticated user's ID, preventing cross-user data access. The middleware route guard prevents unauthenticated users from reaching any protected page. Private API keys for Vapi and Gemini are isolated to server-side code and are never included in the client bundle. Recording files in Supabase Storage are not publicly accessible — they are served exclusively via signed URLs with a 15-minute expiry. Supabase encrypts all data at rest (AES-256) and enforces TLS for all data in transit. User passwords are managed by Supabase Auth and stored as bcrypt hashes, never in plaintext.

### 4.2 Integrity

Data integrity is maintained through magic-byte file validation on audio downloads, which prevents non-audio content from entering storage regardless of the source `Content-Type` header. UUID validation and per-user ownership checks on session operations prevent cross-user data manipulation. The category whitelist and control-character sanitization on feedback inputs constrain what reaches the Gemini prompt. Server-side score caps (`hardCap`) enforce upper bounds on session scores independently of LLM output, so the final score stored in the database cannot be inflated by prompt manipulation for short sessions. The SSRF domain whitelist ensures the server only fetches files from Vapi-owned infrastructure.

### 4.3 Availability

System availability is supported by Supabase's managed infrastructure, which provides automatic backups and high-availability PostgreSQL. Per-user rate limiting on `/api/feedback` and `/api/recording` reduces the risk of a single user exhausting external API quotas. The SSRF domain whitelist keeps outbound connections predictable and prevents the server from being redirected to unintended hosts. The current rate limiter is in-memory and resets on serverless cold starts, which is a noted gap; a persistent rate-limiting backend would provide more reliable enforcement across instances and deployments.

---

## 5. Conclusion

### 5.1 Lessons Learned

Developing Fluentia provided practical experience applying security principles to a production web application. The codebase scan showed that application-level user filtering (`.eq("user_id", ...)`) is necessary but does not substitute for database-level RLS, which would enforce data isolation regardless of application code paths. Working with an in-memory rate limiter illustrated the tradeoff between implementation simplicity and reliability in a serverless environment — the control works in a single-instance context but cannot be trusted in a multi-instance deployment. Sanitizing user input before LLM interpolation reduces the prompt injection surface, but structural prompt defenses (separating system instructions from user data using message roles or delimiters) would provide stronger guarantees. The Next.js `NEXT_PUBLIC_` convention demonstrated how a naming discipline enforced at build time can reliably prevent private credentials from reaching the client without any additional tooling.

### 5.2 Future Improvements

- Enable Supabase Row Level Security policies on the `session_feedback` and `user_preferences` tables and the `recordings` storage bucket, so data isolation is enforced at the database level independently of application code.
- Replace the in-memory rate limiter with a persistent store (such as a Redis instance or a Supabase table with a `pg_cron` cleanup job) so rate limits apply consistently across all serverless instances and survive cold starts.
- Add structural separation between system instructions and user-supplied data in the Gemini prompt (e.g., using the model's system/user message split) to reduce prompt injection risk beyond character-level sanitization.
- Add rate limiting to the bulk-delete endpoint (`/api/recordings`) to prevent unbounded destructive requests.
- Enable multi-factor authentication via Supabase Auth to strengthen identity verification for user accounts.
- Add audit logging for security-relevant events such as failed authentication attempts and unauthorized session access attempts.

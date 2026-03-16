import { cn } from "@/lib/utils"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

export interface TestimonialAuthor {
  name: string
  handle: string
  avatar: string
}

export interface TestimonialCardProps {
  author: TestimonialAuthor
  text: string
  href?: string
  className?: string
}

export function TestimonialCard({ 
  author,
  text,
  href,
  className
}: TestimonialCardProps) {
  const Card = href ? 'a' : 'div'
  
  // Safe cast since href effectively turns the component into an anchor
  // @ts-expect-error
  return (
    <Card
      {...(href ? { href } : {})}
      className={cn(
        "flex flex-col rounded-lg border border-white/5",
        "bg-[#080808] p-4 text-start sm:p-6",
        "hover:border-white/10 max-w-[320px] sm:max-w-[320px]",
        "transition-colors duration-300",
        className
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="h-10 w-10 border border-white/10">
          <AvatarImage src={author.avatar} alt={author.name} />
        </Avatar>
        <div className="flex flex-col items-start">
          <h3 className="text-sm font-semibold leading-none text-white">
            {author.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {author.handle}
          </p>
        </div>
      </div>
      <p className="text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
        &quot;{text}&quot;
      </p>
    </Card>
  )
}

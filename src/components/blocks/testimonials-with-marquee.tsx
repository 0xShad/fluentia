import { cn } from "@/lib/utils"
import { TestimonialCard, TestimonialAuthor } from "@/components/ui/testimonial-card"

interface TestimonialsSectionProps {
  title: string
  description: string
  testimonials: Array<{
    author: TestimonialAuthor
    text: string
    href?: string
  }>
  className?: string
}

export function TestimonialsSection({ 
  title,
  description,
  testimonials,
  className 
}: TestimonialsSectionProps) {
  return (
    <section className={cn(
      "bg-background text-foreground",
      "py-24 relative px-6 border-t border-white/5 overflow-hidden",
      className
    )}>
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-4 text-center sm:gap-16">
        <div className="flex flex-col items-center gap-4 px-4 sm:gap-8 mb-8 sm:mb-0">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">
            {title}
          </h2>
          <p className="text-sm md:text-base max-w-[600px] font-medium text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <div className="group flex overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)] flex-row [--duration:40s]">
            {[0, 1].map((arr) => (
              <div 
                key={arr} 
                className="flex shrink-0 items-center justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]"
                aria-hidden={arr === 1 ? "true" : undefined}
              >
                {[...Array(2)].map((_, setIndex) => (
                  testimonials.map((testimonial, i) => (
                    <TestimonialCard 
                      key={`${setIndex}-${i}`}
                      {...testimonial}
                    />
                  ))
                ))}
              </div>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/3 bg-gradient-to-r from-background to-transparent sm:block z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l from-background to-transparent sm:block z-10" />
        </div>
      </div>
    </section>
  )
}

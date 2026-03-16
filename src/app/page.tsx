import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Mic, BarChart, FileText, Bell, MessageSquare, Play } from "lucide-react";
import { TestimonialsSection } from "@/components/blocks/testimonials-with-marquee";
import { FAQAccordionBlock } from "@/components/blocks/faq-accordion-block";
import { PricingSection } from "@/components/blocks/pricing";
import { DottedSurface } from "@/components/ui/dotted-surface";

const pricingPlans = [
  {
    id: 'free',
    name: 'Free',
    info: 'For casual practice',
    price: {
      monthly: 0,
      yearly: 0,
    },
    features: [
      { text: '3 AI Voice Scenarios/mo', tooltip: 'Access standard practice sets' },
      { text: 'Basic Transcriptions' },
      { text: 'Overall Confidence Score', tooltip: 'A high-level view of your fluency' },
    ],
    btn: { text: 'Start for Free', href: '#' },
  },
  {
    highlighted: true,
    id: 'pro',
    name: 'Pro',
    info: 'For serious professionals',
    price: {
      monthly: 999,
      yearly: Math.round(999 * 12 * 0.8), // 20% off
    },
    features: [
      { text: 'Unlimited Voice Scenarios' },
      { text: 'Real-Time Live Hints', tooltip: 'Instant visual cues for filler words and pacing' },
      { text: 'Custom Roleplays', tooltip: 'Build custom prompts for exact situations' },
      { text: 'Detailed Session Insights', tooltip: 'Word usage, clarity, and pacing over time' },
      { text: 'Priority Email Support' },
    ],
    btn: { text: 'Get Started', href: '#' },
  },
  {
    name: 'Business',
    info: 'For teams & organizations',
    price: {
      monthly: 2499,
      yearly: Math.round(2499 * 12 * 0.8),
    },
    features: [
      { text: 'Everything in Pro' },
      { text: 'Team Management Dashboard' },
      { text: 'SAML SSO Integration' },
      { text: 'Aggregate Organization Analytics', tooltip: 'Track your entire teams communication health' },
      { text: 'Dedicated Account Manager' },
    ],
    btn: { text: 'Contact Sales', href: '#' },
  },
];

const testimonials = [
  {
    author: {
      name: "Prince Amorsolo Remo",
      handle: "@prince_amo",
      avatar: "https://scontent.fmnl17-3.fna.fbcdn.net/v/t39.30808-6/467770476_1247973759653184_403617074245582823_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=7b2446&_nc_eui2=AeHOzfANKy-oqm-k8EAZXmmxQJ-_AXk1RDVAn78BeTVENSnAkyxhKw8xs_t5wnLTKFSqpqd8GeTFelZA7-DVqTfz&_nc_ohc=wxwhMii9hP8Q7kNvwEpQsQ4&_nc_oc=AdkeTi7aF2hHAcEuADiqWNAnepQ0lDh1oP03ucGnKoKKVGxN_0efLhf0R8RThT8c3kA&_nc_zt=23&_nc_ht=scontent.fmnl17-3.fna&_nc_gid=Bdv_O6WO0bAUDBBgoCen_w&_nc_ss=8&oh=00_AfxAslkRy6Oz46-Yb8KIqubVK1Xe80IbODUJX295J_N7og&oe=69BD9E0D"
    },
    text: "Practicing with the AI voice coach felt so natural. The live hints were a game changer for my confidence.",
    href: "https://twitter.com/prince_amo"
  },
  {
    author: {
      name: "Samuel Muralididy",
      handle: "@samuel_m",
      avatar: "https://i.guim.co.uk/img/media/89185ff1a69b7f790d3d69ebef205e5451ea4bb5/0_273_6720_4032/master/6720.jpg?width=465&dpr=1&s=none&crop=none"
    },
    text: "I use Fluentia before big client pitches. It catches my filler words and helps me pace my delivery perfectly.",
    href: "https://twitter.com/samuel_m"
  },
  {
    author: {
      name: "Shadrack Castro",
      handle: "@shadrack_c",
      avatar: "https://scontent.fmnl17-7.fna.fbcdn.net/v/t1.6435-9/66521667_920359664982123_5510012998577553408_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=53a332&_nc_eui2=AeGO8Eevp5x_wkORWF9Y6q9mr76JoSO3rmevvomhI7euZ2VFB9vF5rMrdbqmtOAqAX6x8P3quk1L8HPfA7LtkFWL&_nc_ohc=dD-M0MucD84Q7kNvwGU9woY&_nc_oc=AdmMrojeUumNAMg4oKDXoXERcR3NhPZp2fUWN9tTCTW2gvJ5BrNhyqtaMLRsjF0zKZg&_nc_zt=23&_nc_ht=scontent.fmnl17-7.fna&_nc_gid=JGqrdCKx6OGhP3USr3wwNA&_nc_ss=8&oh=00_AfwPVDZtbC9I1ZC90jd3IyT4UJ_vWr24ARr8ljdDHuycWg&oe=69DF4761"
    },
    text: "The judgment-free zone gave me the safe space I needed to practice academic discussions without feeling embarrassed."
  },
  {
    author: {
      name: "Alex W.",
      handle: "@alexp",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    },
    text: "Being able to set up custom roleplay scenarios for difficult team conversations is absolutely invaluable."
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground dark selection:bg-primary/30 font-sans">
      
      {/* --- Navigation --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer">
            <span className="text-xl font-bold tracking-tight text-white uppercase">fluentia</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#blog" className="hover:text-white transition-colors">Blog</a>
            <a href="#docs" className="hover:text-white transition-colors">Docs</a>
            <a href="#company" className="hover:text-white transition-colors">Company</a>
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="hidden md:block text-sm font-medium text-white hover:text-primary transition-colors">Log In</a>
            <Button className="rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 h-9 text-xs uppercase tracking-wider">
              Try Now <Play className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      </nav>

      <main className="">
        {/* --- Hero Section --- */}
        <section className="relative px-6 flex flex-col items-center text-center pb-32 overflow-hidden min-h-[90vh]">
          {/* Animated Dotted Surface Background */}
          <DottedSurface />
          
          {/* Hero Content Wrapper */}
          <div className="relative z-10 flex flex-col items-center w-full pt-32">
            {/* Abstract green glow top */}
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

          <h1 className="text-5xl md:text-7xl lg:text-[80px] font-bold tracking-tight text-white leading-[1.05] mb-6 max-w-4xl mx-auto">
            The Real AI Voice Coach <br />
            <span className="text-muted-foreground font-medium">Speak with Confidence using</span><br />
            <span className="uppercase text-white">Fluentia</span>
          </h1>

          <div className="flex items-center gap-3 text-xs md:text-sm text-muted-foreground mb-10 border border-white/10 rounded-full px-4 py-2 bg-white/5 backdrop-blur-md">
             <span className="uppercase tracking-widest font-semibold text-primary">Live Feedback</span>
             <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
             <span>Real-time communication coaching.</span>
             <a href="#" className="text-white underline decoration-white/30 hover:decoration-white underline-offset-4 ml-1">Learn more...</a>
          </div>

          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-white mb-2">Go <span className="text-primary">SOLO</span> with FLUENTIA</p>
            <p className="text-sm text-muted-foreground">The AI companion you didn&apos;t know you needed.</p>
          </div>

          <div className="flex items-center gap-4 mb-20 relative z-10">
            <Button className="rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 h-12 text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(0,243,141,0.25)]">
              Try Now <Play className="w-4 h-4 ml-2" fill="currentColor" />
            </Button>
          </div>

          {/* Video Placeholder */}
          <div className="w-full max-w-[1000px] mx-auto aspect-[16/10] relative rounded-xl border border-white/10 bg-[#070707] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,243,141,0.1)] group cursor-pointer z-10 transition-transform duration-500 hover:scale-[1.02]">
             {/* Subtle glow behind video placeholder */}
             <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-primary/5 opacity-50"></div>
             
             {/* Fake UI Header for the "video/app" preview */}
             <div className="absolute top-0 w-full h-8 border-b border-white/5 flex items-center px-4 gap-2 bg-[#0a0a0a]">
               <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
             </div>

             {/* Play Button Overlay */}
             <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors duration-300">
                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:bg-primary/90 group-hover:text-black group-hover:border-primary transition-all duration-300">
                  <Play className="w-6 h-6 ml-1 transition-colors" fill="currentColor" />
                </div>
             </div>

             {/* UI mockup lines (abstract) inside video placeholder */}
             <div className="absolute inset-8 top-16 border-l border-white/5 flex gap-4">
                 <div className="w-64 h-full border-r border-white/5 opacity-50 rounded bg-white/[0.02]"></div>
                 <div className="flex-1 h-full opacity-50 flex flex-col gap-4">
                   <div className="w-full h-1/2 rounded bg-white/[0.02] border border-white/5"></div>
                   <div className="w-full h-1/2 rounded bg-white/[0.02] border border-white/5 relative overflow-hidden">
                      <div className="absolute bottom-0 right-0 p-4">
                        <div className="bg-primary/20 text-primary border border-primary/30 rounded px-2 py-1 text-[10px] font-mono uppercase">AI Ready</div>
                      </div>
                   </div>
                 </div>
             </div>
          </div>
          
          {/* Faint reflection at bottom of hero */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[150px] bg-primary/20 blur-[100px] -z-10 pointer-events-none"></div>
          </div>
        </section>

        {/* --- Features Grid Section --- */}
        <section id="features" className="py-24 relative px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
                What You&apos;ll Unlock<br />with FLUENTIA
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: <Mic />, title: "Voice AI Scenarios", desc: "Practice job interviews, academic discussions, or casual chats with an intelligent voice agent in a judgment-free zone." },
                { icon: <MessageSquare />, title: "Real-Time Coaching", desc: "Get live hints during conversations to adjust your pacing, reduce filler words, and sound instantly more confident." },
                { icon: <BarChart />, title: "Confidence Dashboard", desc: "Track your progress over time with detailed metrics on speech clarity, word usage, and overall fluency." },
                { icon: <FileText />, title: "Session Insights", desc: "Review complete transcripts and actionable insights after every practice scenario." },
                { icon: <Bell />, title: "Custom Scenarios", desc: "Create individualized roleplay scenes to practice exactly what you need for your upcoming meetings." },
                { icon: <LayoutDashboard />, title: "Historical Tracking", desc: "Keep a complete history of your conversations and watch your communication metrics improve week by week." }
              ].map((feature, i) => (
                <Card key={i} className="bg-[#080808] border-white/10 hover:border-primary/50 transition-all duration-300 group cursor-pointer overflow-hidden relative min-h-[220px]">
                  {/* Subtle hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-transparent to-primary/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <CardHeader className="pb-4 relative z-10">
                    <div className="flex justify-between items-start w-full">
                       <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-primary mb-6 group-hover:bg-primary/10 transition-colors">
                         {feature.icon}
                       </div>
                       <div className="text-[10px] font-mono text-muted-foreground uppercase opacity-0 group-hover:opacity-100 transition-opacity">0{i+1}</div>
                    </div>
                    <CardTitle className="text-lg font-medium text-white group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <CardDescription className="text-sm text-zinc-400 leading-relaxed">
                      {feature.desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* --- Mid Section CTA / Showcase --- */}
        <section className="py-32 relative px-6 border-t border-white/5 bg-[#050505]">
           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,243,141,0.05),transparent_70%)] pointer-events-none"></div>

           <div className="container mx-auto flex flex-col items-center text-center relative z-10 max-w-6xl">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
                Speak Better with FLUENTIA
              </h2>
              <p className="text-muted-foreground mb-16 max-w-2xl text-sm md:text-base">
                Whether you&apos;re preparing for a critical job interview or leading a team meeting, Fluentia gives you the real-time feedback and structured practice to communicate flawlessly.
              </p>

              <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-[#080808] border border-white/10 rounded-2xl flex items-center justify-center relative shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden group">
                {/* Fake UI mockup container */}
                <div className="absolute top-0 w-full h-10 border-b border-white/5 flex items-center px-4 bg-[#0a0a0a]">
                   <p className="text-xs text-muted-foreground mx-auto flex items-center gap-2"><BarChart className="w-3 h-3"/> fluentia-dashboard-preview</p>
                </div>

                {/* Content */}
                <div className="text-center relative z-10 flex flex-col items-center mt-10">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <span className="font-bold text-primary text-2xl uppercase tracking-tighter">Fl</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-md">
                     <p className="text-xs text-white">Live Audio Analysis Dashboard</p>
                  </div>
                </div>

                {/* decorative elements */}
                <div className="absolute bottom-0 right-0 p-8 flex gap-4">
                  <div className="w-48 h-32 rounded-lg bg-white/5 border border-white/10 transform translate-y-8 translate-x-8 -rotate-6 hidden md:block backdrop-blur-sm"></div>
                  <div className="w-64 h-48 rounded-lg bg-zinc-900 border border-white/10 transform translate-y-12 translate-x-12 hidden md:block shadow-xl"></div>
                </div>
              </div>
           </div>
        </section>

        {/* --- Testimonials / Loved by Devs --- */}
        <TestimonialsSection
          title="Loved by Users"
          description="Join thousands gaining confidence in their daily conversations."
          testimonials={testimonials}
        />

        {/* --- Pricing Section --- */}
        <div id="pricing" className="py-24 relative px-6 border-t border-white/5 bg-[#050505] overflow-hidden">
           {/* Faint dot grid */}
           <div className="absolute inset-0 bg-[radial-gradient(#00f38d18_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />
           {/* Radial glow - top center */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
           {/* Radial glow - bottom left accent */}
           <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
           {/* Radial glow - bottom right accent */}
           <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
           {/* Narrow glowing line at top edge */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

           <PricingSection 
             heading="Plans that Scale with You" 
             description="Whether you're practicing for a single interview or upgrading your entire team's communication skills, we have a plan for you."
             plans={pricingPlans}
             className="relative z-10 mx-auto max-w-6xl"
           />
        </div>

        {/* --- FAQ Section --- */}
        <FAQAccordionBlock />

        {/* --- Bottom Footer CTA Section --- */}
        <section className="pt-32 pb-16 border-t border-white/5 relative px-6 overflow-hidden">
          {/* Bottom Glow */}
          <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/10 rounded-full blur-[150px] -z-10 pointer-events-none" />
          
          <div className="container mx-auto flex flex-col items-center text-center max-w-6xl">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Get Started with <span className="uppercase">Fluentia</span>
            </h2>
            <p className="text-muted-foreground mb-10">Try it for Free</p>

            <Button className="rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 h-12 text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(0,243,141,0.2)] mb-24">
              Try Now <Play className="w-4 h-4 ml-2" fill="currentColor" />
            </Button>

            {/* Footer Links */}
            <div className="w-full flex flex-col md:flex-row justify-between items-start pt-16 border-t border-white/10 text-left gap-12 md:gap-0">
               <div className="flex flex-col gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                      <span className="font-bold text-black text-[10px] tracking-tighter shrink-0 uppercase">Fl</span>
                    </div>
                    <span className="text-sm font-bold tracking-tight text-white uppercase">fluentia</span>
                 </div>
                 <p className="text-xs text-muted-foreground mt-4">© 2026 Fluentia.<br/>All rights reserved.</p>
               </div>
               
               <div className="flex flex-wrap gap-16 text-sm">
                 <div className="flex flex-col gap-4">
                   <p className="text-white font-medium mb-1">Product</p>
                   <a href="#" className="text-muted-foreground hover:text-white transition-colors">Features</a>
                   <a href="#" className="text-muted-foreground hover:text-white transition-colors">Pricing</a>
                   <a href="#" className="text-muted-foreground hover:text-white transition-colors">Download</a>
                 </div>
                 <div className="flex flex-col gap-4">
                   <p className="text-white font-medium mb-1">Resources</p>
                   <a href="#" className="text-muted-foreground hover:text-white transition-colors">Blog</a>
                   <a href="#" className="text-muted-foreground hover:text-white transition-colors">Documentation</a>
                   <a href="#" className="text-muted-foreground hover:text-white transition-colors">Community</a>
                 </div>
                 <div className="flex flex-col gap-4">
                   <p className="text-white font-medium mb-1">Company</p>
                   <a href="#" className="text-muted-foreground hover:text-white transition-colors">About</a>
                   <a href="#" className="text-muted-foreground hover:text-white transition-colors">Careers</a>
                   <a href="#" className="text-muted-foreground hover:text-white transition-colors">Contact</a>
                 </div>
                 <div className="flex flex-col gap-4">
                   <p className="text-white font-medium mb-1">Legal</p>
                   <a href="#" className="text-muted-foreground hover:text-white transition-colors">Privacy Policy</a>
                   <a href="#" className="text-muted-foreground hover:text-white transition-colors">Terms of Service</a>
                 </div>
               </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

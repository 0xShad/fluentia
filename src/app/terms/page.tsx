import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Privacy & Data — Fluentia",
};

const sections = [
  {
    title: "What we collect",
    body: [
      "Voice transcripts — your speech is transcribed in real time by Deepgram during practice sessions. Transcripts are stored on your account and used exclusively to generate AI feedback.",
      "Audio recordings — when you consent, an mp3 of your session is stored securely in Supabase Storage under your account. You can opt out of audio recording on a per-session basis.",
      "Usage data — session duration, scenario selected, and performance scores. Never sold or shared with third parties.",
    ],
  },
  {
    title: "How we use your data",
    body: [
      "To generate AI coaching feedback via OpenAI. Transcripts are sent to OpenAI's API and are subject to their data processing terms.",
      "To display your history, trends, and progress on your dashboard.",
      "We do not use your voice data to train models. We do not share your data with advertisers.",
    ],
  },
  {
    title: "Audio recording consent",
    body: [
      "Recording is opt-in. You are shown a consent dialog before every session. If you check 'Remember my choice', your preference is saved to your account and applied to future sessions.",
      "Choosing 'Don't record this session' disables audio storage. Your transcript is still processed so feedback can be generated — without the transcript there is no feedback.",
      "You can change your recording preference at any time in Dashboard → Preferences.",
    ],
  },
  {
    title: "Data retention & deletion",
    body: [
      "Session transcripts and recordings are retained for as long as your account is active.",
      "Deleting a session from your history removes the transcript and recording from our servers.",
      "To delete your account and all associated data, contact us at support@fluentia.app.",
    ],
  },
  {
    title: "Third-party processors",
    body: [
      "Deepgram — real-time speech-to-text transcription.",
      "OpenAI — AI feedback generation using session transcripts.",
      "Vapi — voice session infrastructure.",
      "Supabase — database and file storage (hosted in the US).",
    ],
  },
];

const commitments = [
  {
    title: "Your data stays yours",
    body: "All session data is encrypted in transit and at rest. We do not sell, rent, or license your voice recordings or transcripts to any third party. Your data is used solely to operate Fluentia for you.",
  },
  {
    title: "Feedback that respects how you speak",
    body: "Our AI is designed to evaluate communication effectiveness — clarity, structure, and confidence — not to penalize accent, dialect, or cultural speaking style. Feedback focuses on what you said and how clearly it landed, not how you sound.",
  },
  {
    title: "You are always in control",
    body: "You can opt out of audio recording before any session, review your session history, and permanently delete your data at any time. We will never record a session without your explicit consent.",
  },
  {
    title: "A practice tool, not a replacement",
    body: "Fluentia is designed to help you build communication skills through deliberate practice. It is not a substitute for professional coaching, therapy, speech-language pathology, or any form of clinical assessment. If you have concerns about your communication that go beyond practice, we encourage you to seek qualified professional support.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-2xl mx-auto px-6 py-12">

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="mb-10">
          <p className="text-[11px] font-bold text-[#00F38D] uppercase tracking-widest mb-2">Privacy & Data</p>
          <h1 className="text-3xl font-extrabold text-white mb-3">How we handle your data</h1>
          <p className="text-sm text-white/40 leading-relaxed">
            Fluentia is a voice coaching tool. Here is exactly what we collect, why, and how you can control it.
            Last updated: May 2026.
          </p>
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-sm font-bold text-white mb-3">{section.title}</h2>
              <ul className="space-y-2.5">
                {section.body.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1 h-1 rounded-full bg-[#00F38D]/50 mt-2 shrink-0" />
                    <p className="text-sm text-white/45 leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Commitments */}
        <div className="mt-12 pt-10 border-t border-white/8">
          <p className="text-[11px] font-bold text-[#00F38D] uppercase tracking-widest mb-2">Our commitments</p>
          <h2 className="text-xl font-extrabold text-white mb-1">How we build responsibly</h2>
          <p className="text-sm text-white/35 mb-8 leading-relaxed">
            Beyond legal compliance, here is what we hold ourselves to.
          </p>
          <div className="space-y-4">
            {commitments.map((c) => (
              <div key={c.title} className="p-4 rounded-xl bg-white/[0.02] border border-white/8">
                <p className="text-sm font-semibold text-white mb-1.5">{c.title}</p>
                <p className="text-sm text-white/40 leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/8">
          <p className="text-xs text-white/25 leading-relaxed">
            Questions? Email{" "}
            <a href="mailto:support@fluentia.app" className="text-white/40 hover:text-white transition-colors underline underline-offset-2">
              support@fluentia.app
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

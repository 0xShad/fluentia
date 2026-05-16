export interface TermsSection {
  id: string;
  title: string;
  body: string[];
}

export interface Commitment {
  title: string;
  body: string;
}

export const termsSections: TermsSection[] = [
  {
    id: "acceptance-of-terms",
    title: "1. Acceptance of Terms",
    body: [
      "By accessing or using Fluentia (the \"Service\"), you agree to be bound by these Terms & Conditions and our Privacy Policy. If you do not agree to these terms, you must not use the Service.",
      "These Terms constitute a legally binding agreement between you and Fluentia. Your continued use of the Service after any updates constitutes acceptance of the revised Terms.",
      "We reserve the right to update these Terms at any time. We will notify you of material changes by updating the date at the top of this page and, where appropriate, by email.",
    ],
  },
  {
    id: "service-description",
    title: "2. Service Description",
    body: [
      "Fluentia is an AI-powered communication coaching platform that enables users to practice verbal communication through scenario-based roleplay sessions with an AI agent powered by Vapi and GPT-4o.",
      "After each session, you receive AI-generated feedback, performance scores, and transcript analysis designed to help you improve clarity, confidence, and communication effectiveness.",
      "The Service is intended for personal skill development and educational purposes only. It is not a substitute for professional coaching, therapy, speech-language pathology, or any form of clinical or psychological assessment.",
    ],
  },
  {
    id: "eligibility-account-registration",
    title: "3. Eligibility & Account Registration",
    body: [
      "You must be at least 13 years of age to use Fluentia. If you are under 16 and located in the European Economic Area (EEA), you must have verifiable parental or guardian consent.",
      "You agree to provide accurate, current, and complete information when registering and to keep your account information updated. You are solely responsible for maintaining the confidentiality of your login credentials.",
      "You may not create an account on behalf of another person without authorization, or share your account with others. Each account is for individual use only.",
      "We reserve the right to refuse registration or terminate accounts at our sole discretion, including for violations of these Terms.",
    ],
  },
  {
    id: "acceptable-use",
    title: "4. Acceptable Use",
    body: [
      "You agree to use Fluentia only for lawful purposes and in a manner consistent with these Terms. You must not use the Service to upload, transmit, or generate content that is illegal, harmful, threatening, abusive, defamatory, obscene, or otherwise objectionable.",
      "You must not attempt to reverse-engineer, decompile, disassemble, or otherwise derive source code from any part of the Service. Automated access (scraping, bots, crawlers) is strictly prohibited without prior written consent.",
      "You must not attempt to interfere with, compromise the integrity of, or gain unauthorized access to the Service's systems, servers, or data belonging to other users.",
      "Violations of acceptable use may result in immediate account suspension or termination without notice, and may be reported to relevant law enforcement authorities.",
    ],
  },
  {
    id: "ai-content-disclaimer",
    title: "5. AI-Generated Content & Disclaimer",
    body: [
      "Coaching feedback, performance scores, and all AI-generated analysis are produced by large language models (including OpenAI GPT-4o) and are provided for informational and educational purposes only.",
      "AI feedback reflects patterns in your communication during a session. It does not constitute professional advice, diagnosis, or assessment of any kind. Fluentia makes no warranty regarding the accuracy, completeness, or fitness for any particular purpose of AI-generated content.",
      "You acknowledge that AI systems can make mistakes, reflect biases, or produce inconsistent output. Always apply your own judgment when interpreting coaching feedback.",
      "Our AI evaluates communication effectiveness — structure, clarity, and delivery — and is not designed to evaluate or penalise accent, dialect, or cultural speaking style.",
    ],
  },
  {
    id: "intellectual-property",
    title: "6. Intellectual Property",
    body: [
      "The Fluentia name, logo, branding, software, interface design, scenario content, and all related intellectual property are owned by or licensed to Fluentia and are protected by applicable copyright, trademark, and other intellectual property laws.",
      "Your session transcripts, recordings, and personal data remain your property. By using the Service, you grant Fluentia a limited, non-exclusive, royalty-free licence to process and store your data solely to operate and improve the Service for you.",
      "You may not reproduce, distribute, modify, or create derivative works of any Fluentia content without our express written permission.",
    ],
  },
  {
    id: "limitation-of-liability",
    title: "7. Limitation of Liability",
    body: [
      "To the maximum extent permitted by applicable law, Fluentia and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, the Service.",
      "Our total aggregate liability to you for any claim arising from use of the Service shall not exceed the amount you paid to Fluentia in the twelve (12) months preceding the event giving rise to the claim, or USD $50, whichever is greater.",
      "Some jurisdictions do not allow the exclusion or limitation of certain damages, so the above limitations may not apply to you to the extent prohibited by applicable law.",
    ],
  },
  {
    id: "disclaimer-of-warranties",
    title: "8. Disclaimer of Warranties",
    body: [
      "The Service is provided \"as is\" and \"as available\" without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.",
      "Fluentia does not warrant that the Service will be uninterrupted, error-free, or free of viruses or other harmful components. We do not warrant the accuracy or reliability of any AI-generated feedback.",
      "You use the Service at your own risk. We are not responsible for any outcomes resulting from applying coaching feedback to real-world situations.",
    ],
  },
  {
    id: "termination",
    title: "9. Termination",
    body: [
      "You may delete your account at any time by contacting support@fluentia.app. Upon deletion, your personal data will be removed in accordance with our data retention policy.",
      "We may suspend or terminate your account immediately and without notice if we determine, in our sole discretion, that you have violated these Terms, engaged in fraudulent activity, or pose a risk to the integrity of the Service or other users.",
      "Upon termination, your right to use the Service ceases immediately. Provisions of these Terms that by their nature should survive termination will remain in effect.",
    ],
  },
  {
    id: "governing-law",
    title: "10. Governing Law & Disputes",
    body: [
      "These Terms are governed by and construed in accordance with applicable law. Any disputes arising from or relating to these Terms or the Service shall first be attempted to be resolved through good-faith negotiation.",
      "If a dispute cannot be resolved informally, you agree that it shall be subject to binding arbitration or the courts of competent jurisdiction, depending on the laws applicable in your territory.",
      "Nothing in these Terms prevents either party from seeking urgent injunctive or other equitable relief in a court of competent jurisdiction.",
    ],
  },
];

export const privacySections: TermsSection[] = [
  {
    id: "what-we-collect",
    title: "What We Collect",
    body: [
      "Account information — your name, email address, and password (stored as a secure hash) when you register. If you sign up via OAuth (Google, GitHub), we receive only the information that provider shares with us.",
      "Voice transcripts — your speech is transcribed in real time during practice sessions. Transcripts are stored on your account and used exclusively to generate AI coaching feedback.",
      "Audio recordings — when you consent, an mp3 of your session is stored securely in Supabase Storage under your account. Recording is entirely opt-in on a per-session basis.",
      "Usage and performance data — session duration, scenario selected, performance scores, grades, and in-session interaction metadata. This data powers your dashboard and progress tracking.",
      "Device and technical data — browser type, operating system, IP address, and session logs for security monitoring and service reliability. This data is not linked to your identity for marketing purposes.",
    ],
  },
  {
    id: "how-we-use-data",
    title: "How We Use Your Data",
    body: [
      "To operate the Service — delivering voice sessions, generating AI coaching feedback, storing your history, and providing your personalised dashboard.",
      "To generate AI feedback — your session transcripts are sent to OpenAI's API (GPT-4o) for analysis. This transmission is governed by OpenAI's data processing terms. We do not use your transcripts to train AI models.",
      "To improve the Service — aggregated, anonymised usage patterns (e.g. which scenarios are most used, average session duration) help us improve the platform. Individual transcripts or recordings are never used for this purpose.",
      "For security and fraud prevention — technical logs and IP data are used to detect and prevent abuse, unauthorised access, and violations of these Terms.",
      "We do not sell, rent, licence, or share your personal data with advertisers, data brokers, or any third party for commercial purposes.",
    ],
  },
  {
    id: "audio-recording-consent",
    title: "Audio Recording Consent",
    body: [
      "Recording is strictly opt-in. You are shown a clear consent dialog before every session. No audio is ever captured without your explicit confirmation.",
      "If you select 'Remember my choice', your preference is saved to your account and applied automatically to future sessions. You can change this at any time in Dashboard → Preferences.",
      "Choosing not to record disables audio storage for that session. Your speech is still transcribed in real time so AI feedback can be generated — the transcript is required for feedback to work.",
      "Recordings are stored encrypted in Supabase Storage under your account's isolated storage path. No other user or third party can access your recordings.",
    ],
  },
  {
    id: "data-retention",
    title: "Data Retention & Deletion",
    body: [
      "Session transcripts and recordings are retained for as long as your account is active. There is no automatic expiry.",
      "Deleting an individual session from your history permanently removes the associated transcript and recording from our servers and storage. This action cannot be undone.",
      "Deleting your account removes all personal data associated with your account, including transcripts, recordings, performance scores, and preferences. To request account deletion, contact support@fluentia.app.",
      "We will fulfil verified account deletion requests within 30 days.",
    ],
  },
  {
    id: "privacy-rights",
    title: "Your Privacy Rights",
    body: [
      "Depending on your jurisdiction, you may have the right to access, correct, port, restrict processing of, or delete your personal data. To exercise any of these rights, contact support@fluentia.app.",
      "EU/EEA residents (GDPR) — you have the right to access your data, rectify inaccuracies, erase your data, restrict or object to processing, and data portability. You also have the right to lodge a complaint with your local data protection authority.",
      "California residents (CCPA/CPRA) — you have the right to know what personal information we collect, the right to delete it, the right to opt out of sale (we do not sell personal information), and the right not to be discriminated against for exercising these rights.",
      "We will respond to verified rights requests within the timeframe required by applicable law, typically 30 days.",
    ],
  },
  {
    id: "cookies-tracking",
    title: "Cookies & Tracking",
    body: [
      "Fluentia uses strictly necessary cookies and browser storage to manage your authentication session (via Supabase Auth). These are required for the Service to function and cannot be disabled.",
      "We do not use advertising cookies, cross-site tracking pixels, or third-party analytics SDKs that fingerprint or profile you across the web.",
      "Session storage is cleared when you close your browser. Authentication tokens expire automatically and are refreshed securely.",
    ],
  },
  {
    id: "third-party-processors",
    title: "Third-Party Processors",
    body: [
      "Vapi — real-time voice session infrastructure and AI agent orchestration. Processes your voice input during active sessions.",
      "OpenAI — AI feedback generation using session transcripts. Subject to OpenAI's API data processing addendum.",
      "Supabase — primary database, authentication, and encrypted file storage. Data is hosted in the United States.",
      "ElevenLabs — AI voice synthesis for the coaching agent's spoken responses during sessions.",
      "All third-party processors are contractually required to handle your data securely and only as instructed by Fluentia. We do not authorise them to use your data for their own purposes.",
    ],
  },
  {
    id: "international-transfers",
    title: "International Data Transfers",
    body: [
      "Fluentia's infrastructure is primarily hosted in the United States. If you access the Service from outside the US, your data will be transferred to and processed in the US.",
      "For users in the EEA or UK, such transfers are made under appropriate safeguards as required by GDPR, including Standard Contractual Clauses where applicable.",
      "By using the Service, you acknowledge and consent to the transfer of your information to countries that may have different data protection laws than your country of residence.",
    ],
  },
  {
    id: "childrens-privacy",
    title: "Children's Privacy",
    body: [
      "Fluentia is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13.",
      "If you are a parent or guardian and believe your child has provided personal information without your consent, please contact us at support@fluentia.app and we will promptly delete it.",
    ],
  },
];

export const commitments: Commitment[] = [
  {
    title: "Your data stays yours",
    body: "All session data is encrypted in transit (TLS 1.2+) and at rest. We do not sell, rent, or licence your voice recordings or transcripts to any third party. Your data is used solely to operate Fluentia for you.",
  },
  {
    title: "No model training on your voice",
    body: "We explicitly do not use your transcripts or recordings to train, fine-tune, or evaluate AI models — neither our own nor any third party's. Your sessions are processed to give you feedback, then stored privately under your account.",
  },
  {
    title: "You are always in control",
    body: "You can opt out of audio recording before any session, review and delete individual sessions from your history, and request full account deletion at any time. We will never record a session without your explicit, informed consent.",
  },
  {
    title: "Feedback respects how you speak",
    body: "Our AI evaluates communication effectiveness — clarity, structure, confidence, and delivery. It is not designed to penalise accent, dialect, or cultural speaking style. Feedback focuses on what you said and how clearly it landed.",
  },
  {
    title: "A practice tool, not a clinical service",
    body: "Fluentia is designed to help you build communication skills through deliberate practice. It is not a substitute for professional coaching, therapy, speech-language pathology, or any form of clinical or psychological assessment.",
  },
];

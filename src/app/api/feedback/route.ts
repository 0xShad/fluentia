import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/server";
import type { SessionFeedback } from "@/types/feedback.types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { transcript, scenarioTitle, aiRole, category, scenarioId, elapsedSeconds, vapiCallId } = await req.json();

    const userLines = (transcript as { speaker: string; text: string }[]).filter(
      (l) => l.speaker === "User"
    );

    if (userLines.length === 0) {
      return NextResponse.json({
        overallScore: 0,
        grade: "N/A",
        summary: "No speech was detected in this session.",
        strengths: [],
        improvements: [
          {
            title: "Complete a full session",
            description: "Speak during the session to receive personalized feedback.",
          },
        ],
        fillerWords: [],
        categories: [
          { name: "Fluency",         score: 0, feedback: "No data." },
          { name: "Clarity",         score: 0, feedback: "No data." },
          { name: "Confidence",      score: 0, feedback: "No data." },
          { name: "Professionalism", score: 0, feedback: "No data." },
        ],
      } satisfies SessionFeedback);
    }

    const formatted = (transcript as { speaker: string; text: string }[])
      .map((l) => `${l.speaker === "AI" ? aiRole : "You"}: ${l.text}`)
      .join("\n");

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const deadAirCount = (transcript as { speaker: string }[]).filter(l => l.speaker === "System").length;
    const sessionMinutes = elapsedSeconds ? Math.round(elapsedSeconds / 60) : null;

    const categoryWeights: Record<string, string> = {
      Interview:       "Professionalism 30%, Clarity 30%, Confidence 25%, Fluency 15%",
      Business:        "Clarity 30%, Professionalism 30%, Confidence 25%, Fluency 15%",
      Social:          "Fluency 35%, Confidence 30%, Clarity 25%, Professionalism 10%",
      "Public Speaking":"Fluency 30%, Clarity 30%, Confidence 30%, Professionalism 10%",
      Everyday:        "Fluency 30%, Clarity 30%, Confidence 25%, Professionalism 15%",
    };
    const weights = categoryWeights[category] ?? "Fluency 25%, Clarity 25%, Confidence 25%, Professionalism 25%";

    const prompt = `You are a rigorous professional communication coach evaluating a "${scenarioTitle}" (${category}) practice session. Score honestly — a weak session should score below 55, a strong one above 80. Do NOT cluster scores around 40-55.

TRANSCRIPT:
${formatted}

SESSION CONTEXT: ${sessionMinutes ? `~${sessionMinutes} min session` : "duration unknown"}, ${deadAirCount} dead-air / silence marker(s) detected.

━━ SCORING RUBRICS ━━

Fluency — smoothness and rhythm of speech:
  90-100 Consistently smooth, natural pacing, near-zero fillers or pauses
  75-89  Mostly fluent; 1-2 minor hesitations per minute
  60-74  Noticeable pauses/fillers but ideas still land
  45-59  Frequent disruptions; multiple long pauses or fillers per exchange
  30-44  Highly fragmented; hard to follow the thread
  0-29   Incoherent; dominated by dead air or broken sentences

Clarity — how well ideas are conveyed and understood:
  90-100 All points specific, structured, and instantly understood
  75-89  Mostly clear; one or two vague areas
  60-74  Core message comes through but with notable gaps
  45-59  Partial ideas; listener must fill significant gaps
  30-44  Responses lack key details; understanding is difficult
  0-29   Off-topic, missing, or nearly impossible to follow

Confidence — assertiveness and self-assurance in delivery:
  90-100 Highly assured tone, direct assertions, no hedging
  75-89  Confident overall; occasional soft qualifiers
  60-74  Some confident moments; clear uncertainty elsewhere
  45-59  Mostly hesitant; trailing off or over-qualifying
  30-44  Sounds unsure throughout; lacks assertiveness
  0-29   Almost no confidence evident in any response

Professionalism — appropriateness of language, tone, and content:
  90-100 Perfectly appropriate; structured, no informalities
  75-89  Professional throughout; at most one minor lapse
  60-74  Mostly professional; noticeable lapses
  45-59  Multiple lapses; some inappropriate phrasing
  30-44  Largely informal; does not meet workplace standards
  0-29   Language or content entirely inappropriate

━━ OVERALL SCORE FORMULA ━━
1. Apply category weights for ${category}: ${weights}
2. Compute the weighted average (this is your base score).
3. Apply these modifiers:
   - Any single category below 30 → subtract 5
   - ${deadAirCount >= 3 ? `${deadAirCount} dead-air markers detected → subtract ${Math.min(deadAirCount, 5)}` : "Fewer than 3 dead-air markers → no penalty"}
   - Session under 60 seconds → cap overall at 65
4. Round to nearest integer. This is overallScore.

Grade mapping (MUST match overallScore):
  A+: 97-100  A: 93-96  A-: 90-92
  B+: 87-89   B: 83-86  B-: 80-82
  C+: 77-79   C: 70-76
  D: 60-69    F: 0-59

Return ONLY a valid JSON object — no markdown, no code fences, no extra text:
{
  "overallScore": <integer 0-100 computed via formula above>,
  "grade": <grade string matching overallScore>,
  "summary": "<2-3 sentences referencing actual content from the transcript>",
  "strengths": ["<specific strength visible in the transcript>"],
  "improvements": [
    {
      "title": "<concise issue title>",
      "description": "<specific actionable guidance>",
      "example": "<exact quote from transcript illustrating this issue, if one exists>"
    }
  ],
  "fillerWords": [
    { "word": "<filler word>", "count": <exact count in transcript> }
  ],
  "categories": [
    { "name": "Fluency",         "score": <0-100 per rubric>, "feedback": "<one specific sentence>" },
    { "name": "Clarity",         "score": <0-100 per rubric>, "feedback": "<one specific sentence>" },
    { "name": "Confidence",      "score": <0-100 per rubric>, "feedback": "<one specific sentence>" },
    { "name": "Professionalism", "score": <0-100 per rubric>, "feedback": "<one specific sentence>" }
  ]
}

Rules:
- Use the FULL score range. Scores must differentiate: if two categories are truly different, they must have different scores.
- Only count filler words that actually appear in the transcript (uh, um, uhh, umm, like, you know, basically, literally, right, so, well, kind of, sort of, actually). Count exactly.
- Include 2-4 strengths and 2-5 improvements.
- Use real transcript quotes in "example" fields wherever applicable.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Strip accidental markdown fences if present
    const json = text.startsWith("```") ? text.replace(/^```[a-z]*\n?/, "").replace(/```$/, "").trim() : text;

    const feedback = JSON.parse(json) as SessionFeedback;

    // Save to DB and return the session ID so the client can trigger recording upload
    let sessionId: string | null = null;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: inserted } = await supabase
          .from("session_feedback")
          .insert({
            user_id: user.id,
            scenario_id: scenarioId ?? "unknown",
            scenario_title: scenarioTitle,
            category,
            overall_score: feedback.overallScore,
            grade: feedback.grade,
            summary: feedback.summary,
            strengths: feedback.strengths,
            improvements: feedback.improvements,
            filler_words: feedback.fillerWords,
            categories: feedback.categories,
            transcript,
            elapsed_seconds: elapsedSeconds ?? 0,
            vapi_call_id: vapiCallId ?? null,
          })
          .select("id")
          .single();
        sessionId = inserted?.id ?? null;
      }
    } catch (dbErr) {
      console.error("Failed to save feedback to DB:", dbErr);
    }

    return NextResponse.json({ ...feedback, sessionId });
  } catch (err: any) {
    console.error("Feedback API error:", err);
    return NextResponse.json({ error: err.message ?? "Analysis failed" }, { status: 500 });
  }
}

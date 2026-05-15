import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/server";
import type { SessionFeedback } from "@/types/feedback.types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { transcript, scenarioTitle, aiRole, category, scenarioId, elapsedSeconds } = await req.json();

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

    const prompt = `You are an expert communication coach specializing in ${category} scenarios. Carefully analyze this "${scenarioTitle}" practice session transcript and provide honest, specific, actionable feedback based only on what was actually said.

TRANSCRIPT:
${formatted}

Return ONLY a valid JSON object — no markdown, no code fences, no extra text — matching this exact structure:
{
  "overallScore": <integer 0-100>,
  "grade": <"A+" | "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C" | "D" | "F">,
  "summary": "<2-3 sentence overall assessment referencing actual content>",
  "strengths": ["<specific strength visible in the transcript>"],
  "improvements": [
    {
      "title": "<concise issue title>",
      "description": "<specific, actionable guidance>",
      "example": "<exact quote from transcript that shows this issue, if one exists>"
    }
  ],
  "fillerWords": [
    { "word": "<filler word or phrase>", "count": <exact occurrences in transcript> }
  ],
  "categories": [
    { "name": "Fluency",         "score": <0-100>, "feedback": "<one specific sentence>" },
    { "name": "Clarity",         "score": <0-100>, "feedback": "<one specific sentence>" },
    { "name": "Confidence",      "score": <0-100>, "feedback": "<one specific sentence>" },
    { "name": "Professionalism", "score": <0-100>, "feedback": "<one specific sentence>" }
  ]
}

Rules:
- Only list filler words that actually appear (uhh, umm, uh, um, like, you know, basically, literally, right, so, well, kind of, sort of, actually). Count exactly.
- Include 2-4 strengths and 2-5 improvements.
- Quote real lines from the transcript in "example" fields when applicable.
- Base overallScore on the average of the four category scores, adjusted for severity of issues.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Strip accidental markdown fences if present
    const json = text.startsWith("```") ? text.replace(/^```[a-z]*\n?/, "").replace(/```$/, "").trim() : text;

    const feedback = JSON.parse(json) as SessionFeedback;

    // Save to DB without blocking the response
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("session_feedback").insert({
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
        });
      }
    } catch (dbErr) {
      console.error("Failed to save feedback to DB:", dbErr);
    }

    return NextResponse.json(feedback);
  } catch (err: any) {
    console.error("Feedback API error:", err);
    return NextResponse.json({ error: err.message ?? "Analysis failed" }, { status: 500 });
  }
}

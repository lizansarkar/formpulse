import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {
      userMessage,
      currentQuestion,
      formTitle,
      formDescription,
      answersSoFar,
      isFinalSummary,
    } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        reply: null,
        message: "No Gemini API key configured in .env",
      });
    }

    const systemPrompt = `You are a polite, concise, and ultra-professional AI concierge for an interactive form titled "${formTitle || "FormPulse Form"}".
Context: ${formDescription || "Collecting responses from visitors."}
The user is filling out this form conversationally.
${
  isFinalSummary
    ? `The user has completed all questions. The answers collected are: ${JSON.stringify(
        answersSoFar || {}
      )}. Provide a warm, personalized 1-2 sentence thank-you message acknowledging their submission.`
    : `The user was asked: "${currentQuestion || "a question"}" and responded: "${userMessage}".
Acknowledge their answer in 1 brief, warm, natural conversational sentence (max 20 words). Do not repeat the next question. Make it sound genuine and helpful.`
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: systemPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 120,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.warn("[Gemini API] Request failed:", response.status, errText);
      return NextResponse.json({ reply: null, status: response.status });
    }

    const data = await response.json();
    const candidate = data?.candidates?.[0];
    const replyText =
      candidate?.content?.parts?.[0]?.text?.trim() || null;

    return NextResponse.json({
      success: true,
      reply: replyText,
      model: "gemini-3.5-flash-lite",
    });
  } catch (error) {
    console.error("[Gemini API] Exception:", error);
    return NextResponse.json(
      { reply: null, error: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import {
  getFormByIdOrSlug,
  getSubmissionsByFormId,
  createSubmission,
} from "@/lib/storage";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const form = await getFormByIdOrSlug(id);

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const submissions = await getSubmissionsByFormId(form.id);
    return NextResponse.json({ submissions, count: submissions.length });
  } catch (error) {
    console.error("Failed to fetch submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const form = await getFormByIdOrSlug(id);

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (!form.isPublished) {
      return NextResponse.json(
        { error: "This form is currently unpublished and not accepting submissions." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const answers = body.answers || {};
    const metadata = body.metadata || {};

    // Validate required questions
    for (const question of form.questions) {
      const answer = answers[question.id];
      if (question.required) {
        if (
          answer === undefined ||
          answer === null ||
          (typeof answer === "string" && !answer.trim())
        ) {
          return NextResponse.json(
            {
              error: `Question "${question.title}" is required.`,
              questionId: question.id,
            },
            { status: 400 }
          );
        }
      }

      // Validate email format if provided
      if (question.type === "email" && answer) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(answer).trim())) {
          return NextResponse.json(
            {
              error: `Please provide a valid email address for "${question.title}".`,
              questionId: question.id,
            },
            { status: 400 }
          );
        }
      }
    }

    const submission = await createSubmission(form.id, answers, metadata);
    return NextResponse.json(
      {
        success: true,
        submission,
        message: form.theme.completionMessage || "Response submitted successfully!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to submit form answers:", error);
    return NextResponse.json(
      { error: "Failed to save submission" },
      { status: 500 }
    );
  }
}

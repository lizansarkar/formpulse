import { NextResponse } from "next/server";
import { getAllForms, createForm } from "@/lib/storage";

export async function GET() {
  try {
    const forms = await getAllForms();
    return NextResponse.json({ forms });
  } catch (error) {
    console.error("Failed to fetch forms:", error);
    return NextResponse.json(
      { error: "Failed to fetch forms" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
      return NextResponse.json(
        { error: "Form title is required" },
        { status: 400 }
      );
    }

    const newForm = await createForm(body);
    return NextResponse.json({ form: newForm }, { status: 201 });
  } catch (error) {
    console.error("Failed to create form:", error);
    return NextResponse.json(
      { error: "Failed to create form" },
      { status: 500 }
    );
  }
}

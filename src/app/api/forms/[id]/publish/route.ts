import { NextResponse } from "next/server";
import { togglePublishForm } from "@/lib/storage";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const updated = await togglePublishForm(id);

    if (!updated) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json({
      form: updated,
      message: updated.isPublished ? "Form published" : "Form unpublished",
    });
  } catch (error) {
    console.error("Failed to toggle form publish state:", error);
    return NextResponse.json(
      { error: "Failed to toggle form publish state" },
      { status: 500 }
    );
  }
}

import { redirect } from "next/navigation";
import { getAllForms } from "@/lib/storage";

export default async function EmbedDemoRedirect() {
  const forms = await getAllForms();
  const firstPublished = forms.find((f) => f.isPublished) || forms[0];

  if (firstPublished) {
    redirect(`/embed-demo/${firstPublished.id}`);
  }

  redirect("/dashboard");
}

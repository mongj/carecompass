import { redirect } from "next/navigation";

export default async function Home() {
  // Redirect to chat page, we reserve this page for future use e.g. landing page
  redirect("/chat");
}

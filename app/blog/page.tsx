import { redirect } from "next/navigation";

// Redirect non-localized /blog to default locale (tr)
export default function Page() {
  redirect(`/tr/blog`);
}

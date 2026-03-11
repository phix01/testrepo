import { redirect } from "next/navigation";

// Basit redirect: /blog/:id → /tr/blog/:id (varsayılan locale 'tr')
export default function Page({ params }: { params: { id: string } }) {
  const id = params?.id;
  if (!id) return null;
  // Eğer sitede varsayılan diliniz farklıysa 'tr' yerine onu koyun
  redirect(`/tr/blog/${id}`);
}

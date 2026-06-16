import { redirect } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export default async function ProductEditRedirectPage({ params }: Props) {
  const { slug } = await params;
  redirect(`/admin/products/${slug}/edit`);
}

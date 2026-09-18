import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPage } from "@/components/common/ContentPage";
import { ApiRequestError, getContentPage } from "@/lib/api";
import { entryMetadata } from "@/lib/metadata";

export const revalidate = 30;

async function publishedPage(slug: string) {
  if (slug.length < 2 || slug.length > 180 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) notFound();
  try {
    return (await getContentPage(slug)).data;
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) notFound();
    throw error;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const page = await publishedPage((await params).slug);
  return entryMetadata({
    title: page.title,
    description: `Read ${page.title} from BR Tours and Travels.`,
    metaTitle: page.seoTitle, metaDescription: page.seoDescription,
    path: `/${page.slug}`,
  });
}

export default async function CustomContentPage({ params }: { params: Promise<{ slug: string }> }) {
  const page = await publishedPage((await params).slug);
  return <ContentPage eyebrow="BR Tours and Travels" page={page} />;
}

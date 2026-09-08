import type { BlogCard as BlogCardData } from "@/lib/contracts";
import { BlogCard } from "@/components/blog/BlogCard";
import { SectionHeader } from "@/components/common/SectionHeader";

export function TravelJournalPreview({ posts }: { posts: BlogCardData[] }) {
  if (!posts.length) return null;
  return (
    <section className="defer-render bg-bg-muted py-24 max-[820px]:py-[4.5rem]">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeader
          eyebrow="The travel journal"
          title="Good journeys begin with useful context."
          description="Practical notes and destination stories from the BR editorial desk."
          href="/blog"
          linkLabel="Read the journal"
        />
        <div className="grid grid-cols-3 gap-6 max-[960px]:grid-cols-2 max-[620px]:grid-cols-1">
          {posts.slice(0, 3).map((item) => <BlogCard item={item} key={item.id} />)}
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import type { BlogCard } from "@/lib/contracts";

export function JournalHighlights({ posts }: { posts: BlogCard[] }) {
  if (!posts.length) return null;
  return (
    <section aria-labelledby="journal-highlights-title">
      <div className="mb-7 flex items-end justify-between gap-4"><div><p className="mb-3 text-[0.75rem] font-extrabold uppercase tracking-[0.16em] text-secondary-hover">Start here</p><h2 className="m-0 font-display text-[clamp(1.85rem,3vw,3rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-text-heading" id="journal-highlights-title">Journal highlights.</h2></div><p className="m-0 text-[0.78rem] text-text-muted max-[620px]:hidden">Useful context for journeys in season</p></div>
      <ol className="grid list-none grid-cols-3 gap-4 p-0 max-[850px]:grid-cols-1">
        {posts.slice(0, 3).map((post, index) => <li className="grid grid-cols-[3rem_1fr] gap-4 rounded-xl border border-border-subtle bg-white p-5 shadow-card" key={post.id}><span className="font-display text-3xl font-semibold leading-none text-secondary">0{index + 1}</span><div><p className="m-0 text-[0.67rem] font-extrabold uppercase tracking-[0.12em] text-primary">{post.category?.name ?? "Field guide"}</p><h3 className="mb-0 mt-2 font-display text-[1.08rem] font-semibold leading-snug text-text-heading"><Link className="no-underline transition hover:text-primary" href={`/blog/${post.slug}`}>{post.title}</Link></h3></div></li>)}
      </ol>
    </section>
  );
}

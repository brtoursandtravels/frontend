import Link from "next/link";
import type { GalleryAlbumCard } from "@/lib/contracts";
import { PublicImage } from "@/components/common/PublicImage";
import { SectionHeader } from "@/components/common/SectionHeader";

export function GalleryPreview({ albums }: { albums: GalleryAlbumCard[] }) {
  const items = albums.filter((album) => album.cover).slice(0, 5);
  if (!items.length) return null;
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 lg:px-10 max-[820px]:py-[4.5rem]">
      <SectionHeader
        eyebrow="Postcards from the road"
        title="A glimpse of what could be next."
        href="/gallery"
        linkLabel="Open the gallery"
      />
      <div className="grid grid-cols-3 grid-rows-[repeat(2,16rem)] gap-3 max-[820px]:grid-cols-2 max-[820px]:grid-rows-[repeat(3,14rem)] max-[620px]:grid-cols-1 max-[620px]:grid-rows-none">
        {items.map((album, index) => (
          <Link className={`group relative overflow-hidden rounded-lg bg-primary max-[620px]:aspect-[4/3] ${index === 0 ? "row-span-2 max-[620px]:row-auto" : ""} ${index === 3 ? "col-span-2 max-[820px]:col-auto" : ""}`} href="/gallery" key={album.id}>
            <PublicImage className="object-cover transition-transform duration-700 group-hover:scale-105" alt={album.cover!.altText} src={album.cover!.url} sizes="(max-width: 767px) 100vw, 33vw" />
            <span className="absolute inset-x-0 bottom-0 grid bg-gradient-to-t from-black/85 to-transparent p-5 pt-14 text-white"><strong className="font-display text-xl">{album.title}</strong><small className="text-white/65">{album.destination?.name ?? "BR gallery"}</small></span>
          </Link>
        ))}
      </div>
    </section>
  );
}

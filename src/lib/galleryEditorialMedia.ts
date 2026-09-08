import type { GalleryAlbum, PublicMedia } from "@/lib/contracts";

const editorialMedia: Record<string, PublicMedia[]> = {
  jaisalmer: [
    { id: "editorial-jaisalmer-dunes", url: "/images/hero-slider/jaisalmer-dunes.webp", width: 1672, height: 941, altText: "Golden dunes stretching across the Thar Desert near Jaisalmer", caption: "Last light moving across the Thar Desert dunes" },
  ],
  matheran: [
    { id: "editorial-matheran-train", url: "/images/gallery/matheran-toy-train.webp", width: 1600, height: 1000, altText: "Matheran heritage toy train curving through a misty monsoon forest", caption: "The heritage railway winding through rain-washed forest" },
    { id: "editorial-matheran-lake", url: "/images/gallery/matheran-charlotte-lake.webp", width: 1000, height: 1250, altText: "Charlotte Lake surrounded by misty green Matheran hills", caption: "A quiet monsoon morning beside Charlotte Lake" },
  ],
  "char-dham": [
    { id: "editorial-char-dham-peaks", url: "/images/tours/himalayan-morning-hero.webp", width: 1672, height: 941, altText: "Sunrise warming Himalayan peaks above a pine valley", caption: "First light across the high Himalayan valleys" },
    { id: "editorial-char-dham-road", url: "/images/tours/main-tours-hero.webp", width: 1600, height: 900, altText: "A mountain road winding through the Himalayas at sunrise", caption: "The road into Uttarakhand’s mountain country" },
  ],
  kashmir: [
    { id: "editorial-kashmir-shikara", url: "/images/travel/kashmir-shikara.webp", width: 1440, height: 900, altText: "A traditional shikara resting on Dal Lake at sunset", caption: "Evening stillness and handcrafted detail on Dal Lake" },
  ],
  rajasthan: [
    { id: "editorial-rajasthan-udaipur", url: "/images/travel/rajasthan-palace.webp", width: 1440, height: 900, altText: "Udaipur palaces and fort architecture glowing beside the lake", caption: "Golden-hour reflections across Udaipur’s heritage skyline" },
    { id: "editorial-rajasthan-pichola", url: "/images/hero-slider/udaipur-lake-pichola.webp", width: 1672, height: 941, altText: "Lake Pichola and Udaipur palace lights at twilight", caption: "Twilight settling over Lake Pichola" },
  ],
};

export function completeGalleryAlbum(album: GalleryAlbum): GalleryAlbum {
  const additions = album.destination ? editorialMedia[album.destination.slug] ?? [] : [];
  return { ...album, images: [...album.images, ...additions] };
}

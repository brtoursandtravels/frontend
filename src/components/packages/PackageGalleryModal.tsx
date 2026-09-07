import type { PublicMedia } from "@/lib/contracts";
import { ImageLightbox } from "@/components/common/ImageLightbox";

export function PackageGalleryModal({ images, label }: { images: PublicMedia[]; label: string }) {
  return <ImageLightbox images={images} label={label} />;
}

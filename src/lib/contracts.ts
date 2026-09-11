import { z } from "zod";

export const moneySchema = z.object({
  amount: z.string(),
  currency: z.string().length(3),
  basis: z.enum(["PER_PERSON", "PER_GROUP", "PER_ROOM", "ON_REQUEST"]),
});

export const publicMediaSchema = z.object({
  id: z.string(),
  url: z.string(),
  mimeType: z.string().optional(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  altText: z.string(),
  caption: z.string().nullable(),
});

export const packageCardSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  days: z.number(),
  nights: z.number(),
  startingCity: z.string().nullable(),
  destinations: z.array(z.object({ slug: z.string(), name: z.string() })),
  categories: z.array(z.object({ slug: z.string(), name: z.string() })),
  highlights: z.array(z.string()),
  startingPrice: moneySchema.nullable(),
  cover: publicMediaSchema.omit({ mimeType: true }).nullable(),
  isDemo: z.boolean(),
});

export const packageDetailSchema = packageCardSchema.extend({
  overview: z.string(),
  inclusions: z.array(z.string()),
  exclusions: z.array(z.string()),
  importantInformation: z.string().nullable(),
  transportInformation: z.string().nullable(),
  accommodationNotes: z.string().nullable(),
  cancellationRules: z.string().nullable(),
  seo: z.object({
    title: z.string().nullable(),
    description: z.string().nullable(),
  }),
  brochure: z
    .object({
      id: z.string(),
      url: z.string(),
      originalName: z.string(),
      mimeType: z.literal("application/pdf"),
    })
    .nullable(),
  media: z.array(publicMediaSchema.omit({ mimeType: true })),
  itinerary: z.array(
    z.object({
      dayNumber: z.number(),
      title: z.string(),
      description: z.string(),
    }),
  ),
  departures: z.array(
    z.object({
      id: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      price: moneySchema.nullable(),
    }),
  ),
  relatedPackages: z.array(z.lazy(() => packageCardSchema)),
});

export const pageMetaSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
});
export const packageListResponseSchema = z.object({
  data: z.array(packageCardSchema),
  meta: pageMetaSchema,
});
export const packageDetailResponseSchema = z.object({
  data: packageDetailSchema,
});

export const siteResponseSchema = z.object({
  data: z.object({
    settings: z.record(z.string(), z.unknown()),
    menus: z.array(
      z.object({
        key: z.string(),
        label: z.string(),
        items: z.array(
          z.object({
            id: z.string(),
            parentId: z.string().nullable(),
            label: z.string(),
            href: z.string(),
            sortOrder: z.number(),
          }),
        ),
      }),
    ),
  }),
});

const homeSectionType = z.enum([
  "HERO",
  "DISCOVERY",
  "FEATURED_PACKAGES",
  "CATEGORIES",
  "DESTINATIONS",
  "INTRODUCTION",
  "PLANNING_PROCESS",
  "GALLERY",
  "TESTIMONIALS",
  "LATEST_BLOG",
  "FAQS",
  "CONTACT_CTA",
]);
export const homeResponseSchema = z.object({
  data: z.object({
    sections: z.array(
      z.object({
        id: z.string(),
        type: homeSectionType,
        title: z.string().nullable(),
        content: z.unknown(),
        sortOrder: z.number(),
        isDemo: z.boolean(),
      }),
    ),
  }),
});

export const contentPageResponseSchema = z.object({
  data: z.object({
    slug: z.string(),
    title: z.string(),
    contentHtml: z.string(),
    seoTitle: z.string().nullable(),
    seoDescription: z.string().nullable(),
    ownerReviewDue: z.boolean(),
    updatedAt: z.string(),
    isDemo: z.boolean(),
  }),
});

export const destinationSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  summary: z.string().nullable(),
  isDemo: z.boolean(),
});
export const categorySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  isDemo: z.boolean(),
});
export const destinationsResponseSchema = z.object({
  data: z.array(destinationSchema),
});
export const categoriesResponseSchema = z.object({
  data: z.array(categorySchema),
});

export const galleryAlbumCardSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  destination: z.object({ slug: z.string(), name: z.string() }).nullable(),
  cover: publicMediaSchema.nullable(),
  images: z.array(publicMediaSchema).optional(),
  isDemo: z.boolean(),
});
export const galleryAlbumSchema = galleryAlbumCardSchema
  .omit({ cover: true })
  .extend({
    images: z.array(publicMediaSchema),
  });
export const galleryListResponseSchema = z.object({
  data: z.array(galleryAlbumCardSchema),
  meta: pageMetaSchema,
});
export const galleryAlbumResponseSchema = z.object({
  data: galleryAlbumSchema,
});

export const blogCategorySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  isDemo: z.boolean(),
});
export const blogCardSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  category: z.object({ slug: z.string(), name: z.string() }).nullable(),
  cover: publicMediaSchema.nullable(),
  publishedAt: z.string(),
  readingMinutes: z.number(),
  author: z.object({ name: z.string() }).nullable(),
  relatedTour: z
    .object({ slug: z.string(), title: z.string(), days: z.number() })
    .nullable()
    .optional(),
  isDemo: z.boolean(),
});
export const blogListResponseSchema = z.object({
  data: z.array(blogCardSchema),
  meta: pageMetaSchema,
});
export const blogCategoriesResponseSchema = z.object({
  data: z.array(blogCategorySchema),
});
export const blogDetailResponseSchema = z.object({
  data: blogCardSchema.extend({
    contentHtml: z.string(),
    tags: z.array(z.object({ slug: z.string(), name: z.string() })),
    author: z
      .object({ name: z.string(), bio: z.string().nullable() })
      .nullable(),
    seo: z.object({
      title: z.string().nullable(),
      description: z.string().nullable(),
    }),
    relatedArticles: z.array(
      blogCardSchema.omit({ readingMinutes: true, author: true, isDemo: true }),
    ),
    relatedPackages: z.array(
      z.object({
        id: z.string(),
        slug: z.string(),
        title: z.string(),
        summary: z.string(),
        days: z.number(),
        nights: z.number(),
      }),
    ),
  }),
});

export const faqResponseSchema = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      question: z.string(),
      answer: z.string(),
      sortOrder: z.number(),
      isDemo: z.boolean(),
    }),
  ),
});
export const testimonialResponseSchema = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      publicName: z.string(),
      quote: z.string(),
      sortOrder: z.number(),
    }),
  ),
});

export const inquiryReceiptSchema = z.object({
  data: z.object({
    reference: z.string(),
    receivedAt: z.string(),
    message: z.string(),
    duplicate: z.boolean(),
  }),
});

export const apiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    fields: z.record(z.string(), z.array(z.string())).optional(),
    requestId: z.string(),
  }),
});

export type PackageCard = z.infer<typeof packageCardSchema>;
export type PackageDetail = z.infer<typeof packageDetailSchema>;
export type PublicMedia = z.infer<typeof publicMediaSchema>;
export type Destination = z.infer<typeof destinationSchema>;
export type Category = z.infer<typeof categorySchema>;
export type GalleryAlbumCard = z.infer<typeof galleryAlbumCardSchema>;
export type SiteData = z.infer<typeof siteResponseSchema>["data"];
export type HomeSection = z.infer<
  typeof homeResponseSchema
>["data"]["sections"][number];
export type GalleryAlbum = z.infer<typeof galleryAlbumSchema>;
export type BlogCard = z.infer<typeof blogCardSchema>;

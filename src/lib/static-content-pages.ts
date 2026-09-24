export type StaticContentPage = {
  slug: string;
  title: string;
  contentHtml: string;
  seoTitle: string;
  seoDescription: string;
  ownerReviewDue: boolean;
};

// Preserves the published copy when the page editor was retired.
// Policy wording and its existing review status are intentionally unchanged.
export const staticContentPages = {
  "about-us": {
    slug: "about-us",
    title: "About BR Tours and Travels",
    contentHtml: "<p>BR Tours and Travels helps travellers explore Char Dham, Kashmir, Matheran, Rajasthan and Jaisalmer through clear, enquiry-led planning.</p><h2>How planning works</h2><p>Share your dates, group size, preferred pace and priorities. The team then shapes the route and confirms the applicable stays, transport, availability, price and terms in writing.</p>",
    seoTitle: "About BR Tours and Travels",
    seoDescription: "Meet BR Tours and Travels and learn how personalised India journeys are planned and confirmed.",
    ownerReviewDue: false,
  },
  privacy: {
    slug: "privacy",
    title: "Privacy notice - owner review required",
    contentHtml: "<p>Enquiry information is collected so BR Tours and Travels can respond to your travel request. Final retention, legal-basis and contact wording must be approved by the owner before launch.</p>",
    seoTitle: "Privacy notice - owner review required",
    seoDescription: "Privacy information for BR Tours and Travels enquiries.",
    ownerReviewDue: true,
  },
  terms: {
    slug: "terms",
    title: "Terms - owner review required",
    contentHtml: "<p>Package information is an invitation to enquire, not a confirmation of availability. Final services, payment rules, supplier terms and liabilities are provided with the written quotation.</p>",
    seoTitle: "Terms - owner review required",
    seoDescription: "General enquiry and travel terms for BR Tours and Travels.",
    ownerReviewDue: true,
  },
  "cancellation-policy": {
    slug: "cancellation-policy",
    title: "Cancellation policy - owner review required",
    contentHtml: "<p>Cancellation and refund rules depend on the confirmed package, suppliers and dates. The applicable rules are supplied with the final quotation before payment.</p>",
    seoTitle: "Cancellation policy - owner review required",
    seoDescription: "Cancellation information for BR Tours and Travels enquiries.",
    ownerReviewDue: true,
  },
} satisfies Record<string, StaticContentPage>;

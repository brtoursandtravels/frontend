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
    contentHtml: "<p>BR Tours and Travels helps you plan trips to Char Dham, Kashmir, Matheran, Rajasthan and Jaisalmer.</p><h2>How we plan your trip</h2><p>Tell us your travel dates, how many people are coming and what you would like to do. We help plan the route, check which hotels and transport are available, and share the costs and booking terms in writing before you book.</p>",
    seoTitle: "About BR Tours and Travels",
    seoDescription: "Learn about BR Tours and Travels and how we help you plan a trip in India, check the details and get help while travelling.",
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

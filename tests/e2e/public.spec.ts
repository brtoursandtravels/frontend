import { readFile } from "node:fs/promises";
import path from "node:path";
import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

const adminEmail = "e2e-super@example.invalid";
const adminPassword = "Playwright-Only-Password-2026!";

async function loginAdmin(request: APIRequestContext) {
  const csrfResponse = await request.get("/api/v1/auth/csrf");
  expect(csrfResponse.ok()).toBeTruthy();
  const csrfPayload = await csrfResponse.json();
  const login = await request.post("/api/v1/auth/login", {
    headers: { "x-csrf-token": csrfPayload.data.csrfToken },
    data: { email: adminEmail, password: adminPassword },
  });
  expect(login.ok()).toBeTruthy();
  return (await login.json()).data.csrfToken as string;
}

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
}

test("hero search, catalogue filters, pagination and journal state are URL-restorable", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "India journeys, shaped around you",
  );
  await page.getByLabel("Destination", { exact: true }).selectOption("kashmir");
  await page.getByLabel("Duration", { exact: true }).selectOption("short");
  await page.getByLabel("Travel style", { exact: true }).selectOption("family");
  await page.getByRole("button", { name: "Explore journeys" }).click();
  await expect(page).toHaveURL(/destination=kashmir/);
  await expect(page).toHaveURL(/category=family/);
  await expect(page).toHaveURL(/minDays=3/);
  await expect(page).toHaveURL(/maxDays=5/);

  await page.goto("/");
  await page.getByRole("link", { name: "Explore journeys" }).first().click();
  await expect(page).toHaveURL(/\/packages/);
  await expect(page.getByRole("article")).toHaveCount(6);
  await page.getByRole("link", { name: /Next/ }).click();
  await expect(page).toHaveURL(/page=2/);
  await expect(page.getByRole("article")).toHaveCount(4);

  await page.goto("/packages");
  const filters = page.getByRole("complementary", {
    name: "Package filters",
  });
  await filters.getByLabel("Trip style").selectOption("family");
  await filters.getByRole("button", { name: "Apply filters" }).click();
  await expect(page).toHaveURL(/category=family/);
  await expect(page.getByLabel("Selected filters")).toContainText("Family");
  const filteredUrl = page.url();

  await page.goto("/blog");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Useful notes",
  );
  const firstArticleLink = page.locator("article h2 a").first();
  const articleTitle = await firstArticleLink.textContent();
  await firstArticleLink.click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    articleTitle ?? "",
  );
  await page.goto(filteredUrl);
  await expect(page.getByLabel("Selected filters")).toContainText("Family");
});

test("CMS edits appear publicly; gallery is keyboard operable; enquiry persists once", async ({
  page,
  request,
}) => {
  const csrf = await loginAdmin(request);
  const stamp = Date.now();

  const settingsUpdate = await request.put(
    "/api/v1/admin/settings/contact.phone",
    {
      headers: { "x-csrf-token": csrf },
      data: {
        value: "+91 90000 00000",
        isPublic: true,
        description: "Playwright test contact",
      },
    },
  );
  expect(settingsUpdate.ok()).toBeTruthy();

  const sectionsResponse = await request.get("/api/v1/admin/home/sections");
  const sections = (await sectionsResponse.json()).data;
  const hero = sections.find((item: { type: string }) => item.type === "HERO");
  const heroTitle = "Go beyond the ordinary " + stamp;
  const heroUpdate = await request.put(
    "/api/v1/admin/home/sections/" + hero.id,
    {
      headers: { "x-csrf-token": csrf },
      data: {
        type: hero.type,
        title: heroTitle,
        content: hero.content,
        isVisible: true,
        sortOrder: hero.sortOrder,
        status: "PUBLISHED",
        publishedAt: hero.publishedAt,
        isDemo: true,
      },
    },
  );
  expect(heroUpdate.ok()).toBeTruthy();

  const postsResponse = await request.get("/api/v1/admin/blog/posts");
  const post = (await postsResponse.json()).data[0];
  const articleTitle = "Live CMS planning note " + stamp;
  const postUpdate = await request.put("/api/v1/admin/blog/posts/" + post.id, {
    headers: { "x-csrf-token": csrf },
    data: {
      slug: post.slug,
      title: articleTitle,
      excerpt: post.excerpt,
      contentHtml: post.contentHtml,
      categoryId: post.categoryId,
      coverMediaId: post.coverMediaId,
      publicAuthorName: "BR Editorial",
      publicAuthorBio: "Public test biography.",
      seoTitle: articleTitle,
      seoDescription: post.excerpt,
      tagIds: post.tags.map((item: { tag: { id: string } }) => item.tag.id),
      relatedPackageIds: post.relatedTours.map(
        (item: { package: { id: string } }) => item.package.id,
      ),
      relatedPostIds: post.relatedArticles.map(
        (item: { relatedPost: { id: string } }) => item.relatedPost.id,
      ),
      isFeatured: post.isFeatured,
      status: "PUBLISHED",
      publishedAt: post.publishedAt,
      isDemo: true,
    },
  });
  expect(postUpdate.ok()).toBeTruthy();

  const logo = await readFile(path.resolve("public/br-logo.png"));
  const upload = await request.post("/api/v1/admin/media", {
    headers: { "x-csrf-token": csrf },
    multipart: {
      file: {
        name: "gallery-" + stamp + ".png",
        mimeType: "image/png",
        buffer: logo,
      },
      altText: "BR logo used as a labelled gallery test image",
      visibility: "PUBLIC",
    },
  });
  expect(upload.ok()).toBeTruthy();
  const mediaId = (await upload.json()).data.id;
  const albumTitle = "Accessible gallery " + stamp;
  const album = await request.post("/api/v1/admin/gallery/albums", {
    headers: { "x-csrf-token": csrf },
    data: {
      slug: "accessible-gallery-" + stamp,
      title: albumTitle,
      description: "Playwright-only public update proof.",
      destinationId: null,
      status: "PUBLISHED",
      publishedAt: null,
      isDemo: true,
      mediaIds: [mediaId],
    },
  });
  expect(album.ok(), JSON.stringify(await album.json())).toBeTruthy();

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(heroTitle);
  await page.goto("/blog");
  await expect(page.getByText(articleTitle)).toBeVisible();
  await page.goto("/gallery");
  const gallerySection = page
    .getByRole("heading", { name: albumTitle })
    .locator("xpath=ancestor::section");
  await expect(gallerySection).toBeVisible();
  const galleryTrigger = gallerySection.getByRole("button", {
    name: /Open image 1/,
  });
  await galleryTrigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(galleryTrigger).toBeFocused();

  await page.goto("/contact-us");
  await expect(
    page
      .locator("#main-content")
      .getByRole("link", { name: "+91 90000 00000" }),
  ).toBeVisible();
  await page.getByLabel("Name").fill("Public E2E Visitor");
  await page
    .getByLabel("Email", { exact: true })
    .fill("visitor-" + stamp + "@example.invalid");
  await page
    .getByLabel("Message")
    .fill("Please review this persisted Playwright travel enquiry.");
  await page.getByLabel(/I agree that BR/).check();
  await page.getByRole("button", { name: "Send enquiry" }).click();
  const receipt = page.getByRole("status");
  await expect(receipt).toContainText("Request received");
  const receiptText = await receipt.textContent();
  const reference = receiptText?.match(/BR-\d{4}-[A-F0-9]+/)?.[0];
  expect(reference).toBeTruthy();

  const enquiriesResponse = await request.get(
    "/api/v1/admin/inquiries?q=" + reference,
  );
  const enquiries = (await enquiriesResponse.json()).data;
  expect(enquiries).toHaveLength(1);
  const detailResponse = await request.get(
    "/api/v1/admin/inquiries/" + enquiries[0].id,
  );
  const detail = (await detailResponse.json()).data;
  expect(detail.delivery).toHaveLength(1);
});

test("375, 414, 768 and 1024 px layouts avoid overflow and expose correct navigation", async ({
  page,
}) => {
  for (const width of [375, 414, 768, 1024]) {
    await page.setViewportSize({ width, height: width < 700 ? 844 : 900 });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expectNoHorizontalOverflow(page);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menuButton = page.getByRole("button", { name: "Open navigation" });
  await menuButton.focus();
  await page.keyboard.press("Enter");
  const drawer = page.getByRole("dialog", { name: "Mobile navigation" });
  await expect(
    drawer.getByRole("link", { name: "Tours / Packages" }),
  ).toBeVisible();
  await expect(drawer.locator(":focus")).toHaveCount(1);
  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
  await expect(menuButton).toBeFocused();

  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto("/packages");
  await expect(page.getByText("Filters and sorting")).toBeVisible();
  await expect(
    page.getByRole("complementary", { name: "Package filters" }),
  ).toBeHidden();
  await expectNoHorizontalOverflow(page);

  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto("/packages");
  await expect(page.getByText("Filters and sorting")).toBeHidden();
  await expect(
    page.getByRole("complementary", { name: "Package filters" }),
  ).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("desktop navigation repositions one shared active pill", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const navigation = page.getByRole("navigation", {
    name: "Primary navigation",
  });
  const pill = page.getByTestId("active-nav-pill");
  await expect(pill).toBeVisible();
  const startingBox = await pill.boundingBox();
  expect(startingBox).not.toBeNull();

  await navigation.getByRole("link", { name: "Tours / Packages" }).click();
  await expect(page).toHaveURL(/\/packages/);
  await expect(
    navigation.getByRole("link", { name: "Tours / Packages" }),
  ).toHaveAttribute("aria-current", "page");
  await expect
    .poll(async () => (await pill.boundingBox())?.x ?? 0)
    .toBeGreaterThan((startingBox?.x ?? 0) + 40);
  await expect(pill).toHaveCSS("transition-property", /transform/);
});

test("package detail exposes SEO data, labelled images, calculator and accessible enquiry modal", async ({
  page,
}) => {
  await page.goto("/packages");
  const detailHref = await page.locator("article h3 a").first().getAttribute("href");
  expect(detailHref).toMatch(/^\/packages\//);
  await page.goto(detailHref!);
  await expect(page).toHaveURL(/\/packages\/[^/?]+$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);

  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  expect(canonical).toMatch(/^http:\/\/localhost:3100\/packages\//);
  const structured = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  const packageSchema = structured
    .map((value) => JSON.parse(value))
    .find((value) => value["@type"] === "TouristTrip");
  expect(packageSchema?.url).toMatch(/^http:\/\/localhost:3100\/packages\//);

  const mainImages = page.locator("#main-content img");
  const imageCount = await mainImages.count();
  if (imageCount) {
    for (let index = 0; index < imageCount; index += 1) {
      await expect(mainImages.nth(index)).toHaveAttribute("alt", /\S+/);
      await expect(mainImages.nth(index)).toHaveAttribute("srcset", /\S+/);
    }
  } else {
    await expect(
      page.getByText("Licensed photography has not been added."),
    ).toBeVisible();
  }

  const adults = page.getByLabel("Adults").first();
  await adults.fill("3");
  await expect(page.getByText(/estimated for 3 travellers/i)).toBeVisible();

  const trigger = page.getByRole("button", {
    name: "Enquire about this journey",
  });
  await trigger.click();
  const dialog = page.getByRole("dialog", {
    name: "Tell us about your journey.",
  });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Close enquiry form" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.locator(":focus")).toHaveCount(1);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

import assert from "node:assert/strict";
import { test } from "node:test";
import { entryMetadata, staticMetadata } from "../src/lib/metadata.ts";
import { socialSettingLink } from "../src/lib/presentation.ts";

const entry = { title: "Kashmir Tour", description: "Explore Kashmir with BR Travels.", path: "/packages/kashmir" };
test("saved metadata drives the title, description and sharing tags", () => {
  const result = entryMetadata({ ...entry, metaTitle: " My custom title ", metaDescription: " My custom description " });
  assert.deepEqual(result.title, { absolute: "My custom title" });
  assert.equal(result.description, "My custom description");
  assert.equal(result.openGraph.title, "My custom title");
  assert.equal(result.openGraph.description, "My custom description");
  assert.equal(result.twitter.title, "My custom title");
  assert.equal(result.twitter.description, "My custom description");
  assert.equal(result.alternates.canonical, entry.path);
});
test("blank or missing metadata uses the entry title and description", () => {
  for (const value of [undefined, null, "", "  "]) {
    const result = entryMetadata({ ...entry, metaTitle: value, metaDescription: value });
    assert.equal(result.title, entry.title);
    assert.equal(result.description, entry.description);
  }
});
test("cover images are retained in social previews", () => {
  const image = { url: "/media/kashmir.webp", alt: "Kashmir" };
  const result = entryMetadata({ ...entry, image });
  assert.deepEqual(result.openGraph.images, [image]);
  assert.equal(result.twitter.card, "summary_large_image");
  assert.deepEqual(result.twitter.images, [image.url]);
});
test("static-page settings override defaults without changing page content or canonical URL", () => {
  const result = staticMetadata(entry, { metaTitle: "Package catalogue", metaDescription: "Browse our latest tours." });
  assert.deepEqual(result.title, { absolute: "Package catalogue" });
  assert.equal(result.description, "Browse our latest tours.");
  assert.equal(result.alternates.canonical, entry.path);
});
test("cleared static-page metadata falls back to entry metadata or the page defaults", () => {
  const result = staticMetadata({ ...entry, metaTitle: "Entry title", metaDescription: "Entry description" }, { metaTitle: " ", metaDescription: "" });
  assert.deepEqual(result.title, { absolute: "Entry title" });
  assert.equal(result.description, "Entry description");
  for (const invalid of [null, undefined, "invalid", [], { metaTitle: 123 }]) {
    assert.equal(staticMetadata(entry, invalid).title, entry.title);
  }
});
test("the home page title does not duplicate the site name", () => {
  assert.deepEqual(entryMetadata({ ...entry, path: "/", title: "BR Tours and Travels" }).title, { absolute: "BR Tours and Travels" });
});
test("social links use public settings and hide explicitly cleared links", () => {
  const site = { menus: [], settings: {
    "social.instagram": "https://www.instagram.com/br_tours_travels/",
    "social.facebook": "",
    "contact.facebook": "https://www.facebook.com/old-link",
  } };
  assert.equal(socialSettingLink(site, "instagram"), site.settings["social.instagram"]);
  assert.equal(socialSettingLink(site, "facebook"), null);
  assert.equal(socialSettingLink(null, "instagram"), null);
});
test("invalid social links are never rendered", () => {
  for (const value of ["javascript:alert(1)", "https://instagram.com.evil.test/", "http://instagram.com/test"]) {
    assert.equal(socialSettingLink({ menus: [], settings: { "social.instagram": value } }, "instagram"), null);
  }
});

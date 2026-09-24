import assert from "node:assert/strict";
import { test } from "node:test";
import { entryMetadata, staticMetadata } from "../src/lib/metadata.ts";
import { contactPhone, settingText, socialSettingLink, whatsappLink } from "../src/lib/presentation.ts";

test("contact settings support legacy values and explicit clearing hides old aliases", () => {
  const keys = ["contact.email", "business.email", "email"];
  assert.equal(settingText({ settings: { email: { value: " legacy@example.com " } } }, keys), "legacy@example.com");
  assert.equal(settingText({ settings: { "contact.email": " test@example.com ", email: "old@example.com" } }, keys), "test@example.com");
  assert.equal(settingText({ settings: { "contact.email": " ", email: "old@example.com" } }, keys), null);
  assert.equal(settingText({ settings: {} }, keys), null);
});
test("WhatsApp accepts configured numbers and chat links while invalid links remain hidden", () => {
  assert.equal(whatsappLink("+91 79907 21001"), "https://wa.me/917990721001");
  for (const value of ["https://wa.me/917990721001", "https://api.whatsapp.com/send?phone=917990721001&text=Hello"]) assert.equal(whatsappLink(value), value);
  for (const value of ["", "123", "javascript:123456789", "https://evil.test/123456789", "https://user:password@wa.me/123456789", "https://wa.me/invalid", "https://api.whatsapp.com/send?phone=bad"]) assert.equal(whatsappLink(value), null);
});

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


test("calls and WhatsApp use the shared phone setting and ignore the retired WhatsApp field", () => {
  const settings = { "contact.phone": "+91 98765 43210", "contact.whatsapp": "+91 11111 11111" };
  assert.equal(contactPhone({ settings }), "+91 98765 43210");
  assert.equal(whatsappLink(contactPhone({ settings })), "https://wa.me/919876543210");
  assert.equal(contactPhone({ settings: { ...settings, "contact.phone": "" } }), null);
  assert.equal(whatsappLink(contactPhone({ settings: { ...settings, "contact.phone": "" } })), null);
  assert.equal(contactPhone({ settings: { "contact.whatsapp": "+91 11111 11111" } }), null);
});

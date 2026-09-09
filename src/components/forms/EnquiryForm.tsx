"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { useRef, useState } from "react";
import { z } from "zod";
import { apiErrorSchema, inquiryReceiptSchema } from "@/lib/contracts";
import { BrandedSelect } from "@/components/common/BrandedSelect";

const enquirySchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(120),
  email: z.string().trim().email("Enter a valid email address.").max(254),
  phone: z
    .string()
    .trim()
    .refine(
      (value) => !value || /^[+()\d\s-]{7,40}$/.test(value),
      "Enter a valid phone number.",
    ),
  subject: z.string().trim().max(200),
  tripStyle: z.string().trim().max(80),
  message: z
    .string()
    .trim()
    .min(
      10,
      "Add at least 10 characters so the team can understand your request.",
    )
    .max(5000),
  preferredStartDate: z.string(),
  adultCount: z.string(),
  childCount: z.string(),
  budget: z.string(),
  departureId: z.string(),
  privacyAccepted: z
    .boolean()
    .refine(Boolean, "Please acknowledge the privacy notice."),
});

type Receipt = z.infer<typeof inquiryReceiptSchema>["data"];
type FieldErrors = Partial<Record<keyof z.infer<typeof enquirySchema>, string>>;
const fieldClass =
  "mt-1.5 w-full rounded-md border border-border-subtle bg-white px-3 py-2.5 text-sm text-text-heading outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/10 aria-invalid:border-danger";
const labelClass = "grid content-start text-xs font-bold text-text-heading";

function RequiredMark() {
  return (
    <>
      <span className="ml-0.5 text-danger" aria-hidden="true">*</span>
      <span className="sr-only"> (required)</span>
    </>
  );
}

export function EnquiryForm({
  packageSlug,
  packageTitle,
  departures = [],
  compact = false,
  whatsappHref,
  defaultAdultCount,
  defaultChildCount,
  defaultSubject,
  defaultMessage,
}: {
  packageSlug?: string;
  packageTitle?: string;
  departures?: Array<{ id: string; label: string }>;
  compact?: boolean;
  whatsappHref?: string | null;
  defaultAdultCount?: number;
  defaultChildCount?: number;
  defaultSubject?: string;
  defaultMessage?: string;
}) {
  const [intent, setIntent] = useState<
    "CONTACT" | "PACKAGE_ENQUIRY" | "BOOKING_REQUEST"
  >(packageSlug ? "PACKAGE_ENQUIRY" : "CONTACT");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);
  const idempotencyKey = useRef("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (String(data.get("website") ?? "").trim()) {
      setFormError("The form could not be submitted.");
      return;
    }
    const textValue = (field: string) => String(data.get(field) ?? "");
    const result = enquirySchema.safeParse({
      name: textValue("name"),
      email: textValue("email"),
      phone: textValue("phone"),
      subject: textValue("subject"),
      tripStyle: textValue("tripStyle"),
      message: textValue("message"),
      preferredStartDate: textValue("preferredStartDate"),
      adultCount: textValue("adultCount"),
      childCount: textValue("childCount"),
      budget: textValue("budget"),
      departureId: textValue("departureId"),
      privacyAccepted: data.get("privacyAccepted") === "on",
    });
    if (!result.success) {
      const next: FieldErrors = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof FieldErrors;
        if (!next[key]) next[key] = issue.message;
      });
      setErrors(next);
      setFormError("Check the highlighted fields and try again.");
      return;
    }
    setErrors({});
    setFormError("");
    setPending(true);
    if (!idempotencyKey.current) idempotencyKey.current = crypto.randomUUID();
    const value = result.data;
    const optionalNumber = (candidate: string) =>
      candidate ? Number(candidate) : undefined;
    const body = {
      type: intent,
      name: value.name,
      email: value.email,
      ...(value.phone ? { phone: value.phone } : {}),
      ...(value.subject ? { subject: value.subject } : {}),
      message: value.tripStyle
        ? `${value.message}\n\nPreferred travel style: ${value.tripStyle}`
        : value.message,
      ...(packageSlug ? { packageSlug } : {}),
      ...(value.departureId ? { departureId: value.departureId } : {}),
      ...(value.preferredStartDate
        ? { preferredStartDate: value.preferredStartDate }
        : {}),
      ...(value.adultCount
        ? { adultCount: optionalNumber(value.adultCount) }
        : {}),
      ...(value.childCount
        ? { childCount: optionalNumber(value.childCount) }
        : {}),
      ...(value.budget ? { budget: optionalNumber(value.budget) } : {}),
      sourcePath: window.location.pathname + window.location.search,
      privacyAccepted: true,
      policyVersion: "2026-08-31",
    };
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/v1"}/inquiries`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "idempotency-key": idempotencyKey.current,
          },
          body: JSON.stringify(body),
        },
      );
      const payload: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        const parsedError = apiErrorSchema.safeParse(payload);
        if (parsedError.success && parsedError.data.error.fields) {
          const next = Object.fromEntries(
            Object.entries(parsedError.data.error.fields).map(
              ([key, messages]) => [key, messages[0]],
            ),
          ) as FieldErrors;
          setErrors(next);
        }
        throw new Error(
          parsedError.success
            ? parsedError.data.error.message
            : "The request could not be saved.",
        );
      }
      const parsedReceipt = inquiryReceiptSchema.parse(payload);
      setReceipt(parsedReceipt.data);
      form.reset();
      requestAnimationFrame(() => receiptRef.current?.focus());
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "The request could not be saved. Please try again.",
      );
    } finally {
      setPending(false);
    }
  }

  if (receipt) {
    return (
      <div
        className="rounded-xl border border-success/25 bg-success-bg p-6 shadow-card"
        ref={receiptRef}
        tabIndex={-1}
        role="status"
      >
        <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-success">Your trip brief is with us</p>
        <h2 className="font-display text-3xl text-text-heading">Thank you. Let&apos;s make it memorable.</h2>
        <p className="mt-3 text-text-muted">Your reference is <strong className="text-text-heading">{receipt.reference}</strong>. Keep it handy if you contact us about this request.</p>
        <p className="text-text-muted">{receipt.message} We aim to respond within 4 business hours.</p>
        {whatsappHref ? (
          <a
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-success px-5 py-3 text-sm font-extrabold text-white no-underline"
            href={whatsappHref}
            rel="noreferrer"
            target="_blank"
          >
            <MessageCircle aria-hidden="true" size={18} /> Continue on WhatsApp
          </a>
        ) : null}
        <button
          className="mt-3 rounded-full border border-primary bg-transparent px-5 py-3 text-sm font-extrabold text-primary"
          type="button"
          onClick={() => {
            setReceipt(null);
            idempotencyKey.current = "";
          }}
        >
          Send another request
        </button>
      </div>
    );
  }

  const errorFor = (field: keyof FieldErrors) =>
    errors[field] ? (
      <span className="mt-1 text-xs font-semibold text-danger" id={`${field}-error`}>
        {errors[field]}
      </span>
    ) : null;
  return (
    <form
      className={`grid gap-5 ${compact ? "text-sm" : ""}`}
      onSubmit={submit}
      noValidate
    >
      {packageSlug ? (
        <fieldset className="grid gap-3 rounded-lg border border-border-subtle bg-bg-muted p-4">
          <legend className="px-1 text-sm font-extrabold text-text-heading">What would you like to do?</legend>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              className="size-4 accent-primary"
              type="radio"
              name="intent"
              checked={intent === "PACKAGE_ENQUIRY"}
              onChange={() => setIntent("PACKAGE_ENQUIRY")}
            />{" "}
            Ask about this package
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              className="size-4 accent-primary"
              type="radio"
              name="intent"
              checked={intent === "BOOKING_REQUEST"}
              onChange={() => setIntent("BOOKING_REQUEST")}
            />{" "}
            Request booking review
          </label>
          <p className="m-0 text-xs leading-relaxed text-text-muted">
            A booking request is not payment, issued inventory or guaranteed
            availability.
          </p>
        </fieldset>
      ) : null}
      {packageTitle ? (
        <p className="rounded-md bg-primary-soft px-4 py-3 text-sm text-primary">
          <strong>Package:</strong> {packageTitle}
        </p>
      ) : null}
      <fieldset className="grid gap-3">
        <legend className="text-xs font-bold text-text-heading">What style feels most like you?</legend>
        <div className="flex flex-wrap gap-2">
          {["Couples / honeymoon", "Family", "Adventure", "Luxury heritage", "Slow travel"].map((style) => (
            <label className="cursor-pointer" key={style}>
              <input className="peer sr-only" type="radio" name="tripStyle" value={style} />
              <span className="inline-flex min-h-10 items-center rounded-full border border-border-subtle bg-white px-4 py-2 text-xs font-bold text-text-body transition hover:border-secondary/50 peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white peer-focus-visible:ring-3 peer-focus-visible:ring-primary/20">{style}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grid grid-cols-2 gap-4 max-[620px]:grid-cols-1">
        <label className={labelClass}>
          <span>Name<RequiredMark /></span>
          <input
            className={fieldClass}
            name="name"
            autoComplete="name"
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errorFor("name")}
        </label>
        <label className={labelClass}>
          <span>Email<RequiredMark /></span>
          <input
            className={fieldClass}
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errorFor("email")}
        </label>
        <label className={labelClass}>
          Phone
          <input
            className={fieldClass}
            name="phone"
            type="tel"
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
          />
          {errorFor("phone")}
        </label>
        <label className={labelClass}>
          Preferred date
          <input
            className={fieldClass}
            name="preferredStartDate"
            type="date"
            min={new Date().toISOString().slice(0, 10)}
          />
          {errorFor("preferredStartDate")}
        </label>
        {departures.length ? (
          <div className={`${labelClass} col-span-2 max-[620px]:col-span-1`}>
            <label htmlFor="enquiry-departure">Available departure to discuss</label>
            <BrandedSelect
              className="mt-1.5"
              id="enquiry-departure"
              name="departureId"
              options={[
                { value: "", label: "No specific departure" },
                ...departures.map((item) => ({ value: item.id, label: item.label })),
              ]}
            />
          </div>
        ) : null}
        {!packageSlug ? (
          <label className={`${labelClass} col-span-2 max-[620px]:col-span-1`}>
            Subject
            <input className={fieldClass} name="subject" defaultValue={defaultSubject} />
          </label>
        ) : null}
        <label className={labelClass}>
          Adults
          <input className={fieldClass} name="adultCount" type="number" min="1" max="50" defaultValue={defaultAdultCount} />
        </label>
        <label className={labelClass}>
          Children
          <input className={fieldClass} name="childCount" type="number" min="0" max="50" defaultValue={defaultChildCount} />
        </label>
        <div className={`${labelClass} col-span-2 max-[620px]:col-span-1`}>
          <label htmlFor="enquiry-budget">Approximate total budget</label>
          <BrandedSelect
            className="mt-1.5"
            id="enquiry-budget"
            name="budget"
            options={[
              { value: "", label: "Flexible / discuss with the team" },
              { value: "50000", label: "Around ₹50,000" },
              { value: "100000", label: "₹1,00,000 – ₹2,50,000" },
              { value: "250000", label: "₹2,50,000 – ₹5,00,000" },
              { value: "500000", label: "₹5,00,000+" },
            ]}
          />
        </div>
        <label className={`${labelClass} col-span-2 max-[620px]:col-span-1`}>
          <span>Message<RequiredMark /></span>
          <textarea
            className={`${fieldClass} min-h-32 resize-y`}
            name="message"
            required
            defaultValue={defaultMessage}
            rows={compact ? 4 : 6}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "message-error" : undefined}
            placeholder="Share your dates, pace, interests and practical requirements."
          />
          {errorFor("message")}
        </label>
      </div>
      <label className="absolute -left-[10000px]" aria-hidden="true">
        Leave this field empty
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="flex items-start gap-3 text-xs leading-relaxed text-text-muted">
        <input
          className="mt-1 size-4 shrink-0 accent-primary"
          name="privacyAccepted"
          type="checkbox"
          required
          aria-invalid={Boolean(errors.privacyAccepted)}
        />{" "}
        <span>
          I agree that BR may use these details to respond to this request. Read
          the <Link href="/privacy">privacy notice</Link>.<RequiredMark />
        </span>
      </label>
      {errorFor("privacyAccepted")}
      {formError ? (
        <div className="rounded-md border border-danger/25 bg-danger-bg px-4 py-3 text-sm text-danger" role="alert">
          {formError}
        </div>
      ) : null}
      <button className="w-full rounded-full border-0 bg-primary px-6 py-3.5 text-sm font-extrabold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60" disabled={pending} type="submit">
        {pending
          ? "Saving request…"
          : intent === "BOOKING_REQUEST"
            ? "Request booking review"
            : "Send enquiry"}
      </button>
      <p className="m-0 text-center text-[0.75rem] font-semibold text-text-muted">Complimentary planning · No booking obligation · Private contact details</p>
    </form>
  );
}

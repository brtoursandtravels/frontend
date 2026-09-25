"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ChevronRight,
  Compass,
  Mail,
  Menu,
  Phone,
  Sparkles,
  X,
} from "lucide-react";
import type { SiteData } from "@/lib/contracts";
import { contactPhone, settingText, whatsappLink } from "@/lib/presentation";
import { BrandLogo } from "@/components/common/BrandLogo";
import { SocialContactLinks, WhatsAppIcon } from "@/components/common/SocialContactLinks";

const defaultNavigation = [
  { id: "home", parentId: null, href: "/", label: "Home", sortOrder: 0 },
  { id: "about-us", parentId: null, href: "/about-us", label: "About Us", sortOrder: 1 },
  { id: "tours", parentId: null, href: "/packages", label: "Tours / Packages", sortOrder: 2 },
  { id: "gallery", parentId: null, href: "/gallery", label: "Gallery", sortOrder: 3 },
  { id: "blog", parentId: null, href: "/blog", label: "Blog", sortOrder: 4 },
  { id: "contact-us", parentId: null, href: "/contact-us", label: "Contact Us", sortOrder: 5 },
];

function normalizeNavigationPath(value: string | null | undefined) {
  const rawPath = value?.trim();

  // On a production hard-load Next can briefly expose the root route as an
  // empty pathname. Treat it as `/` so the Home state is correct in the
  // server render as well as after client-side navigation.
  if (!rawPath) return "/";

  try {
    const path = new URL(rawPath, "https://navigation.local").pathname;
    return path.replace(/\/+$/, "") || "/";
  } catch {
    const path = rawPath.split(/[?#]/, 1)[0];
    return path.replace(/\/+$/, "") || "/";
  }
}

export function SiteHeader({ site }: { site?: SiteData | null }) {
  const pathname = usePathname();
  const currentPath = normalizeNavigationPath(pathname);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const desktopNavRef = useRef<HTMLUListElement>(null);
  const activePillRef = useRef<HTMLLIElement>(null);
  const items = defaultNavigation;
  const roots = items
    .filter((item) => !item.parentId)
    .sort((left, right) => left.sortOrder - right.sortOrder);
  const phone = contactPhone(site);
  const whatsappHref = whatsappLink(phone);
  const email = settingText(site, ["contact.email", "business.email", "email"]);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;

    const focusable = () =>
      Array.from(
        drawerRef.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
    requestAnimationFrame(() => focusable()[0]?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        requestAnimationFrame(() => menuButtonRef.current?.focus());
        return;
      }
      if (event.key !== "Tab") return;
      const drawerItems = focusable();
      const first = drawerItems[0];
      const last = drawerItems.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const isActive = (href: string) => {
    const navigationPath = normalizeNavigationPath(href);

    if (navigationPath === "/") return currentPath === "/";

    return (
      currentPath === navigationPath ||
      currentPath.startsWith(`${navigationPath}/`)
    );
  };

  useEffect(() => {
    const nav = desktopNavRef.current;
    const pill = activePillRef.current;
    if (!nav || !pill) return;

    const positionPill = () => {
      const activeItem = nav.querySelector<HTMLElement>('[data-active="true"]');
      if (!activeItem) {
        pill.style.opacity = "0";
        return;
      }

      pill.style.width = `${activeItem.offsetWidth}px`;
      pill.style.transform = `translate3d(${activeItem.offsetLeft}px, 0, 0)`;
      pill.style.opacity = "1";
    };

    const frame = requestAnimationFrame(positionPill);
    const resizeObserver = new ResizeObserver(positionPill);
    resizeObserver.observe(nav);
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
    };
  }, [currentPath, roots.length]);

  return (
    <>
      <div className="relative z-80 border-b border-secondary/20 bg-[#051b1c] text-white/75 max-[760px]:hidden">
        <div className="mx-auto grid min-h-10 w-full max-w-7xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-5 text-[0.72rem] font-bold sm:px-8 lg:gap-5 lg:px-10">
          {email ? (
            <a className="col-start-1 row-start-1 inline-flex min-w-0 max-w-full items-center gap-2 justify-self-start no-underline transition-colors hover:text-secondary-light" href={`mailto:${email}`} title={email}>
              <Mail aria-hidden="true" className="shrink-0" size={14} />
              <span className="truncate">{email}</span>
            </a>
          ) : null}
          <p className="col-start-2 row-start-1 m-0 flex items-center justify-center gap-1.5 text-center text-white/58">
            <Sparkles aria-hidden="true" className="text-secondary-light" size={13} />
            Tours and holidays across India
          </p>
          {whatsappHref ? (
            <a className="col-start-3 row-start-1 inline-flex min-w-0 max-w-full items-center gap-2 justify-self-end text-secondary-light no-underline transition-colors hover:text-white" href={whatsappHref} aria-label={`WhatsApp: ${phone}`} title={`WhatsApp: ${phone}`} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="size-[18px] shrink-0" />
              <span className="truncate whitespace-nowrap">{phone}</span>
            </a>
          ) : null}
        </div>
      </div>

      <header
        className={`sticky top-0 z-80 border-b transition-[background-color,border-color,box-shadow] duration-500 ${
          scrolled
            ? "border-white/12 bg-[#082627]/92 shadow-header-dark backdrop-blur-2xl"
            : "border-secondary/15 bg-[#082728]/98"
        }`}
      >
      <div
        className={`relative mx-auto flex w-full max-w-7xl items-center gap-4 overflow-hidden px-5 transition-[min-height] duration-500 sm:px-8 lg:px-10 ${
          scrolled
            ? "min-h-[4.25rem]"
            : "min-h-[4.75rem] sm:min-h-[5rem]"
        }`}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-secondary/70 to-transparent"
        />
        <div className={`relative z-10 transition-transform duration-500 ${scrolled ? "scale-[0.92] origin-left" : "scale-100"}`}>
          <BrandLogo inverse />
        </div>

        <nav
          className="relative z-10 ml-auto rounded-full bg-transparent p-1.5 max-[1180px]:hidden"
          aria-label="Primary navigation"
        >
          <ul
            className="relative isolate m-0 flex list-none items-center gap-0.5 p-0"
            ref={desktopNavRef}
          >
            <li
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 -z-10 rounded-full bg-white/12 opacity-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] transition-[width,transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
              data-testid="active-nav-pill"
              ref={activePillRef}
            />
            {roots.map((item, index) => (
              <li
                className="relative z-10 motion-safe:animate-nav-reveal"
                data-active={isActive(item.href)}
                key={item.id}
                style={{ animationDelay: `${80 + index * 45}ms` }}
              >
                <DesktopNavLink href={item.href} active={isActive(item.href)}>
                  {item.label}
                </DesktopNavLink>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          className="group relative z-10 isolate inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-secondary to-accent px-5 py-3 text-xs font-extrabold text-white no-underline shadow-accent-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-accent-md max-[1180px]:hidden"
          href="/contact-us"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 -z-10 -translate-x-[105%] bg-gradient-to-r from-accent via-secondary to-accent transition-transform duration-500 ease-out group-hover:translate-x-0"
          />
          Plan my trip
          <span className="flex size-7 items-center justify-center rounded-full bg-white/14 transition-transform duration-300 group-hover:rotate-45 group-hover:bg-white/20">
            <ArrowUpRight aria-hidden="true" size={16} />
          </span>
        </Link>

        <button
          className="group relative z-10 ml-auto flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/8 p-0 text-white shadow-accent-sm transition-all duration-300 hover:scale-105 hover:bg-white/15 min-[1181px]:hidden"
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-controls="mobile-navigation"
          aria-expanded={open}
          ref={menuButtonRef}
          onClick={() => setOpen((value) => !value)}
        >
          <Menu
            aria-hidden="true"
            className={`absolute transition-all duration-300 ${open ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"}`}
            size={20}
          />
          <X
            aria-hidden="true"
            className={`absolute transition-all duration-300 ${open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0"}`}
            size={20}
          />
        </button>
      </div>
      </header>

      <div
        className={`fixed inset-0 z-90 overflow-hidden ${open ? "visible pointer-events-auto" : "invisible pointer-events-none"}`}
        id="mobile-navigation"
        aria-hidden={!open}
        aria-label="Mobile navigation"
        aria-modal="true"
        inert={!open}
        role="dialog"
      >
        <button
          className={`absolute inset-0 w-full border-0 bg-primary-ink/70 backdrop-blur-sm transition-opacity duration-500 motion-reduce:transition-none ${open ? "opacity-100" : "opacity-0"}`}
          type="button"
          aria-label="Close navigation"
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
        />

        <div
          ref={drawerRef}
          className={`relative ml-auto flex h-[100dvh] w-[min(94vw,31rem)] max-w-full min-w-0 origin-right touch-pan-y flex-col overflow-x-hidden overflow-y-auto overscroll-contain rounded-l-[2.25rem] border-l border-white/15 bg-primary-ink px-5 pb-7 pt-5 text-white shadow-dropdown transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none sm:px-7 ${open ? "translate-x-0 scale-100 opacity-100" : "translate-x-[105%] scale-[0.985] opacity-0"}`}
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-l-[2.25rem]">
            <span
              className={`absolute -right-28 -top-28 size-80 rounded-full border-[3rem] border-secondary/12 transition-[transform,opacity] duration-700 ease-out motion-reduce:transition-none ${open ? "rotate-0 scale-100 opacity-100 delay-150" : "rotate-12 scale-75 opacity-0 delay-0"}`}
            />
            <span
              className={`absolute -left-24 bottom-20 size-64 rounded-full bg-accent/10 blur-3xl transition-[transform,opacity] duration-700 ease-out motion-reduce:transition-none ${open ? "translate-x-0 scale-100 opacity-100 delay-200" : "-translate-x-10 scale-75 opacity-0 delay-0"}`}
            />
          </div>

          <div className={`relative z-10 flex min-w-0 items-center justify-between border-b border-white/12 pb-5 transition-[transform,opacity] duration-500 ease-out motion-reduce:transition-none ${open ? "translate-y-0 opacity-100 delay-150" : "-translate-y-3 opacity-0 delay-0"}`}>
            <BrandLogo compact inverse onNavigate={() => setOpen(false)} />
            <button
              className="flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/8 text-white transition duration-300 hover:rotate-90 hover:bg-white/15"
              type="button"
              onClick={() => setOpen(false)}
            >
              <X aria-hidden="true" size={20} />
              <span className="sr-only">Close</span>
            </button>
          </div>

          <div className={`relative z-10 mt-7 flex min-w-0 items-center gap-2 text-[0.65rem] font-extrabold uppercase tracking-[0.22em] text-secondary-light transition-[transform,opacity] duration-500 ease-out motion-reduce:transition-none ${open ? "translate-y-0 opacity-100 delay-200" : "translate-y-3 opacity-0 delay-0"}`}>
            <Compass aria-hidden="true" size={15} />
            Choose your direction
          </div>

          <nav className="relative z-10 my-6" aria-label="Mobile primary navigation">
            <ul className="m-0 grid list-none gap-2 p-0">
              {roots.map((item, index) => (
                <li
                  className={`min-w-0 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${open ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}
                  key={item.id}
                  style={{ transitionDelay: open ? `${120 + index * 55}ms` : "0ms" }}
                >
                  <MobileNavLink
                    href={item.href}
                    active={isActive(item.href)}
                    index={index}
                    onNavigate={() => setOpen(false)}
                  >
                    {item.label}
                  </MobileNavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className={`relative z-10 mt-auto min-w-0 transition-[transform,opacity] duration-500 ease-out motion-reduce:transition-none ${open ? "translate-y-0 opacity-100 delay-[480ms]" : "translate-y-5 opacity-0 delay-0"}`}>
            <Link
              className="group flex items-center justify-between rounded-[1.2rem] bg-gradient-to-r from-secondary to-accent px-5 py-4 font-extrabold text-white no-underline shadow-accent-md transition-transform duration-300 hover:-translate-y-1"
              href="/contact-us"
              onClick={() => setOpen(false)}
            >
              <span className="min-w-0">
                <span className="block break-words text-[0.62rem] uppercase tracking-[0.18em] text-white/70">Your next chapter</span>
                <span className="mt-0.5 block break-words">Start planning</span>
              </span>
              <span className="flex size-10 items-center justify-center rounded-full bg-white/16 transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight aria-hidden="true" size={19} />
              </span>
            </Link>

            {phone || email ? (
              <div className="mt-5 flex min-w-0 flex-wrap gap-x-5 gap-y-2 text-xs text-white/68 [&_a]:flex [&_a]:min-w-0 [&_a]:max-w-full [&_a]:items-center [&_a]:gap-2 [&_a]:break-all [&_a]:no-underline [&_a]:transition-colors [&_a:hover]:text-secondary-light [&_svg]:shrink-0">
                {email ? <a href={`mailto:${email}`}><Mail aria-hidden="true" size={15} /> {email}</a> : null}
                {phone ? <a href={`tel:${phone}`}><Phone aria-hidden="true" size={15} /> {phone}</a> : null}
              </div>
            ) : null}
            <SocialContactLinks site={site} className="mt-3 text-white/80" />
          </div>
        </div>
      </div>
    </>
  );
}

function DesktopNavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  const className = `group relative flex items-center gap-1.5 overflow-hidden rounded-full px-2.5 py-2.5 text-[0.68rem] font-extrabold uppercase tracking-[0.04em] no-underline transition-all duration-300 ${
    active
      ? "text-white"
      : "text-white/72 hover:-translate-y-0.5 hover:bg-white/8 hover:text-white"
  }`;
  const content = (
    <>
      <span
        aria-hidden="true"
        className={`size-1.5 rounded-full bg-secondary transition-all duration-300 ${active ? "scale-100 opacity-100" : "scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100"}`}
      />
      <span>{children}</span>
    </>
  );

  return href.startsWith("/") ? (
    <Link className={className} href={href} aria-current={active ? "page" : undefined}>
      {content}
    </Link>
  ) : (
    <a className={className} href={href} rel="noreferrer" aria-current={active ? "page" : undefined}>
      {content}
    </a>
  );
}

function MobileNavLink({
  href,
  active,
  index,
  children,
  onNavigate,
}: {
  href: string;
  active: boolean;
  index: number;
  children: React.ReactNode;
  onNavigate: () => void;
}) {
  const className = `group grid min-w-0 grid-cols-[2.1rem_minmax(0,1fr)_2.5rem] items-center gap-3 rounded-[1.15rem] border px-3 py-3.5 no-underline transition-all duration-300 ${
    active
      ? "border-secondary/40 bg-white/12 text-secondary-light"
      : "border-white/8 bg-white/[0.035] text-white hover:border-white/20 hover:bg-white/8"
  }`;
  const content = (
    <>
      <span className={`text-[0.62rem] font-extrabold tracking-[0.12em] ${active ? "text-secondary-light" : "text-white/38"}`}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="min-w-0 break-words font-display text-[clamp(1.35rem,6vw,1.8rem)] font-medium leading-none">
        {children}
      </span>
      <span className={`flex size-9 items-center justify-center rounded-full transition-all duration-300 ${active ? "rotate-[-45deg] bg-secondary text-white" : "bg-white/8 text-white/55 group-hover:translate-x-0.5 group-hover:bg-white/15 group-hover:text-white"}`}>
        <ChevronRight aria-hidden="true" size={17} />
      </span>
    </>
  );

  return href.startsWith("/") ? (
    <Link
      className={className}
      href={href}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
    >
      {content}
    </Link>
  ) : (
    <a
      className={className}
      href={href}
      rel="noreferrer"
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
    >
      {content}
    </a>
  );
}

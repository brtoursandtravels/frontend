"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  ChevronRight,
  Compass,
  Mail,
  Menu,
  Phone,
  X,
} from "lucide-react";
import type { SiteData } from "@/lib/contracts";
import { settingText } from "@/lib/presentation";
import { BrandLogo } from "@/components/common/BrandLogo";

const defaultNavigation = [
  { id: "home", parentId: null, href: "/", label: "Home", sortOrder: 0 },
  { id: "about-us", parentId: null, href: "/about-us", label: "About Us", sortOrder: 1 },
  { id: "tours", parentId: null, href: "/packages", label: "Tours / Packages", sortOrder: 2 },
  { id: "gallery", parentId: null, href: "/gallery", label: "Gallery", sortOrder: 3 },
  { id: "contact-us", parentId: null, href: "/contact-us", label: "Contact Us", sortOrder: 4 },
  { id: "blog", parentId: null, href: "/blog", label: "Blog", sortOrder: 5 },
];

export function SiteHeader({ site }: { site?: SiteData | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const desktopNavRef = useRef<HTMLUListElement>(null);
  const activePillRef = useRef<HTMLLIElement>(null);
  const items = useMemo(() => {
    const configured = site?.menus.find(
      (menu) => menu.key === "primary" || menu.key === "header",
    )?.items;
    return configured?.length ? configured : defaultNavigation;
  }, [site]);
  const roots = items.filter((item) => !item.parentId);
  const phone = settingText(site, ["contact.phone", "business.phone", "phone"]);
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
    if (href === "/packages") return pathname.startsWith("/packages");
    if (href === "/blog") return pathname.startsWith("/blog");
    return pathname === href;
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
  }, [pathname, roots.length]);

  return (
    <header
      className={`sticky top-0 z-80 bg-gradient-to-b from-bg-base via-bg-base/92 to-transparent px-3 transition-[padding] duration-500 sm:px-5 ${scrolled ? "py-2" : "py-3 sm:py-4"}`}
    >
      <div
        className={`relative mx-auto flex w-full max-w-7xl items-center gap-4 overflow-hidden rounded-[1.45rem] border px-4 transition-all duration-500 sm:px-5 lg:px-6 ${
          scrolled
            ? "min-h-[4.25rem] border-primary/12 bg-white/94 shadow-header backdrop-blur-2xl"
            : "min-h-[4.75rem] border-white/80 bg-white/76 shadow-card backdrop-blur-xl sm:min-h-[5.25rem]"
        }`}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-secondary/70 to-transparent"
        />
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute -left-12 top-1/2 size-32 -translate-y-1/2 rounded-full bg-secondary/10 blur-3xl transition-opacity duration-500 ${scrolled ? "opacity-40" : "opacity-100"}`}
        />

        <div className={`relative z-10 transition-transform duration-500 ${scrolled ? "scale-[0.92] origin-left" : "scale-100"}`}>
          <BrandLogo />
        </div>

        <nav
          className="relative z-10 ml-auto rounded-full border border-primary/8 bg-primary-soft/72 p-1.5 shadow-inner max-[1180px]:hidden"
          aria-label="Primary navigation"
        >
          <ul
            className="relative isolate m-0 flex list-none items-center gap-0.5 p-0"
            ref={desktopNavRef}
          >
            <li
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 -z-10 overflow-hidden rounded-full bg-primary opacity-0 shadow-card transition-[width,transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
              data-testid="active-nav-pill"
              ref={activePillRef}
            >
              <span className="absolute right-2 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-secondary shadow-glow" />
            </li>
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
          className="group relative z-10 isolate inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-primary px-5 py-3 text-xs font-extrabold text-white no-underline shadow-accent-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-accent-md max-[1180px]:hidden"
          href="/contact-us"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 -z-10 -translate-x-[105%] bg-gradient-to-r from-secondary to-accent transition-transform duration-500 ease-out group-hover:translate-x-0"
          />
          Plan my trip
          <span className="flex size-7 items-center justify-center rounded-full bg-white/14 transition-transform duration-300 group-hover:rotate-45 group-hover:bg-white/20">
            <ArrowUpRight aria-hidden="true" size={16} />
          </span>
        </Link>

        <button
          className="group relative z-10 ml-auto hidden size-11 items-center justify-center overflow-hidden rounded-full border border-primary/15 bg-primary p-0 text-white shadow-accent-sm transition-all duration-300 hover:scale-105 hover:bg-primary-hover max-[1180px]:flex"
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
          className={`absolute inset-0 w-full border-0 bg-primary-ink/70 backdrop-blur-sm transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`}
          type="button"
          aria-label="Close navigation"
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
        />

        <div
          ref={drawerRef}
          className={`relative ml-auto flex h-[100dvh] w-[min(94vw,31rem)] flex-col overflow-y-auto rounded-l-[2.25rem] border-l border-white/15 bg-primary-ink px-5 pb-7 pt-5 text-white shadow-dropdown transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-7 ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-28 -top-28 size-80 rounded-full border-[3rem] border-secondary/12"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 bottom-20 size-64 rounded-full bg-accent/10 blur-3xl"
          />

          <div className="relative z-10 flex items-center justify-between border-b border-white/12 pb-5">
            <BrandLogo compact onNavigate={() => setOpen(false)} />
            <button
              className="flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/8 text-white transition duration-300 hover:rotate-90 hover:bg-white/15"
              type="button"
              onClick={() => setOpen(false)}
            >
              <X aria-hidden="true" size={20} />
              <span className="sr-only">Close</span>
            </button>
          </div>

          <div className="relative z-10 mt-7 flex items-center gap-2 text-[0.65rem] font-extrabold uppercase tracking-[0.22em] text-secondary-light">
            <Compass aria-hidden="true" size={15} />
            Choose your direction
          </div>

          <nav className="relative z-10 my-6" aria-label="Mobile primary navigation">
            <ul className="m-0 grid list-none gap-2 p-0">
              {roots.map((item, index) => (
                <li
                  className={`transition-all duration-500 ${open ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}
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

          <div className="relative z-10 mt-auto">
            <Link
              className="group flex items-center justify-between rounded-[1.2rem] bg-gradient-to-r from-secondary to-accent px-5 py-4 font-extrabold text-white no-underline shadow-accent-md transition-transform duration-300 hover:-translate-y-1"
              href="/contact-us"
              onClick={() => setOpen(false)}
            >
              <span>
                <span className="block text-[0.62rem] uppercase tracking-[0.18em] text-white/70">Your next chapter</span>
                <span className="mt-0.5 block">Start planning</span>
              </span>
              <span className="flex size-10 items-center justify-center rounded-full bg-white/16 transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight aria-hidden="true" size={19} />
              </span>
            </Link>

            {phone || email ? (
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/68 [&_a]:flex [&_a]:items-center [&_a]:gap-2 [&_a]:no-underline [&_a]:transition-colors [&_a:hover]:text-secondary-light">
                {phone ? (
                  <a href={`tel:${phone}`}>
                    <Phone aria-hidden="true" size={15} /> {phone}
                  </a>
                ) : null}
                {email ? (
                  <a href={`mailto:${email}`}>
                    <Mail aria-hidden="true" size={15} /> {email}
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
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
  const className = `group relative flex items-center gap-1.5 overflow-hidden rounded-full px-2.5 py-2.5 text-[0.61rem] font-extrabold uppercase tracking-[0.045em] no-underline transition-all duration-300 ${
    active
      ? "text-white"
      : "text-text-heading hover:-translate-y-0.5 hover:bg-white hover:text-primary hover:shadow-card"
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
  const className = `group grid grid-cols-[2.1rem_1fr_2.5rem] items-center gap-3 rounded-[1.15rem] border px-3 py-3.5 no-underline transition-all duration-300 ${
    active
      ? "border-secondary/40 bg-white/12 text-secondary-light"
      : "border-white/8 bg-white/[0.035] text-white hover:border-white/20 hover:bg-white/8"
  }`;
  const content = (
    <>
      <span className={`text-[0.62rem] font-extrabold tracking-[0.12em] ${active ? "text-secondary-light" : "text-white/38"}`}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="font-display text-[clamp(1.35rem,6vw,1.8rem)] font-medium leading-none">
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

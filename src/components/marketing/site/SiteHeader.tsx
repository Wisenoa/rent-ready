"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";

import { LoknaLogo } from "@/components/ui/lokna-logo";
import styles from "@/components/marketing/home/home.module.css";

import { AUTH_LINKS, NAV_GROUPS, NAV_PRICING, type NavGroup } from "./nav-data";

/**
 * The one header of every public page, homepage included.
 *
 * Desktop: three disclosure menus (Produit, Outils gratuits, Guides &
 * ressources) and Tarifs. A menu opens on click or on mouse hover, closes on
 * Escape (focus returns to its button), on an outside click and on navigation.
 *
 * Mobile: a full-height sheet under the bar. While open it locks page scroll,
 * keeps Tab inside itself, and closes on Escape, on navigation and when the
 * viewport grows to the desktop layout.
 */

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function groupIsActive(pathname: string, group: NavGroup): boolean {
  return group.links.some((link) => isActive(pathname, link.href)) || isActive(pathname, group.hub.href);
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const [openMenu, setOpenMenu] = useState<NavGroup["id"] | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const buttonRefs = useRef<Partial<Record<NavGroup["id"], HTMLButtonElement | null>>>({});
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const baseId = useId();

  const closeAll = useCallback(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, []);

  // Navigation closes every menu.
  useEffect(() => {
    closeAll();
  }, [pathname, closeAll]);

  // Desktop menus: Escape and outside click.
  useEffect(() => {
    if (!openMenu) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        const id = openMenu;
        setOpenMenu(null);
        buttonRefs.current[id]?.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [openMenu]);

  // Mobile sheet: scroll lock, focus, Escape, Tab trap, desktop resize.
  useEffect(() => {
    if (!mobileOpen) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    const panel = mobilePanelRef.current;
    panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        mobileToggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const items = [mobileToggleRef.current, ...Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE))].filter(
        (el): el is HTMLElement => Boolean(el)
      );
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onResize = () => {
      if (desktop.matches) setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);
    return () => {
      root.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
    };
  }, [mobileOpen]);

  const openOnHover = (id: NavGroup["id"]) => (event: React.PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setOpenMenu(id);
  };
  const closeOnLeave = (event: React.PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpenMenu(null), 160);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-cream/10 bg-forest/95 text-cream backdrop-blur-md">
      {/* The skip link to #main comes from the root layout. */}
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <div className="flex min-w-0 items-center gap-8">
          <Link
            href="/"
            aria-label="Lokna, accueil"
            className="shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
          >
            <LoknaLogo variant="light" size={26} />
          </Link>

          <nav ref={navRef} aria-label="Navigation principale" className="hidden items-center gap-1 lg:flex">
            {NAV_GROUPS.map((group) => {
              const panelId = `${baseId}-${group.id}`;
              const open = openMenu === group.id;
              const active = groupIsActive(pathname, group);
              return (
                <div
                  key={group.id}
                  className="relative"
                  onPointerEnter={openOnHover(group.id)}
                  onPointerLeave={closeOnLeave}
                >
                  <button
                    ref={(el) => {
                      buttonRefs.current[group.id] = el;
                    }}
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenMenu(open ? null : group.id)}
                    className={`inline-flex items-center gap-1 rounded-md px-3 py-2 text-[14px] transition-colors hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream ${
                      active || open ? "text-cream" : "text-cream/80"
                    }`}
                  >
                    {group.label}
                    <ChevronDown
                      aria-hidden="true"
                      className={`size-3.5 transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    id={panelId}
                    hidden={!open}
                    className="absolute left-0 top-full w-[34rem] pt-2"
                  >
                    <div className="overflow-hidden rounded-xl border border-line bg-cream text-ink shadow-[0_30px_60px_-30px_rgba(6,24,18,0.55)]">
                      <ul className="grid grid-cols-2 gap-1 p-3">
                        {group.links.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              aria-current={pathname === link.href ? "page" : undefined}
                              onClick={() => setOpenMenu(null)}
                              className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-paper focus-visible:bg-paper focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-forest aria-[current=page]:bg-sage-50"
                            >
                              <span className="block text-[14px] font-medium text-ink">{link.label}</span>
                              {link.description ? (
                                <span className="mt-0.5 block text-[12.5px] leading-5 text-ink-muted">{link.description}</span>
                              ) : null}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={group.hub.href}
                        onClick={() => setOpenMenu(null)}
                        className="flex items-center justify-between border-t border-line-soft bg-paper px-6 py-3 text-[13.5px] font-medium text-forest transition-colors hover:bg-sage-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-forest"
                      >
                        {group.hub.label}
                        <ArrowRight aria-hidden="true" className="size-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
            <Link
              href={NAV_PRICING.href}
              aria-current={isActive(pathname, NAV_PRICING.href) ? "page" : undefined}
              className={`${styles.navLink} ml-3 text-[14px] transition-colors hover:text-cream focus-visible:outline-none ${
                isActive(pathname, NAV_PRICING.href) ? "text-cream" : "text-cream/80"
              }`}
            >
              {NAV_PRICING.label}
            </Link>
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <Link
            href={AUTH_LINKS.login.href}
            className="hidden text-[14px] text-cream/80 transition-colors hover:text-cream focus-visible:underline focus-visible:underline-offset-4 focus-visible:outline-none sm:inline"
          >
            {AUTH_LINKS.login.label}
          </Link>
          <Link
            href={AUTH_LINKS.signup.href}
            className={`${styles.cta} whitespace-nowrap rounded-md bg-cream px-3.5 py-2 text-[14px] font-medium text-forest hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream sm:px-4`}
          >
            {AUTH_LINKS.signup.label}
          </Link>
          <button
            ref={mobileToggleRef}
            type="button"
            aria-expanded={mobileOpen}
            aria-controls={`${baseId}-mobile`}
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setMobileOpen((value) => !value)}
            className="-mr-2 inline-flex size-10 items-center justify-center rounded-md text-cream/90 transition-colors hover:bg-cream/10 hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream lg:hidden"
          >
            {mobileOpen ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
          </button>
        </div>
      </div>

      <div
        ref={mobilePanelRef}
        id={`${baseId}-mobile`}
        hidden={!mobileOpen}
        className="fixed inset-x-0 bottom-0 top-14 overflow-y-auto overscroll-contain bg-cream text-ink lg:hidden"
      >
        <nav aria-label="Navigation mobile" className="mx-auto max-w-xl px-5 pb-10 pt-4">
          {NAV_GROUPS.map((group) => (
            <section key={group.id} className="border-b border-line-soft py-4">
              <h2 className="px-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-soft">{group.label}</h2>
              <ul className="mt-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={pathname === link.href ? "page" : undefined}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-lg px-2 py-2.5 text-[16px] text-ink transition-colors hover:bg-paper focus-visible:bg-paper focus-visible:outline-2 focus-visible:outline-forest aria-[current=page]:font-semibold aria-[current=page]:text-forest"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href={group.hub.href}
                    onClick={() => setMobileOpen(false)}
                    className="mt-1 flex items-center gap-1.5 rounded-lg px-2 py-2.5 text-[15px] font-medium text-forest hover:bg-paper focus-visible:outline-2 focus-visible:outline-forest"
                  >
                    {group.hub.label}
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                </li>
              </ul>
            </section>
          ))}
          <div className="py-4">
            <Link
              href={NAV_PRICING.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-2 py-2.5 text-[16px] font-medium text-ink hover:bg-paper focus-visible:outline-2 focus-visible:outline-forest"
            >
              {NAV_PRICING.label}
            </Link>
          </div>
          <div className="grid gap-3 pt-2">
            <Link
              href={AUTH_LINKS.signup.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-md bg-forest px-4 py-3 text-center text-[15px] font-medium text-cream transition-colors hover:bg-forest-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
            >
              {AUTH_LINKS.signup.label}
            </Link>
            <Link
              href={AUTH_LINKS.login.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-md border border-line px-4 py-3 text-center text-[15px] font-medium text-ink transition-colors hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
            >
              {AUTH_LINKS.login.label}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

export type BrandedSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export function BrandedSelect({
  id,
  name,
  options,
  defaultValue = "",
  onValueChange,
  submitOnValueChange = false,
  className = "",
  pill = false,
  ariaLabel,
}: {
  id?: string;
  name?: string;
  options: BrandedSelectOption[];
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  submitOnValueChange?: boolean;
  className?: string;
  pill?: boolean;
  ariaLabel?: string;
}) {
  const generatedId = useId().replaceAll(":", "");
  const buttonId = id ?? `br-select-${generatedId}`;
  const listboxId = `${buttonId}-options`;
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const selected = options[selectedIndex] ?? options[0];

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, []);

  useEffect(() => {
    const form = buttonRef.current?.form;
    if (!form) return;
    const reset = () => setValue(defaultValue);
    form.addEventListener("reset", reset);
    return () => form.removeEventListener("reset", reset);
  }, [defaultValue]);

  function choose(nextValue: string) {
    const changed = nextValue !== value;
    setValue(nextValue);
    setOpen(false);
    if (changed) onValueChange?.(nextValue);
    window.requestAnimationFrame(() => {
      if (changed && submitOnValueChange) {
        buttonRef.current?.form?.requestSubmit();
        return;
      }
      buttonRef.current?.focus();
    });
  }

  function focusOption(index: number, direction: 1 | -1 = 1) {
    if (!options.length) return;
    let nextIndex = (index + options.length) % options.length;
    for (let checked = 0; checked < options.length; checked += 1) {
      if (!options[nextIndex].disabled) {
        optionRefs.current[nextIndex]?.focus();
        return;
      }
      nextIndex = (nextIndex + direction + options.length) % options.length;
    }
  }

  return (
    <div className={`relative min-w-0 ${className}`} ref={rootRef}>
      {name ? <input type="hidden" name={name} value={value} /> : null}
      <button
        aria-controls={listboxId}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        className={`flex min-h-11 w-full items-center justify-between gap-3 border border-border-subtle bg-white px-4 py-2.5 text-left text-sm font-semibold text-text-heading shadow-[0_4px_14px_-12px_rgb(11_59_60_/_0.55)] outline-none transition hover:border-primary/40 hover:bg-primary-soft/35 focus-visible:border-secondary focus-visible:ring-3 focus-visible:ring-secondary/15 ${pill ? "rounded-full" : "rounded-md"}`}
        id={buttonId}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
            event.preventDefault();
            setOpen(true);
            window.requestAnimationFrame(() => {
              if (event.key === "End") focusOption(options.length - 1, -1);
              else if (event.key === "Home") focusOption(0);
              else if (event.key === "ArrowUp") focusOption(selectedIndex - 1, -1);
              else focusOption(selectedIndex);
            });
          }
        }}
        ref={buttonRef}
        type="button"
      >
        <span className="min-w-0 truncate">{selected?.label}</span>
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
          <ChevronDown
            aria-hidden="true"
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            size={16}
          />
        </span>
      </button>

      {open ? (
        <div
          aria-labelledby={buttonId}
          className={`absolute left-0 right-0 top-[calc(100%+0.45rem)] z-70 max-h-64 overflow-y-auto rounded-lg border border-primary/15 bg-[#fffaf5] p-1.5 shadow-dropdown ${pill ? "rounded-xl" : ""}`}
          id={listboxId}
          onKeyDown={(event) => {
            const currentIndex = optionRefs.current.findIndex(
              (option) => option === document.activeElement,
            );
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              const direction = event.key === "ArrowDown" ? 1 : -1;
              focusOption(currentIndex + direction, direction);
            } else if (event.key === "Home" || event.key === "End") {
              event.preventDefault();
              focusOption(
                event.key === "Home" ? 0 : options.length - 1,
                event.key === "Home" ? 1 : -1,
              );
            } else if (event.key === "Escape" || event.key === "Tab") {
              setOpen(false);
              if (event.key === "Escape") {
                event.preventDefault();
                buttonRef.current?.focus();
              }
            }
          }}
          role="listbox"
        >
          {options.map((option, index) => {
            const active = option.value === value;
            return (
              <button
                aria-selected={active}
                className={`flex min-h-10 w-full items-center justify-between gap-3 rounded-md border-0 px-3 py-2 text-left text-sm font-semibold transition ${
                  active
                    ? "bg-primary text-white shadow-sm"
                    : "bg-transparent text-text-heading hover:bg-accent-soft hover:text-primary"
                } disabled:cursor-not-allowed disabled:opacity-45`}
                disabled={option.disabled}
                key={`${option.value}-${option.label}`}
                onClick={() => choose(option.value)}
                ref={(node) => {
                  optionRefs.current[index] = node;
                }}
                role="option"
                tabIndex={index === selectedIndex ? 0 : -1}
                type="button"
              >
                <span className="min-w-0 [overflow-wrap:anywhere]">{option.label}</span>
                {active ? <Check aria-hidden="true" className="shrink-0 text-secondary-light" size={16} /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

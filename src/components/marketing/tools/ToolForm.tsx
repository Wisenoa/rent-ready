import type { ReactNode } from "react";

/**
 * Layout and fields of a free tool. Presentational only (no state), so the same
 * pieces render inside a client calculator or on the server.
 *
 * Accessibility: every control has a visible <label>; hints and errors are tied
 * to it with aria-describedby; errors set aria-invalid and say what to type;
 * radio groups are native inputs, so arrow keys and focus work as in any form.
 */

/** Form on the left, result on the right (sticky on large screens); stacked below `lg`. */
export function ToolWorkbench({
  form,
  result,
  variant = "calculator",
}: {
  form: ReactNode;
  result: ReactNode;
  variant?: "calculator" | "document";
}) {
  const cols =
    variant === "document"
      ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)]"
      : "lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)]";
  return (
    <div className={`grid gap-6 ${cols} lg:items-start xl:gap-10`}>
      <div className="min-w-0">{form}</div>
      <div className="min-w-0 lg:sticky lg:top-24">{result}</div>
    </div>
  );
}

export function ToolSheet({ children, label }: { children: ReactNode; label: string }) {
  return (
    <form
      aria-label={label}
      noValidate
      onSubmit={(event) => event.preventDefault()}
      className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_1px_0_rgba(21,36,31,0.04)]"
    >
      {children}
    </form>
  );
}

/** One numbered step of the form. */
export function ToolStep({
  step,
  title,
  description,
  children,
}: {
  step: number;
  title: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  const id = `etape-${step}`;
  return (
    <section aria-labelledby={id} className="border-t border-line-soft px-5 py-6 first:border-t-0 sm:px-7 sm:py-7">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="mt-px inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-sage-50 text-[12.5px] font-semibold tabular-nums text-forest ring-1 ring-sage-200 sm:size-7 sm:text-[13px]"
        >
          {step}
        </span>
        <h2 id={id} className="min-w-0 text-[17px] font-semibold leading-6 tracking-[-0.01em] text-ink sm:pt-0.5">
          {title}
        </h2>
      </div>
      <div className="sm:pl-10">
        {description ? <div className="mt-1.5 text-[14.5px] leading-6 text-ink-muted">{description}</div> : null}
        <div className="mt-5 space-y-5">{children}</div>
      </div>
    </section>
  );
}

const FIELD =
  "block w-full rounded-lg border bg-cream/50 text-ink tabular-nums transition-[border-color,box-shadow,background-color] duration-150 placeholder:text-ink-soft/70 focus:bg-white focus:outline-none focus:ring-4 motion-reduce:transition-none";
const FIELD_OK = "border-line hover:border-sage-300 focus:border-forest focus:ring-sage-100";
const FIELD_ERROR = "border-[#B42318] focus:border-[#B42318] focus:ring-[#FBE4E2]";

export function fieldClass(invalid: boolean, extra = ""): string {
  return `${FIELD} ${invalid ? FIELD_ERROR : FIELD_OK} ${extra}`;
}

export function FieldMessages({ id, hint, error }: { id: string; hint?: ReactNode; error?: string | null }) {
  return (
    <>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-[13.5px] leading-5 text-ink-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1.5 text-[13.5px] font-medium leading-5 text-[#A1281E]">
          <svg aria-hidden="true" viewBox="0 0 16 16" className="mt-0.5 size-3.5 shrink-0" fill="currentColor">
            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm-.75 3.5h1.5v5h-1.5v-5Zm0 6h1.5V12h-1.5v-1.5Z" />
          </svg>
          {error}
        </p>
      ) : null}
    </>
  );
}

export function describedBy(id: string, hint?: ReactNode, error?: string | null): string | undefined {
  const ids = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean);
  return ids.length ? ids.join(" ") : undefined;
}

export function AmountField({
  id,
  label,
  value,
  onChange,
  placeholder,
  suffix = "€",
  hint,
  error,
  size = "md",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suffix?: string;
  hint?: ReactNode;
  error?: string | null;
  size?: "md" | "lg";
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[14.5px] font-medium text-ink">
        {label}
      </label>
      <div className="relative mt-2">
        <input
          id={id}
          name={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
          className={fieldClass(
            Boolean(error),
            size === "lg" ? "h-14 pl-4 pr-24 text-[1.35rem] font-semibold tracking-[-0.01em]" : "h-12 pl-4 pr-16 text-[16px]"
          )}
        />
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 right-4 flex items-center text-ink-muted ${size === "lg" ? "text-[15px]" : "text-[14px]"}`}
        >
          {suffix}
        </span>
      </div>
      <FieldMessages id={id} hint={hint} error={error} />
    </div>
  );
}

export interface Choice<T extends string> {
  value: T;
  label: string;
  description?: string;
}

/** A radio group drawn as tiles. `columns` sets the grid from `sm` up. */
export function ChoiceGroup<T extends string>({
  name,
  legend,
  choices,
  value,
  onChange,
  hint,
  columns = 2,
  compact = false,
}: {
  name: string;
  legend: string;
  choices: Choice<T>[];
  value: T;
  onChange: (value: T) => void;
  hint?: ReactNode;
  columns?: 2 | 4;
  compact?: boolean;
}) {
  return (
    <fieldset aria-describedby={hint ? `${name}-hint` : undefined}>
      <legend className="text-[14.5px] font-medium text-ink">{legend}</legend>
      <div className={`mt-2 grid gap-2 ${columns === 4 ? "grid-cols-4" : "sm:grid-cols-2"}`}>
        {choices.map((choice) => (
          <label key={choice.value} className="relative flex min-w-0 cursor-pointer">
            <input
              type="radio"
              name={name}
              value={choice.value}
              checked={value === choice.value}
              onChange={() => onChange(choice.value)}
              className="peer sr-only"
            />
            <span
              className={`flex w-full flex-col rounded-lg border border-line bg-cream/50 text-ink transition-[border-color,background-color,box-shadow] duration-150 hover:border-sage-300 peer-checked:border-forest peer-checked:bg-sage-50 peer-checked:shadow-[inset_0_0_0_1px_var(--color-forest)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-forest motion-reduce:transition-none ${
                compact ? "items-center px-2 py-3 text-center" : "px-4 py-3.5"
              }`}
            >
              <span className={`font-semibold ${compact ? "text-[15px] tabular-nums" : "text-[15px]"}`}>{choice.label}</span>
              {choice.description ? (
                <span className={`mt-0.5 text-ink-muted ${compact ? "hidden text-[12px] sm:block" : "text-[13.5px] leading-5"}`}>
                  {choice.description}
                </span>
              ) : null}
            </span>
          </label>
        ))}
      </div>
      {hint ? (
        <p id={`${name}-hint`} className="mt-2 text-[13.5px] leading-5 text-ink-muted">
          {hint}
        </p>
      ) : null}
    </fieldset>
  );
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  hint?: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[14.5px] font-medium text-ink">
        {label}
      </label>
      <div className="relative mt-2">
        <select
          id={id}
          name={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-describedby={describedBy(id, hint)}
          className={fieldClass(false, "h-12 appearance-none pl-4 pr-10 text-[15.5px]")}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <path d="m5 8 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <FieldMessages id={id} hint={hint} />
    </div>
  );
}

export function DateField({
  id,
  label,
  value,
  onChange,
  error,
  min,
  max,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  min?: string;
  max?: string;
  hint?: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block text-[14.5px] font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={fieldClass(Boolean(error), "mt-2 h-12 min-w-0 px-3.5 text-[15.5px]")}
      />
      <FieldMessages id={id} hint={hint} error={error} />
    </div>
  );
}

export function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  hint,
  error,
  autoComplete = "off",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: ReactNode;
  error?: string | null;
  autoComplete?: string;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block text-[14.5px] font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type="text"
        autoComplete={autoComplete}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={fieldClass(Boolean(error), "mt-2 h-12 min-w-0 px-3.5 font-sans text-[15.5px]")}
      />
      <FieldMessages id={id} hint={hint} error={error} />
    </div>
  );
}


"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AmbientAiInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onAcceptSuggestion?: (value: string) => void;
  getSuggestion?: (
    currentValue: string,
    fieldName: string
  ) => Promise<string | null>;
  fieldContext?: string;
}

function AmbientAiInput({
  className,
  value: controlledValue,
  defaultValue,
  onChange,
  onAcceptSuggestion,
  getSuggestion,
  fieldContext = "",
  onKeyDown,
  ...props
}: AmbientAiInputProps) {
  const [internalValue, setInternalValue] = useState(
    (defaultValue as string) ?? ""
  );
  const value =
    controlledValue !== undefined ? String(controlledValue) : internalValue;

  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);

  const fetchSuggestion = useCallback(
    async (currentValue: string) => {
      if (!getSuggestion || currentValue.length < 2) {
        setSuggestion(null);
        return;
      }

      setIsLoading(true);
      try {
        const result = await getSuggestion(currentValue, fieldContext);
        setSuggestion(result);
      } catch {
        setSuggestion(null);
      } finally {
        setIsLoading(false);
      }
    },
    [getSuggestion, fieldContext]
  );

  useEffect(() => {
    if (!getSuggestion) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.length < 2) {
      setSuggestion(null);
      return;
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestion(value);
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, fetchSuggestion, getSuggestion]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" && suggestion) {
      e.preventDefault();
      const fullValue = value + suggestion;

      if (controlledValue === undefined) {
        setInternalValue(fullValue);
      }

      // Fire a synthetic change event
      const nativeEvent = new Event("input", { bubbles: true });
      const target = e.currentTarget;
      const nativeSetter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value"
      )?.set;
      nativeSetter?.call(target, fullValue);
      target.dispatchEvent(nativeEvent);

      onAcceptSuggestion?.(fullValue);
      setSuggestion(null);
    } else if (e.key === "Escape" && suggestion) {
      setSuggestion(null);
    }

    onKeyDown?.(e);
  };

  // When no getSuggestion is provided, render a plain Input
  if (!getSuggestion) {
    return (
      <Input
        className={className}
        value={controlledValue}
        defaultValue={defaultValue}
        onChange={onChange}
        onKeyDown={onKeyDown}
        {...props}
      />
    );
  }

  return (
    <div className="relative">
      {/* Mirror layer showing user text + ghost suggestion */}
      <div
        ref={mirrorRef}
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 flex items-center overflow-hidden px-2.5 py-1 text-base md:text-sm",
          "h-8 rounded-lg border border-transparent"
        )}
      >
        <span className="invisible whitespace-pre">{value}</span>
        {suggestion && (
          <span className={cn("ai-suggestion", isLoading && "ai-suggestion-pulse")}>
            {suggestion}
          </span>
        )}
      </div>

      {/* Actual input */}
      <Input
        className={cn("bg-transparent", className)}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        {...props}
      />
    </div>
  );
}

export { AmbientAiInput };
export type { AmbientAiInputProps };

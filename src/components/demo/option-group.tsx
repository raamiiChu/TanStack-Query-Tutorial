"use client";

import { Button } from "@/components/ui/button";

type Option<T> = { label: string; value: T };

type OptionGroupProps<T> = {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

const OptionGroup = <T,>({
  label,
  options,
  value,
  onChange,
}: OptionGroupProps<T>) => (
  <div className="flex flex-wrap items-center gap-2 text-sm">
    <span className="text-muted-foreground w-24 font-mono">{label}</span>
    {options.map((option) => (
      <Button
        key={option.label}
        size="sm"
        variant={option.value === value ? "default" : "outline"}
        onClick={() => onChange(option.value)}
      >
        {option.label}
      </Button>
    ))}
  </div>
);

export default OptionGroup;

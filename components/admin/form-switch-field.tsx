"use client";

import { useState } from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface FormSwitchFieldProps {
  id?: string;
  name: string;
  label: string;
  defaultChecked?: boolean;
  className?: string;
}

export function FormSwitchField({ id, name, label, defaultChecked = false, className }: FormSwitchFieldProps) {
  const [checked, setChecked] = useState(defaultChecked);
  const switchId = id ?? name;

  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2">
        <Label htmlFor={switchId} className="text-sm font-normal">
          {label}
        </Label>
        <Switch id={switchId} checked={checked} onCheckedChange={setChecked} />
      </div>
      <input type="hidden" name={name} value={checked ? "on" : "off"} />
    </div>
  );
}

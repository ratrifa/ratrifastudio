"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface PresentEndDateFieldProps {
  idSuffix: string;
  periodEndName?: string;
  presentName?: string;
  defaultPeriodEnd?: string;
  defaultPresent?: boolean;
}

export function PresentEndDateField({ idSuffix, periodEndName = "periodEnd", presentName = "isPresent", defaultPeriodEnd = "", defaultPresent = false }: PresentEndDateFieldProps) {
  const [isPresent, setIsPresent] = useState(defaultPresent);
  const [periodEnd, setPeriodEnd] = useState(defaultPeriodEnd);

  const periodEndId = `periodEnd-${idSuffix}`;

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor={periodEndId}>End Date</Label>
        <Input id={periodEndId} name={periodEndName} type="date" value={periodEnd} onChange={(event) => setPeriodEnd(event.target.value)} disabled={isPresent} />
      </div>

      <div className="md:col-span-2">
        <div className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2">
          <Label htmlFor={`present-${idSuffix}`} className="text-sm font-normal">
            This role is ongoing (Present)
          </Label>
          <Switch
            id={`present-${idSuffix}`}
            checked={isPresent}
            onCheckedChange={(checked) => {
              setIsPresent(checked);
              if (checked) {
                setPeriodEnd("");
              }
            }}
          />
        </div>
        <input type="hidden" name={presentName} value={isPresent ? "on" : "off"} />
      </div>
    </>
  );
}

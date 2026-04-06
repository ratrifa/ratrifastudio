"use client";

import { useId, useMemo, useRef, useState } from "react";
import { FileUp, Upload } from "lucide-react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FileDropInputProps {
  id?: string;
  name: string;
  label: string;
  accept?: string;
  helperText?: string;
  className?: string;
}

function matchesAccept(file: File, accept?: string) {
  if (!accept) {
    return true;
  }

  const tokens = accept
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);

  if (tokens.length === 0) {
    return true;
  }

  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  return tokens.some((token) => {
    if (token.endsWith("/*")) {
      const prefix = token.slice(0, -1);
      return fileType.startsWith(prefix);
    }

    if (token.startsWith(".")) {
      return fileName.endsWith(token);
    }

    return fileType === token;
  });
}

export function FileDropInput({ id, name, label, accept, helperText, className }: FileDropInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const acceptHint = useMemo(() => {
    if (!accept) {
      return "Drop file here or click to browse";
    }

    const labels = accept
      .split(",")
      .map((token) => token.trim())
      .filter(Boolean)
      .map((token) => token.replace("image/", "").replace("application/", "").toUpperCase());

    return `Drop file here or click to browse (${labels.join(", ")})`;
  }, [accept]);

  const applyFileToInput = (file: File) => {
    if (!inputRef.current) {
      return;
    }

    if (!matchesAccept(file, accept)) {
      setSelectedFileName("Format file tidak sesuai");
      return;
    }

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    inputRef.current.files = dataTransfer.files;
    inputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
    setSelectedFileName(file.name);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={inputId}>{label}</Label>
      <input
        ref={inputRef}
        id={inputId}
        name={name}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          setSelectedFileName(file ? file.name : "");
        }}
      />
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          if (event.currentTarget === event.target) {
            setIsDragging(false);
          }
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);

          const droppedFile = event.dataTransfer.files?.[0];
          if (droppedFile) {
            applyFileToInput(droppedFile);
          }
        }}
        className={cn(
          "group relative flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-5 text-center transition-colors",
          "bg-card/40 hover:bg-card/70",
          isDragging ? "border-primary bg-primary/10" : "border-border",
        )}
      >
        <div className="flex items-center gap-2 text-primary">
          <Upload size={16} />
          <FileUp size={16} />
        </div>
        <p className="text-sm text-foreground">{acceptHint}</p>
        <p className="text-xs text-muted-foreground">{selectedFileName ? `Selected: ${selectedFileName}` : (helperText ?? "")}</p>
      </div>
    </div>
  );
}

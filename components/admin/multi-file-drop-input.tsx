"use client";

import { useId, useMemo, useRef, useState } from "react";
import { FileUp, Upload, X } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MultiFileDropInputProps {
  id?: string;
  name: string;
  label: string;
  accept?: string;
  helperText?: string;
  maxFiles?: number;
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

export function MultiFileDropInput({ id, name, label, accept, helperText, maxFiles = 10, className }: MultiFileDropInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const acceptHint = useMemo(() => {
    if (!accept) {
      return `Drop files here or click to browse (max ${maxFiles} files)`;
    }

    const labels = accept
      .split(",")
      .map((token) => token.trim())
      .filter(Boolean)
      .map((token) => token.replace("image/", "").replace("application/", "").toUpperCase());

    return `Drop files here or click to browse (${labels.join(", ")}, max ${maxFiles} files)`;
  }, [accept, maxFiles]);

  const applyFilesToInput = (files: FileList) => {
    if (!inputRef.current) {
      return;
    }

    const validFiles: File[] = [];
    for (const file of files) {
      if (!matchesAccept(file, accept)) {
        continue;
      }
      validFiles.push(file);
    }

    const allFiles = [...selectedFiles, ...validFiles].slice(0, maxFiles);
    setSelectedFiles(allFiles);

    const dataTransfer = new DataTransfer();
    allFiles.forEach((file) => dataTransfer.items.add(file));
    inputRef.current.files = dataTransfer.files;
    inputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
  };

  const removeFile = (index: number) => {
    const updated = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updated);

    if (!inputRef.current) return;

    const dataTransfer = new DataTransfer();
    updated.forEach((file) => dataTransfer.items.add(file));
    inputRef.current.files = dataTransfer.files;
    inputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
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
        multiple
        className="sr-only"
        onChange={(event) => {
          const files = event.target.files;
          if (!files) return;

          const validFiles: File[] = [];
          for (const file of files) {
            if (matchesAccept(file, accept)) {
              validFiles.push(file);
            }
          }

          const allFiles = [...selectedFiles, ...validFiles].slice(0, maxFiles);
          setSelectedFiles(allFiles);
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

          const droppedFiles = event.dataTransfer.files;
          if (droppedFiles) {
            applyFilesToInput(droppedFiles);
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
        {selectedFiles.length > 0 && <p className="text-xs text-muted-foreground">{selectedFiles.length} file(s) selected</p>}
        <p className="text-xs text-muted-foreground">{helperText ?? ""}</p>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Selected files:</p>
          <div className="grid gap-2">
            {selectedFiles.map((file, index) => (
              <div key={`${file.name}-${index}`} className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
                <p className="truncate text-xs text-foreground">{file.name}</p>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)} className="h-5 w-5 p-0 hover:bg-destructive/20">
                  <X size={14} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

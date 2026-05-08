"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Photo {
  id: string;
  imageUrl: string;
  caption?: string | null;
}

interface PhotoLightboxProps {
  photos: Photo[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export function PhotoLightbox({ photos, initialIndex, isOpen, onClose }: PhotoLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, photos.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  if (!isOpen) return null;

  const currentPhoto = photos[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      {/* Close button */}
      <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-4 right-4 text-white hover:bg-white/10 z-10" aria-label="Close lightbox">
        <X size={24} />
      </Button>

      {/* Main image container */}
      <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8">
        <div className="relative w-full max-w-4xl aspect-auto">
          <Image src={currentPhoto.imageUrl} alt={currentPhoto.caption || "Dokumentasi"} fill className="object-contain" sizes="(max-width: 768px) 100vw, 90vw" priority />
        </div>

        {/* Navigation arrows */}
        {photos.length > 1 && (
          <>
            <Button variant="ghost" size="icon" onClick={handlePrevious} className="absolute left-4 text-white hover:bg-white/10 z-10" aria-label="Previous photo">
              <ChevronLeft size={24} />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleNext} className="absolute right-4 text-white hover:bg-white/10 z-10" aria-label="Next photo">
              <ChevronRight size={24} />
            </Button>
          </>
        )}
      </div>

      {/* Caption and counter */}
      <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {currentPhoto.caption && <p className="text-white text-sm md:text-base mb-2">{currentPhoto.caption}</p>}
          {photos.length > 1 && (
            <p className="text-white/60 text-xs md:text-sm">
              {currentIndex + 1} / {photos.length}
            </p>
          )}
        </div>
      </div>

      {/* Thumbnail strip for desktop */}
      {photos.length > 1 && (
        <div className="absolute top-4 left-4 right-4 md:left-auto md:right-auto md:bottom-4 md:top-auto flex gap-2 justify-start md:justify-center overflow-x-auto">
          {photos.map((photo, idx) => (
            <button
              key={photo.id}
              onClick={() => setCurrentIndex(idx)}
              className={`relative shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-all ${idx === currentIndex ? "border-primary/80 ring-2 ring-primary/50" : "border-white/20 opacity-60 hover:opacity-100"}`}
              aria-label={`View photo ${idx + 1}`}
            >
              <Image src={photo.imageUrl} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

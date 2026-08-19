import React, { useCallback, useEffect, useRef, useState } from "react";
import { RATING_EMOJIS } from "../data/ratings";

const MIN = 1;
const MAX = 10;

interface EmojiSliderProps {
  value?: number;
  onChange?: (rating: number) => void;
}

export default function EmojiSlider({ value, onChange }: EmojiSliderProps) {
  const [rawValue, setRawValue] = useState(value ?? 5.49);
  const [dragging, setDragging] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const previousRating = useRef(Math.trunc(value ?? 5));

  const rating = Math.max(MIN, Math.min(MAX, Math.round(rawValue)));

  useEffect(() => {
    if (value !== undefined) {
      setRawValue(value);
    }
  }, [value]);

  useEffect(() => {
    if (rating !== previousRating.current) {
      previousRating.current = rating;
      onChange?.(rating);
    }
  }, [rating, onChange]);

  const updateFromClientX = useCallback((clientX: number) => {
    const track = trackRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));

    setRawValue(MIN + ratio * (MAX - MIN));
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    updateFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragging) {
      updateFromClientX(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setDragging(false);

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      setRawValue(Math.min(MAX, rating + 1));
    }

    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      setRawValue(Math.max(MIN, rating - 1));
    }

    if (e.key === "Home") {
      e.preventDefault();
      setRawValue(MIN);
    }

    if (e.key === "End") {
      e.preventDefault();
      setRawValue(MAX);
    }
  };

  const percentage = ((Math.max(MIN, Math.min(MAX, rawValue)) - MIN) / (MAX - MIN)) * 100;

  return (
    <div className="w-full select-none rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-900/5 backdrop-blur">
      {/* Emoji */}
      <div className="flex flex-col items-center">
        <div className="mb-4 text-[8rem] leading-none drop-shadow-lg">
          {RATING_EMOJIS[rating - 1]}
        </div>

        {/* Rating number */}
        <div className="mb-8 flex w-full cursor-default items-baseline justify-center gap-1">
          <span className="text-4xl font-black text-slate-900">{rating}</span>
          <span className="font-semibold text-slate-400">/ 10</span>
        </div>
      </div>

      {/* Slider */}
      <div
        ref={trackRef}
        className="relative h-4 cursor-pointer touch-none rounded-full bg-brand-secondary/25"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}>
        {/* Filled track */}
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-brand-primary"
          style={{
            width: `${percentage}%`,
            transition: dragging ? "none" : "width 120ms ease-out",
          }}
        />

        {/* Thumb */}
        <div
          role="slider"
          tabIndex={0}
          aria-valuemin={MIN}
          aria-valuemax={MAX}
          aria-valuenow={rating}
          aria-label="Day rating"
          onKeyDown={handleKeyDown}
          className={`
            absolute top-1/2
            w-8 h-8
            flex items-center justify-center
            rounded-full
            bg-white
            shadow-lg
            cursor-grab
            active:cursor-grabbing
            ${dragging ? "ring-[3px] ring-brand-primary" : "border-2 border-white"}
            
            `}
          style={{
            left: `${percentage}%`,
            transform: "translate(-50%, -50%)",
            transition: dragging ? "none" : "left 120ms ease-out",
          }}>
          <div className="w-2 h-2 rounded-full bg-brand-primary" />
        </div>
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-3 px-1">
        <span className="text-xs font-bold text-slate-400">Terrible</span>
        <span className="text-xs font-bold text-slate-400">Amazing</span>
      </div>
    </div>
  );
}

import React, { useCallback, useEffect, useRef, useState } from "react";

const EMOJIS = ["😞", "😔", "🙁", "😕", "😐", "🙂", "😊", "😄", "😁", "😆"];
const MIN = 1;
const MAX = 10;

interface EmojiSliderProps {
  value?: number;
  onChange?: (rating: number) => void;
}

export default function EmojiSlider({ value, onChange }: EmojiSliderProps) {
  const [rawValue, setRawValue] = useState<number>(value ?? 5);
  const [dragging, setDragging] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const prevRatingRef = useRef<number>(Math.trunc(value ?? 5));

  const rating = Math.max(MIN, Math.min(MAX, Math.trunc(rawValue)));

  // Only report changes when the whole-number rating changes.
  useEffect(() => {
    if (rating !== prevRatingRef.current) {
      prevRatingRef.current = rating;
      onChange?.(rating);
    }
  }, [rating, onChange]);

  const updateFromClientX = useCallback((clientX: number) => {
    const track = trackRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    const clamped = Math.min(1, Math.max(0, ratio));

    const next = clamped * (MAX - MIN) + MIN;
    setRawValue(next);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    updateFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    updateFromClientX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setDragging(false);

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      setRawValue(Math.min(MAX, rating + 1));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      setRawValue(Math.max(MIN, rating - 1));
    }
  };

  // Continuous thumb position.
  const thumbPercent = ((Math.min(MAX, Math.max(MIN, rawValue)) - MIN) / (MAX - MIN)) * 100;

  return (
    <div className="mt-8 mx-6 max-w-md select-none">
      {/* Emoji */}
      <div className="flex items-center justify-center pt-2">
        <span className={`text-9xl ${rating === 10 ? "" : ""}`}>{EMOJIS[rating - 1]}</span>
      </div>

      {/* Slider */}
      <div
        ref={trackRef}
        className="relative h-3 rounded-full bg-blue-950/40 cursor-pointer touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}>
        {/* Filled track */}
        <div
          className="absolute top-0 left-0 h-3 rounded-full bg-green-700"
          style={{
            width: `${thumbPercent}%`,
            transition: dragging ? "none" : "width 150ms ease-out",
          }}
        />

        {/* Thumb */}
        <div
          role="slider"
          tabIndex={0}
          aria-valuemin={MIN}
          aria-valuemax={MAX}
          aria-valuenow={rating}
          aria-label="Rating"
          onKeyDown={handleKeyDown}
          className="
            absolute top-1/2
            flex items-center justify-center
            w-9 h-9
            rounded-full
            bg-blue-950
            border-2 border-blue-300
            shadow-lg
            cursor-grab
            active:cursor-grabbing
            focus:outline-none
            focus:ring-2
            focus:ring-blue-300
          "
          style={{
            left: `${thumbPercent}%`,
            transform: "translate(-50%, -50%)",
            transition: dragging ? "none" : "left 150ms ease-out",
          }}>
          <span className="text-white font-semibold">{rating}</span>
        </div>
      </div>

      {/* Min / Max labels */}
      <div className="flex justify-between mt-2 text-xs text-blue-900">
        <span>1</span>
        <span>10</span>
      </div>
    </div>
  );
}

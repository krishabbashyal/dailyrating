import React, { useCallback, useEffect, useRef, useState } from "react";

const EMOJIS = ["😞", "😔", "🙁", "😕", "😐", "🙂", "😊", "😄", "😁", "😆"];
const MIN = 1;
const MAX = 10;

interface EmojiSliderProps {
  value?: number;
  onChange?: (rating: number) => void;
}

export default function EmojiSlider({
  value,
  onChange,
}: EmojiSliderProps) {
  const [rawValue, setRawValue] = useState(value ?? 5);
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
    const ratio = Math.max(
      0,
      Math.min(1, (clientX - rect.left) / rect.width)
    );

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

  const percentage =
    ((Math.max(MIN, Math.min(MAX, rawValue)) - MIN) / (MAX - MIN)) * 100;

  return (
    <div className="w-full max-w-md px-6 select-none">
      {/* Header */}
      <div className="text-center mb-6">
        <p className="text-sm font-medium text-gray-500">
          How was your day?
        </p>
      </div>

      {/* Emoji */}
      <div className="flex flex-col items-center drop-shadow-2xl">
        <div
          className="text-9xl leading-none mb-3 drop-shadow-xl rounded-full"
          style={{

          }}
        >
          {EMOJIS[rating - 1]}
        </div>

        {/* Rating number */}
        <div className="flex items-baseline justify-center gap-1 mb-6 w-full">
          <span className="text-4xl font-bold text-brand-primary">
            {rating}
          </span>
          <span className=" text-gray-400">
            / 10
          </span>
        </div>
      </div>

      {/* Slider */}
      <div
        ref={trackRef}
        className="relative h-3 rounded-full bg-brand-secondary/50 cursor-pointer touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
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
          className="
            absolute top-1/2
            w-8 h-8
            flex items-center justify-center
            rounded-full
            bg-white
            border-[3px] border-brand-primary
            shadow-md
            cursor-grab
            active:cursor-grabbing
            focus:outline-none
            focus:ring-4
            focus:ring-brand-primary/20
          "
          style={{
            left: `${percentage}%`,
            transform: "translate(-50%, -50%)",
            transition: dragging ? "none" : "left 120ms ease-out",
          }}
        >
          <div className="w-2 h-2 rounded-full bg-brand-primary" />
        </div>
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-3 px-1">
        <span className="text-xs font-semibold text-gray-600">
          Terrible
        </span>
        <span className="text-xs font-semibold text-gray-600">
          Amazing
        </span>
      </div>
    </div>
  );
}
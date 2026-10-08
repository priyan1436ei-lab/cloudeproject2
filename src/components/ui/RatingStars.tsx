import React from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  maxStars?: number;
  size?: number;
  showValue?: boolean;
  onRate?: (rating: number) => void;
  interactive?: boolean;
}

export function RatingStars({
  rating,
  maxStars = 5,
  size = 14,
  showValue = false,
  onRate,
  interactive = false,
}: RatingStarsProps) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: maxStars }).map((_, i) => {
          const starValue = i + 1;
          const isFilled = starValue <= Math.round(rating);

          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onClick={() => onRate && onRate(starValue)}
              className={`${
                interactive
                  ? "cursor-pointer hover:scale-110 transition-transform p-0.5"
                  : "cursor-default"
              }`}
            >
              <Star
                style={{ width: size, height: size }}
                className={
                  isFilled
                    ? "fill-amber-400 text-amber-400"
                    : "fill-slate-100 text-slate-300 dark:fill-slate-800 dark:text-slate-700"
                }
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

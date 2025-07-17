import React, { useEffect } from "react";
import {
  useIntersectionObserver,
  useCountUp,
} from "../hooks/useIntersectionObserver";

const MetricCard = ({ stat, delay = 0 }) => {
  const [ref, isIntersecting] = useIntersectionObserver();
  const numericValue = parseFloat(stat.value.replace(/[^0-9.]/g, ""));
  const [count, startAnimation] = useCountUp(numericValue, 2000);

  useEffect(() => {
    if (isIntersecting) {
      const timer = setTimeout(() => {
        startAnimation();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isIntersecting, startAnimation, delay]);

  const formatDisplayValue = (value) => {
    if (stat.unit === "Cr+") {
      return `${value.toFixed(1)}`;
    }
    if (stat.value.includes("K")) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  return (
    <div
      ref={ref}
      className={`
        ripple-hover p-6 rounded-xl transition-all duration-500 transform
        ${isIntersecting ? "animate-in opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        bg-white dark:bg-dark-card
        border border-gray-200 dark:border-gray-700
        hover:shadow-xl dark:hover:shadow-2xl
        hover:shadow-blue-100 dark:hover:shadow-purple-900/20
      `}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-3xl">{stat.icon}</div>
        <div className="flex items-center text-sm font-semibold text-green-600 dark:text-green-400">
          <span className="mr-1">↗</span>
          {stat.growth}
        </div>
      </div>

      <div className="mb-2">
        <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          {stat.prefix}
          {formatDisplayValue(count)}
          {stat.unit}
        </div>
      </div>

      <div className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
        {stat.title}
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        {stat.description}
      </div>
    </div>
  );
};

export default MetricCard;

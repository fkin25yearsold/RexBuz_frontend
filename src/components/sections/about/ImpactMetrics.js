import React, { useEffect } from "react";
import {
  useIntersectionObserver,
  useCountUp,
} from "../../../hooks/useIntersectionObserver";
import { impactMetrics } from "../../../mocks/about";

const ImpactMetrics = () => {
  const [ref, isIntersecting] = useIntersectionObserver();

  return (
    <section ref={ref} className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className={`text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-700 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
          >
            Our Impact in Numbers
          </h2>
          <p
            className={`text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-all duration-700 delay-200 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
          >
            Creating meaningful change in India's creator economy
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {impactMetrics.map((metric, index) => (
            <ImpactCard
              key={metric.id}
              metric={metric}
              delay={index * 150}
              isVisible={isIntersecting}
            />
          ))}
        </div>

        {/* Quote Section */}
        <div
          className={`mt-20 text-center transition-all duration-700 delay-800 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
        >
          <blockquote className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            "70% of our creators come from non-metro cities"
          </blockquote>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We're proud to be empowering talent from every corner of India,
            giving equal opportunities to creators regardless of their location
          </p>
        </div>
      </div>
    </section>
  );
};

const ImpactCard = ({ metric, delay, isVisible }) => {
  const numericValue = parseFloat(metric.value.replace(/[^0-9.]/g, ""));
  const [count, startAnimation] = useCountUp(numericValue, 2000);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        startAnimation();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isVisible, startAnimation, delay]);

  const formatDisplayValue = (value) => {
    if (metric.unit === "Cr+") {
      return `${value.toFixed(1)}`;
    }
    if (metric.value.includes("K")) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return Math.floor(value).toString();
  };

  return (
    <div
      className={`bg-white dark:bg-dark-card p-8 rounded-2xl border border-gray-200 dark:border-gray-700 text-center hover:shadow-xl dark:hover:shadow-2xl transition-all duration-500 hover:scale-105 ${
        isVisible ? "animate-in opacity-100" : "opacity-0 translate-y-8"
      }`}
      style={{ animationDelay: `${delay + 400}ms` }}
    >
      <div className="text-4xl mb-4">{metric.icon}</div>
      <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
        {metric.prefix}
        {formatDisplayValue(count)}
        {metric.unit}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
        {metric.label}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        {metric.description}
      </p>
    </div>
  );
};

export default ImpactMetrics;

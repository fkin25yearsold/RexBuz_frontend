import React from "react";
import EarningsCalculator from "../EarningsCalculator";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";

const EarningsCalculatorSection = () => {
  const [ref, isIntersecting] = useIntersectionObserver();

  return (
    <section ref={ref} className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`transition-all duration-700 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
        >
          <EarningsCalculator />
        </div>
      </div>
    </section>
  );
};

export default EarningsCalculatorSection;

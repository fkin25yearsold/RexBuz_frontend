import React, { useState } from "react";
import { useIntersectionObserver } from "../../../hooks/useIntersectionObserver";
import { comparisonData } from "../../../mocks/pricing";

const ComparisonTable = () => {
  const [ref, isIntersecting] = useIntersectionObserver();
  const [hoveredCell, setHoveredCell] = useState(null);

  const getValueIcon = (value) => {
    switch (value) {
      case "✅":
        return <span className="text-green-500 text-lg">✅</span>;
      case "❌":
        return <span className="text-red-500 text-lg">❌</span>;
      case "🟡":
        return <span className="text-yellow-500 text-lg">🟡</span>;
      default:
        return value;
    }
  };

  const getTooltipText = (value) => {
    if (value === "🟡") {
      return "Partial support - hover for limitations";
    }
    return null;
  };

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className={`text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-700 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
          >
            Feature Comparison
          </h2>
          <p
            className={`text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-all duration-700 delay-200 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
          >
            See how Influbazzar compares to other platforms
          </p>
        </div>

        <div
          className={`bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-xl transition-all duration-700 delay-300 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
        >
          {/* Table Container with Horizontal Scroll */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              {/* Sticky Header */}
              <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700 min-w-[250px]">
                    Feature
                  </th>
                  {comparisonData.competitors.map((competitor, index) => (
                    <th
                      key={competitor}
                      className={`text-center p-4 font-semibold border-r border-gray-200 dark:border-gray-700 min-w-[100px] ${
                        index === 0
                          ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {competitor}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {comparisonData.features.map((feature, featureIndex) => (
                  <tr
                    key={feature.id}
                    className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 ${
                      isIntersecting
                        ? "animate-in opacity-100"
                        : "opacity-0 translate-x-8"
                    }`}
                    style={{ animationDelay: `${(featureIndex + 4) * 50}ms` }}
                  >
                    <td className="p-4 font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700">
                      {feature.name}
                    </td>
                    {feature.values.map((value, valueIndex) => (
                      <td
                        key={valueIndex}
                        className={`text-center p-4 border-r border-gray-200 dark:border-gray-700 relative cursor-pointer transition-all duration-200 ${
                          valueIndex === 0
                            ? "bg-indigo-50 dark:bg-indigo-900/20"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                        onMouseEnter={() =>
                          setHoveredCell(`${feature.id}-${valueIndex}`)
                        }
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        {getValueIcon(value)}

                        {/* Tooltip for partial support */}
                        {value === "🟡" &&
                          hoveredCell === `${feature.id}-${valueIndex}` && (
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-20">
                              <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                                {getTooltipText(value)}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
                          )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ✅ Full support • 🟡 Partial support • ❌ Not supported
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              Based on public features as of July 2025. Features subject to
              change.
            </p>
          </div>
        </div>

        {/* Scroll Hint */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16l-4-4m0 0l4-4m-4 4h18"
              />
            </svg>
            Scroll horizontally to see all platforms
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;

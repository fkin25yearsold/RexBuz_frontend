import React from "react";

const SolutionsMegaMenu = ({ isOpen, onClose }) => {
  const solutions = [
    {
      role: "creators",
      title: "For Creators",
      subtitle: "Tools for managing campaigns",
      icon: "🧭",
      features: [
        "Campaign Discovery",
        "Content Management",
        "Payment Tracking",
        "Performance Analytics",
      ],
    },
    {
      role: "brands",
      title: "For Brands",
      subtitle: "Tools for running campaigns",
      icon: "🎯",
      features: [
        "Creator Discovery",
        "Campaign Management",
        "ROI Analytics",
        "Brand Safety Tools",
      ],
    },
    {
      role: "agencies",
      title: "For Agencies",
      subtitle: "Tools for overseeing campaigns",
      icon: "🗂️",
      features: [
        "Multi-client Dashboard",
        "Team Collaboration",
        "Unified Reporting",
        "White-label Solutions",
      ],
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-screen max-w-4xl z-50">
      <div className="max-w-[1000px] mx-auto px-4">
        <div
          className={`
            bg-white dark:bg-gray-900
            rounded-lg shadow-xl
            border border-gray-200 dark:border-gray-700
            p-6
            transition-all duration-300 ease-in-out
            ${isOpen ? "scale-100 opacity-100 visible" : "scale-95 opacity-0 invisible"}
          `}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {solutions.map((solution) => (
              <div
                key={solution.role}
                className="group cursor-pointer p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                onClick={onClose}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-2xl">{solution.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {solution.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {solution.subtitle}
                    </p>
                  </div>
                </div>

                <ul className="space-y-2">
                  {solution.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      • {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <a
                    href="#"
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium group-hover:underline"
                  >
                    Learn more →
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
              Ready to get started?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium">
                Start Free Trial
              </button>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionsMegaMenu;

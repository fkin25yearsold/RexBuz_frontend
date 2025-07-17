import React from "react";
import { useIntersectionObserver } from "../../../hooks/useIntersectionObserver";

const ContactInfo = () => {
  const [ref, isIntersecting] = useIntersectionObserver();

  const contactMethods = [
    {
      id: 1,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "Email Support",
      description: "Our support team is here to help",
      contact: "support@influbazzar.com",
      action: "mailto:support@influbazzar.com",
    },
    {
      id: 2,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.570-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.786" />
        </svg>
      ),
      title: "WhatsApp Support",
      description: "Quick chat support available",
      contact: "+91-9000000000",
      action: "https://wa.me/919000000000",
    },
    {
      id: 3,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      title: "Office Address",
      description: "Visit us at our headquarters",
      contact: "No. 12, Influence Hub Street\nBengaluru, KA – 560001",
      action: "#",
    },
  ];

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 delay-300 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
    >
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Other Ways to Reach Us
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Choose the method that works best for you. We're committed to
            providing excellent support.
          </p>
        </div>

        <div className="space-y-6">
          {contactMethods.map((method, index) => (
            <div
              key={method.id}
              className={`bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer ${
                isIntersecting
                  ? "animate-in opacity-100"
                  : "opacity-0 translate-x-8"
              }`}
              style={{ animationDelay: `${(index + 4) * 150}ms` }}
              onClick={() => window.open(method.action, "_blank")}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white">
                  {method.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {method.description}
                  </p>
                  <div className="text-blue-600 dark:text-purple-400 font-medium whitespace-pre-line">
                    {method.contact}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div
          className={`bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-700 transition-all duration-700 delay-600 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
        >
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            💬 Quick Questions?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Check out our FAQ section or start a live chat for immediate
            assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
              View FAQ
            </button>
            <button className="px-4 py-2 border border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors font-medium text-sm">
              Start Live Chat
            </button>
          </div>
        </div>

        {/* Response Time */}
        <div
          className={`text-center transition-all duration-700 delay-800 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
        >
          <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            We typically respond within 2-4 hours
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;

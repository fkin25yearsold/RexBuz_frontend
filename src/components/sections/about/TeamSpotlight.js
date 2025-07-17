import React from "react";
import { useIntersectionObserver } from "../../../hooks/useIntersectionObserver";
import { teamMembers } from "../../../mocks/about";

const TeamSpotlight = () => {
  const [ref, isIntersecting] = useIntersectionObserver();

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className={`text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-700 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
          >
            Meet the Faces Behind Influbazzar
          </h2>
          <p
            className={`text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-all duration-700 delay-200 ${isIntersecting ? "animate-in opacity-100" : "opacity-0 translate-y-8"}`}
          >
            Passionate individuals working to revolutionize India's creator
            economy
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              className={`group bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-500 hover:scale-105 ${
                isIntersecting
                  ? "animate-in opacity-100"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ animationDelay: `${(index + 3) * 150}ms` }}
            >
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto mb-4 relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover ring-4 ring-gray-200 dark:ring-gray-600 group-hover:ring-indigo-400 dark:group-hover:ring-purple-400 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-indigo-600 dark:bg-purple-600 rounded-2xl opacity-0 group-hover:opacity-95 transition-all duration-300 flex items-center justify-center p-4 transform scale-95 group-hover:scale-100">
                  <div className="text-center text-white">
                    <h4 className="font-semibold mb-2">{member.role}</h4>
                    <p className="text-sm text-white/90 mb-4">{member.bio}</p>
                    <a
                      href={member.linkedin}
                      className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-indigo-600 dark:text-purple-400 font-medium mb-2">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {member.department}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSpotlight;

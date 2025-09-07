import React from "react";

/**
 * SkeletonLoader - Composant de chargement élégant avec effet shimmer
 *
 * @param {string} type - "card" | "list" | "table" | "circle" | "line"
 * @param {number} count - Nombre d’éléments skeleton à afficher
 * @param {number} lines - Nombre de lignes par skeleton (pour card/list)
 * @param {string} rounded - Style arrondi : "md", "lg", "xl", "full"
 */
export default function SkeletonLoader({
  type = "card",
  count = 3,
  lines = 3,
  rounded = "lg",
}) {
  const shimmer =
    "relative overflow-hidden bg-gray-200 dark:bg-gray-700 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent";

  const renderSkeleton = (index) => {
    switch (type) {
      case "circle":
        return (
          <div
            key={index}
            className={`${shimmer} w-16 h-16 rounded-full`}
          ></div>
        );

      case "line":
        return (
          <div
            key={index}
            className={`${shimmer} h-4 w-full rounded-${rounded}`}
          ></div>
        );

      case "list":
        return (
          <div
            key={index}
            className="flex flex-col space-y-2 p-4 border-b border-gray-200 dark:border-gray-700"
          >
            {[...Array(lines)].map((_, i) => (
              <div
                key={i}
                className={`${shimmer} h-4 w-${i === 0 ? "1/3" : "full"} rounded-${rounded}`}
              ></div>
            ))}
          </div>
        );

      case "table":
        return (
          <tr key={index} className="divide-x divide-gray-200 dark:divide-gray-700">
            {[...Array(lines)].map((_, i) => (
              <td key={i} className="p-3">
                <div className={`${shimmer} h-4 w-full rounded-${rounded}`}></div>
              </td>
            ))}
          </tr>
        );

      case "card":
      default:
        return (
          <div
            key={index}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-2"
          >
            <div className={`${shimmer} h-6 w-2/3 rounded-${rounded}`}></div>
            {[...Array(lines)].map((_, i) => (
              <div
                key={i}
                className={`${shimmer} h-4 w-${i === 0 ? "1/2" : "full"} rounded-${rounded}`}
              ></div>
            ))}
          </div>
        );
    }
  };

  return (
    <div>
      {type === "table" ? (
        <table className="w-full border border-gray-200 dark:border-gray-700">
          <tbody>{[...Array(count)].map((_, i) => renderSkeleton(i))}</tbody>
        </table>
      ) : (
        <div
          className={`grid gap-4 ${
            type === "card" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col"
          }`}
        >
          {[...Array(count)].map((_, i) => renderSkeleton(i))}
        </div>
      )}
    </div>
  );
}

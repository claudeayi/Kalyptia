import React from "react";

/**
 * SkeletonLoader - Composant de chargement élégant avec effet shimmer
 *
 * @param {string} type - "card" | "list" | "table" | "circle" | "line"
 * @param {number} count - Nombre d’éléments skeleton à afficher
 * @param {number} lines - Nombre de lignes par skeleton (pour card/list/table)
 * @param {string} rounded - Style arrondi : "none" | "sm" | "md" | "lg" | "xl" | "full"
 * @param {boolean} animate - Active/Désactive l’animation shimmer
 */
export default function SkeletonLoader({
  type = "card",
  count = 3,
  lines = 3,
  rounded = "lg",
  animate = true,
}) {
  const shimmerClass = animate ? "shimmer" : "bg-gray-200 dark:bg-gray-700";

  const renderSkeleton = (index) => {
    switch (type) {
      case "circle":
        return (
          <div key={index} className={`${shimmerClass} w-16 h-16 rounded-full`} />
        );

      case "line":
        return (
          <div
            key={index}
            className={`${shimmerClass} h-4 w-full rounded-${rounded}`}
          />
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
                className={`${shimmerClass} h-4 ${
                  i === 0 ? "w-1/3" : "w-full"
                } rounded-${rounded}`}
              />
            ))}
          </div>
        );

      case "table":
        return (
          <tr
            key={index}
            className="divide-x divide-gray-200 dark:divide-gray-700"
          >
            {[...Array(lines)].map((_, i) => (
              <td key={i} className="p-3">
                <div className={`${shimmerClass} h-4 w-full rounded-${rounded}`} />
              </td>
            ))}
          </tr>
        );

      case "card":
      default:
        return (
          <div
            key={index}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3 kalyptia-card-hover"
          >
            <div className={`${shimmerClass} h-6 w-2/3 rounded-${rounded}`} />
            {[...Array(lines)].map((_, i) => (
              <div
                key={i}
                className={`${shimmerClass} h-4 ${
                  i === 0 ? "w-1/2" : "w-full"
                } rounded-${rounded}`}
              />
            ))}
          </div>
        );
    }
  };

  return (
    <div
      role="status"
      aria-busy="true"
      className="w-full"
    >
      {type === "table" ? (
        <table className="w-full border border-gray-200 dark:border-gray-700">
          <tbody>{[...Array(count)].map((_, i) => renderSkeleton(i))}</tbody>
        </table>
      ) : (
        <div
          className={`gap-4 ${
            type === "card"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "flex flex-col"
          }`}
        >
          {[...Array(count)].map((_, i) => renderSkeleton(i))}
        </div>
      )}
    </div>
  );
}

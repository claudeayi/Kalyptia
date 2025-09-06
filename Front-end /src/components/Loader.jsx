export default function Loader({ text = "Chargement..." }) {
  return (
    <div
      className="flex items-center justify-center py-10"
      role="status"
      aria-busy="true"
    >
      <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      <span className="ml-3 text-gray-600 dark:text-gray-300">{text}</span>
    </div>
  );
}

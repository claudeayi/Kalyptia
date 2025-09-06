export default function Table({ columns, data }) {
  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg shadow">
      <table className="w-full text-sm text-left text-gray-700 dark:text-gray-200">
        <thead className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-2 font-semibold">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-3 text-center text-gray-500">
                Aucune donnée disponible
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={i}
                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-2">
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

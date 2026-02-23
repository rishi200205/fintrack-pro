/**
 * exportCsv.js
 * Converts transactions + categories into a downloadable CSV file.
 */

/**
 * @param {Array} transactions  - raw transaction objects from the store
 * @param {Array} categories    - categories array (for id→name lookup)
 */
export function exportTransactionsCsv(transactions, categories) {
  const catMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

  const headers = ['Date', 'Type', 'Category', 'Description', 'Amount'];

  const rows = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map((t) => [
      t.date,
      t.type.charAt(0).toUpperCase() + t.type.slice(1),
      catMap[t.categoryId] ?? t.categoryId,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      t.type === 'expense' ? `-${t.amount.toFixed(2)}` : t.amount.toFixed(2),
    ]);

  const csvContent = [headers, ...rows].map((r) => r.join(',')).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href     = url;
  link.download = `fintrack-transactions-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

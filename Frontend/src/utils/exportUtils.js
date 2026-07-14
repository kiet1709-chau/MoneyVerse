/**
 * Utility functions for exporting transaction data
 */

/**
 * Export transactions to CSV format
 * @param {Array} transactions - Array of transaction objects
 * @param {string} filename - Output filename
 */
export const exportToCSV = (transactions, filename = 'transactions.csv') => {
  if (!transactions || transactions.length === 0) {
    alert('Không có giao dịch để xuất');
    return;
  }

  // CSV headers
  const headers = ['Mã giao dịch', 'Tên giao dịch', 'Danh mục', 'Loại', 'Số tiền (₫)', 'Ngày', 'Trạng thái'];
  
  // CSV rows
  const rows = transactions.map(t => [
    t.id,
    t.name,
    t.category,
    t.type === 'income' ? 'Thu nhập' : 'Chi tiêu',
    t.amount,
    t.date,
    t.status || 'Thành công'
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.map(h => `"${h}"`).join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  // Add BOM for UTF-8 encoding to support Vietnamese characters
  const BOM = '\uFEFF';
  const csvWithBOM = BOM + csvContent;

  // Create blob and download
  const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export transactions to JSON format
 * @param {Array} transactions - Array of transaction objects
 * @param {string} filename - Output filename
 */
export const exportToJSON = (transactions, filename = 'transactions.json') => {
  if (!transactions || transactions.length === 0) {
    alert('Không có giao dịch để xuất');
    return;
  }

  const dataToExport = {
    exportDate: new Date().toLocaleString('vi-VN'),
    totalTransactions: transactions.length,
    transactions: transactions
  };

  const jsonString = JSON.stringify(dataToExport, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Generate summary statistics from transactions
 * @param {Array} transactions - Array of transaction objects
 * @returns {Object} Summary object
 */
export const generateSummary = (transactions) => {
  if (!transactions || transactions.length === 0) {
    return {
      totalIncome: 0,
      totalExpense: 0,
      netBalance: 0,
      transactionCount: 0,
      incomeCount: 0,
      expenseCount: 0,
      averageTransaction: 0
    };
  }

  const income = transactions.filter(t => t.type === 'income');
  const expense = transactions.filter(t => t.type === 'expense');

  const totalIncome = income.reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalExpense = expense.reduce((sum, t) => sum + (t.amount || 0), 0);

  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
    transactionCount: transactions.length,
    incomeCount: income.length,
    expenseCount: expense.length,
    averageTransaction: transactions.length > 0 
      ? (totalIncome + totalExpense) / transactions.length 
      : 0
  };
};

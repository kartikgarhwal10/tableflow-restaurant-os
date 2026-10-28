'use client';

import React, { useMemo } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useTableflow } from '@/lib/store/tableflow-store';
import { FileSpreadsheet } from 'lucide-react';

export default function AdminReportsPage() {
  const { orders, expenses } = useTableflow();

  // Financial aggregates
  const financial = useMemo(() => {
    const validOrders = orders.filter((o) => o.status !== 'cancelled');

    const grossSales = validOrders.reduce(
      (sum, o) => sum + o.subtotal + o.packagingCharge + o.deliveryFee,
      0
    );
    const discounts = validOrders.reduce((sum, o) => sum + o.discountAmount, 0);
    const netSales = Math.max(0, grossSales - discounts);
    const taxesCollected = validOrders.reduce((sum, o) => sum + o.cgst + o.sgst, 0);

    // Approximate Cost of Goods Sold (COGS) ~ 32% food cost benchmark
    const estimatedCOGS = Math.round(netSales * 0.32);

    const totalOperatingExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const operationalProfit = netSales - estimatedCOGS - totalOperatingExpenses;

    return {
      grossSales,
      discounts,
      netSales,
      taxesCollected,
      estimatedCOGS,
      totalOperatingExpenses,
      operationalProfit,
      orderCount: validOrders.length,
    };
  }, [orders, expenses]);

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Order Number', 'Date', 'Type', 'Table', 'Customer', 'Subtotal', 'Discount', 'Taxes', 'Grand Total', 'Status', 'Payment'];
    const rows = orders.map((o) => [
      o.orderNumber,
      o.createdAt.slice(0, 10),
      o.type,
      o.tableNumber || 'N/A',
      `"${o.customerName}"`,
      o.subtotal.toFixed(2),
      o.discountAmount.toFixed(2),
      (o.cgst + o.sgst).toFixed(2),
      o.total.toFixed(2),
      o.status,
      o.paymentStatus,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TableFlow_Orders_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Reports
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Operational summary, sales breakdown, and financial performance
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-3.5 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium rounded flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <FileSpreadsheet className="w-4 h-4 text-gray-300" />
          Export Orders CSV
        </button>
      </div>

      {/* P&L Statement Card */}
      <div className="bg-white border border-gray-200 p-6 sm:p-8 rounded mb-8 space-y-6">
        <div className="flex justify-between items-baseline border-b border-gray-200 pb-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Profit & Loss Summary
          </h2>
          <span className="text-xs text-gray-500">
            Currency: INR (₹)
          </span>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Gross Sales</span>
            <span className="font-medium text-gray-900">₹{financial.grossSales.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex justify-between text-green-700">
            <span>Discounts & Promotions</span>
            <span>-₹{financial.discounts.toLocaleString('en-IN')}</span>
          </div>

          <div className="pt-2 border-t border-gray-100 flex justify-between font-semibold text-gray-900">
            <span>Net Sales</span>
            <span className="text-[#702B2B]">₹{financial.netSales.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex justify-between text-gray-600 pt-2">
            <span>Estimated Cost of Goods Sold (COGS - 32%)</span>
            <span className="text-gray-900">-₹{financial.estimatedCOGS.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex justify-between text-gray-600">
            <span>Operating Expenses (Staff, Utilities, Supplies)</span>
            <span className="text-gray-900">-₹{financial.totalOperatingExpenses.toLocaleString('en-IN')}</span>
          </div>

          <div className="pt-3 border-t border-gray-200 flex justify-between font-semibold text-base text-gray-900">
            <span>Operating Margin</span>
            <span className={financial.operationalProfit >= 0 ? 'text-green-700 font-bold' : 'text-red-700 font-bold'}>
              ₹{financial.operationalProfit.toLocaleString('en-IN')}
            </span>
          </div>

          <p className="text-xs text-gray-500 pt-2">
            * Generated from completed orders and active expense ledgers.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}

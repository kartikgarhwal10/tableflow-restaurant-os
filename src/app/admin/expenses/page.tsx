'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useTableflow } from '@/lib/store/tableflow-store';
import { Expense } from '@/types';
import { Plus, X } from 'lucide-react';

export default function AdminExpensesPage() {
  const { expenses, addExpense } = useTableflow();

  const [showAddModal, setShowAddModal] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState<Expense['category']>('ingredients');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [receiptNumber, setReceiptNumber] = useState('');

  const totalExpenseAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || amount <= 0) return;

    addExpense({
      date: new Date().toISOString().slice(0, 10),
      category,
      description: description.trim(),
      amount,
      paymentMethod,
      status: 'paid',
      receiptNumber: receiptNumber.trim() || `EXP-${Date.now().toString().slice(-5)}`,
    });

    setShowAddModal(false);
    setDescription('');
    setAmount(0);
    setReceiptNumber('');
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Expenses
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Operational expenses, vendor payments, and cost tracking
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 bg-[#702B2B] hover:bg-[#592222] text-white text-xs font-medium rounded flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Expense
        </button>
      </div>

      <div className="bg-white border border-gray-200 p-5 rounded mb-6 flex justify-between items-center text-xs">
        <div>
          <span className="text-gray-500 block">Total Recorded Expenses:</span>
          <span className="text-2xl font-semibold text-gray-900 mt-1 block">
            ₹{totalExpenseAmount.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="text-gray-500">
          {expenses.length} entries recorded
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
            <tr>
              <th className="p-3.5">Date</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Description</th>
              <th className="p-3.5">Amount</th>
              <th className="p-3.5">Method & Receipt</th>
              <th className="p-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {expenses.map((exp) => (
              <tr key={exp.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-3.5 text-gray-600">{exp.date}</td>
                <td className="p-3.5 capitalize font-medium text-gray-800">
                  {exp.category}
                </td>
                <td className="p-3.5 font-medium text-gray-900">{exp.description}</td>
                <td className="p-3.5 font-semibold text-gray-900">
                  ₹{exp.amount.toLocaleString('en-IN')}
                </td>
                <td className="p-3.5 text-gray-600">
                  {exp.paymentMethod} {exp.receiptNumber && `(${exp.receiptNumber})`}
                </td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium capitalize bg-green-50 text-green-700 border border-green-200">
                    {exp.status}
                  </span>
                </td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-sm text-gray-500">
                  No expenses recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded shadow-lg border border-gray-200 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <h2 className="text-base font-semibold text-gray-900">Record Expense</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-gray-700 block mb-1">Description *</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Cooking gas cylinders, fresh produce..."
                  className="w-full p-2 bg-white border border-gray-300 rounded text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-gray-700 block mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2 bg-white border border-gray-300 rounded text-gray-900"
                  >
                    <option value="ingredients">Ingredients</option>
                    <option value="utilities">Utilities & Fuel</option>
                    <option value="payroll">Payroll</option>
                    <option value="marketing">Marketing</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="supplies">Supplies</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-gray-700 block mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-gray-300 rounded text-gray-900 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-gray-700 block mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full p-2 bg-white border border-gray-300 rounded text-gray-900"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Corporate Card">Card</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-gray-700 block mb-1">Receipt / Invoice No.</label>
                  <input
                    type="text"
                    value={receiptNumber}
                    onChange={(e) => setReceiptNumber(e.target.value)}
                    placeholder="e.g. INV-9841"
                    className="w-full p-2 bg-white border border-gray-300 rounded text-gray-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 text-xs text-gray-700 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#702B2B] hover:bg-[#592222] text-white text-xs font-medium rounded transition-colors"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

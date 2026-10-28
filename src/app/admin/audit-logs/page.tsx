'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useTableflow } from '@/lib/store/tableflow-store';
import { Search } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const { auditLogs } = useTableflow();
  const [search, setSearch] = useState('');

  const filtered = auditLogs.filter((log) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.actor.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q)
    );
  });

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Audit Logs
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Review system events, staff actions, and operational changes.
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-4 rounded-md mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action, actor, or details..."
            className="w-full pl-9 pr-3 py-1.5 text-sm bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:border-gray-500"
          />
        </div>
        <div className="text-sm text-gray-600">
          Total logs: <strong className="font-semibold text-gray-900">{auditLogs.length}</strong>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-md overflow-x-auto shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 text-xs font-semibold">
            <tr>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">Actor</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Entity</th>
              <th className="px-4 py-3">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-xs text-gray-500 font-mono whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleDateString('en-IN')}{' '}
                  {new Date(log.timestamp).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium text-gray-900 block">{log.actor}</span>
                  <span className="text-xs text-gray-500 uppercase">
                    {log.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                    {log.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 capitalize">
                  {log.entityType} ({log.entityId.slice(-6)})
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {log.details}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-sm text-gray-500">
                  No audit logs found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

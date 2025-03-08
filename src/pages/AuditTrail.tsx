import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Download, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface AuditLog {
  id: string;
  action: string;
  description: string;
  category: string;
  performed_by: string;
  created_at: string;
}

export default function AuditTrail() {
  const { supabase } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const logsPerPage = 10;

  useEffect(() => {
    fetchLogs();
  }, [currentPage, searchTerm]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('audit_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * logsPerPage, currentPage * logsPerPage - 1);

      if (searchTerm) {
        query = query.or(`description.ilike.%${searchTerm}%,action.ilike.%${searchTerm}%`);
      }

      const { data, count, error } = await query;

      if (error) throw error;

      setLogs(data || []);
      setTotalPages(Math.ceil((count || 0) / logsPerPage));
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const csv = [
        ['Time', 'Action', 'Description', 'Category', 'Performed By'],
        ...(data || []).map(log => [
          new Date(log.created_at).toLocaleString(),
          log.action,
          log.description,
          log.category,
          log.performed_by
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading logs:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Audit Trail</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#1a365d] rounded-lg text-white placeholder-gray-400 w-64 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
            />
          </div>
          <button
            onClick={downloadLogs}
            className="flex items-center gap-2 bg-[#3b82f6] text-white px-4 py-2 rounded-lg hover:bg-[#2563eb] transition-colors"
          >
            <Download className="h-5 w-5" />
            Download CSV
          </button>
        </div>
      </div>

      <div className="bg-[#0f2744] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#1a365d]">
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Time</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Action</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Description</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Performed By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2d4a77]">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                  No audit logs found
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#1a365d] transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-white">{log.action}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{log.description}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{log.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{log.performed_by}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-400">
          Showing {((currentPage - 1) * logsPerPage) + 1} to {Math.min(currentPage * logsPerPage, (logs.length || 0))} of {totalPages * logsPerPage} entries
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-[#1a365d] text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-[#1a365d] text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
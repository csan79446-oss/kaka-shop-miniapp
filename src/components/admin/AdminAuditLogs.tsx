import React, { useState } from 'react';
import {
  History,
  Search,
  Download,
  Trash2,
  Shield,
  Filter,
  Package,
  ShoppingCart,
  Users,
  KeyRound,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AuditAction } from '../../types';

export const AdminAuditLogs: React.FC = () => {
  const { auditLogs, clearAuditLogs, currentAdmin, language } = useApp();
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');

  const isSuperAdmin = currentAdmin?.role === 'SUPER_ADMIN';

  const filteredLogs = auditLogs.filter((log) => {
    const matchFilter = filterAction === 'all' || log.action === filterAction;
    const matchSearch =
      log.adminName.toLowerCase().includes(search.toLowerCase()) ||
      log.detailsKh.toLowerCase().includes(search.toLowerCase()) ||
      log.detailsEn.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const getActionIcon = (action: AuditAction) => {
    if (action.startsWith('PRODUCT')) return <Package className="w-3.5 h-3.5 text-blue-500" />;
    if (action.startsWith('ORDER')) return <ShoppingCart className="w-3.5 h-3.5 text-emerald-500" />;
    if (action.startsWith('STAFF')) return <Users className="w-3.5 h-3.5 text-purple-500" />;
    return <KeyRound className="w-3.5 h-3.5 text-amber-500" />;
  };

  const getActionBadgeClass = (action: AuditAction) => {
    if (action.includes('CREATE')) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300';
    if (action.includes('UPDATE')) return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300';
    if (action.includes('DELETE')) return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300';
    return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
  };

  const exportLogsAsJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `kaka_shop_audit_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#17212b] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-[#2481cc]" />
            <span>
              {language === 'km'
                ? 'ប្រវត្តិសកម្មភាពរបស់អ្នកគ្រប់គ្រង (Audit Trail)'
                : 'Admin Activity & Security Audit Logs'}
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            {language === 'km'
              ? 'តាមដានរាល់សកម្មភាពបន្ថែម កែប្រែ លុប និងចូលប្រើប្រាស់ប្រព័ន្ធ'
              : 'Immutable record of inventory changes, orders, and authentication events'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportLogsAsJson}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{language === 'km' ? 'ទាញយក (Export JSON)' : 'Export'}</span>
          </button>

          {isSuperAdmin && auditLogs.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm(language === 'km' ? 'តើអ្នកប្រាកដជាចង់សម្អាតកំណត់ត្រាទាំងអស់?' : 'Clear all audit logs?')) {
                  clearAuditLogs();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-xs font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{language === 'km' ? 'សម្អាត' : 'Clear'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              language === 'km'
                ? 'ស្វែងរកតាមឈ្មោះអ្នកគ្រប់គ្រង ឬពិពណ៌នាសកម្មភាព...'
                : 'Search by admin name or action details...'
            }
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#17212b] border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#2481cc]"
          />
        </div>

        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="py-2 px-3 bg-white dark:bg-[#17212b] border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm focus:outline-none"
        >
          <option value="all">{language === 'km' ? 'គ្រប់សកម្មភាព (All Actions)' : 'All Actions'}</option>
          <option value="PRODUCT_CREATE">Product Create</option>
          <option value="PRODUCT_UPDATE">Product Update</option>
          <option value="PRODUCT_DELETE">Product Delete</option>
          <option value="ORDER_STATUS_UPDATE">Order Status</option>
          <option value="STAFF_CREATE">Staff Create</option>
          <option value="ADMIN_LOGIN">Admin Login</option>
        </select>
      </div>

      {/* Audit Log Timeline Table */}
      <div className="bg-white dark:bg-[#17212b] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">{language === 'km' ? 'កាលបរិច្ឆេទ & ម៉ោង' : 'Timestamp'}</th>
                <th className="py-3 px-3">{language === 'km' ? 'អ្នកគ្រប់គ្រង' : 'Admin & Role'}</th>
                <th className="py-3 px-3">{language === 'km' ? 'ប្រភេទសកម្មភាព' : 'Action'}</th>
                <th className="py-3 px-4">{language === 'km' ? 'ព័ត៌មានលម្អិត' : 'Event Details'}</th>
                <th className="py-3 px-3 text-right">IP / Device</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                    {new Date(log.timestamp).toLocaleString([], {
                      dateStyle: 'short',
                      timeStyle: 'medium',
                    })}
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      {log.adminName}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {log.role}
                    </div>
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${getActionBadgeClass(
                        log.action
                      )}`}
                    >
                      {getActionIcon(log.action)}
                      <span>{log.action}</span>
                    </span>
                  </td>

                  <td className="py-3 px-4 font-sans text-slate-700 dark:text-slate-300">
                    {language === 'km' ? log.detailsKh : log.detailsEn}
                  </td>

                  <td className="py-3 px-3 text-right text-slate-400 whitespace-nowrap">
                    {log.ip || '127.0.0.1'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

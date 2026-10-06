import React from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  ArrowUpRight,
  Package,
  Sparkles,
  Store,
  Percent,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OrderStatus } from '../../types';

export const AdminAnalyticsDashboard: React.FC = () => {
  const {
    orders,
    products,
    language,
    formatPrice,
    updateOrderStatus,
    currentAdmin,
    selectedAdminVendorId,
    vendors,
    getVendorById,
  } = useApp();

  const adminVendorId = currentAdmin?.vendorId || selectedAdminVendorId;
  const currentVendor =
    adminVendorId && adminVendorId !== 'all' ? getVendorById(adminVendorId) : null;

  // Filter orders and products by currently selected vendor scope
  const scopedOrders = orders.filter((o) => {
    if (!adminVendorId || adminVendorId === 'all') return true;
    return o.vendorId === adminVendorId;
  });

  const scopedProducts = products.filter((p) => {
    if (!adminVendorId || adminVendorId === 'all') return true;
    return p.vendorId === adminVendorId;
  });

  // Metrics
  const totalRevenue = scopedOrders.reduce((sum, o) => {
    return o.status !== 'cancelled' ? sum + o.totalAmount : sum;
  }, 0);

  const completedOrders = scopedOrders.filter((o) => o.status === 'completed').length;
  const pendingOrders = scopedOrders.filter((o) => o.status === 'pending').length;
  const deliveringOrders = scopedOrders.filter((o) => o.status === 'delivering').length;
  const totalOrdersCount = scopedOrders.length;

  const avgOrderValue =
    totalOrdersCount > 0 ? totalRevenue / (totalOrdersCount || 1) : 0;

  // Commission calculations (Marketplace share 5%, Vendor share 95%)
  const commissionRate = currentVendor?.commissionRate ?? 5;
  const platformCommission = (totalRevenue * commissionRate) / 100;
  const vendorNetPayout = totalRevenue - platformCommission;

  // Best selling products calculation
  const productSalesMap = new Map<
    string,
    { product: (typeof products)[0]; soldCount: number; revenue: number }
  >();

  scopedOrders.forEach((order) => {
    if (order.status !== 'cancelled') {
      order.items.forEach((item) => {
        const existing = productSalesMap.get(item.product.id) || {
          product: item.product,
          soldCount: 0,
          revenue: 0,
        };
        existing.soldCount += item.quantity;
        existing.revenue += item.quantity * item.product.price;
        productSalesMap.set(item.product.id, existing);
      });
    }
  });

  const topProducts = Array.from(productSalesMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 4);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Real-time Indicator banner */}
      <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
            {language === 'km'
              ? 'ទិន្នន័យស្ថិតិលក់ជាក់ស្តែង Real-time Live Sync'
              : 'Live Real-time Sales Analytics Active'}
          </span>
        </div>
        <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-mono">
          Updated: {new Date().toLocaleTimeString()}
        </span>
      </div>

      {/* Scope Status & Commission Breakdown */}
      <div className="p-3.5 bg-white dark:bg-[#17212b] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {currentVendor
                  ? language === 'km'
                    ? `ស្ថិតិលក់របស់ហាង៖ ${currentVendor.nameKh}`
                    : `Store Analytics: ${currentVendor.nameEn}`
                  : language === 'km'
                  ? '👑 ស្ថិតិផ្សារអនឡាញទាំងមូល (All Marketplace Stores)'
                  : '👑 Global Marketplace Overview (All Stores)'}
              </span>
              {currentVendor?.isVerified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              {currentVendor
                ? language === 'km'
                  ? `ភាគរយផ្សារកាត់៖ ${commissionRate}% · ចំណូលសុទ្ធហាងទទួលបាន៖ ${formatPrice(vendorNetPayout)}`
                  : `Platform Fee: ${commissionRate}% · Vendor Net Payout: ${formatPrice(vendorNetPayout)}`
                : language === 'km'
                ? `សរុប ${vendors.length} ហាងសកម្មក្នុងផ្សារ · ចំណូលកម្រៃជើងសារផ្សារសរុប (5%): ${formatPrice((totalRevenue * 5) / 100)}`
                : `Total ${vendors.length} active vendors · Platform Commission Earned (5%): ${formatPrice((totalRevenue * 5) / 100)}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono self-end sm:self-auto bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-slate-500">{language === 'km' ? 'កម្រៃផ្សារ (5%):' : 'Platform Cut:'}</span>
          <span className="font-bold text-purple-600 dark:text-purple-400">
            {formatPrice(platformCommission)}
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Revenue */}
        <div className="p-4 bg-white dark:bg-[#17212b] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">
              {language === 'km' ? 'ចំណូលលក់សរុប' : 'Total Revenue'}
            </span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
            {formatPrice(totalRevenue)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+24.8% vs last week</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-4 bg-white dark:bg-[#17212b] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">
              {language === 'km' ? 'ការកុម្ម៉ង់សរុប' : 'Total Orders'}
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
            {totalOrdersCount}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
            <span>{completedOrders} {language === 'km' ? 'បញ្ចប់រួច' : 'completed'}</span>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="p-4 bg-white dark:bg-[#17212b] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">
              {language === 'km' ? 'រង់ចាំបញ្ជាក់' : 'Pending Review'}
            </span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
            {pendingOrders}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            <span>{deliveringOrders} {language === 'km' ? 'កំពុងដឹកជញ្ជូន' : 'delivering'}</span>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="p-4 bg-white dark:bg-[#17212b] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">
              {language === 'km' ? 'មធ្យមភាគ/ការកុម្ម៉ង់' : 'Avg Order Value'}
            </span>
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
            {formatPrice(avgOrderValue)}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            <span>High conversion rate</span>
          </div>
        </div>
      </div>

      {/* Two Columns: Best Sellers & Recent Order Status Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Selling Products */}
        <div className="p-4 bg-white dark:bg-[#17212b] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{language === 'km' ? 'ទំនិញលក់ដាច់បំផុត' : 'Top Selling Products'}</span>
            </h4>
            <span className="text-[10px] text-slate-400 uppercase font-mono">By Revenue</span>
          </div>

          <div className="space-y-2.5">
            {topProducts.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                {language === 'km' ? 'មិនទាន់មានទិន្នន័យលក់ទេ' : 'No sales records yet'}
              </p>
            ) : (
              topProducts.map((item, idx) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <img
                      src={item.product.image}
                      alt={item.product.nameKh}
                      className="w-10 h-10 object-cover rounded-lg shrink-0 border"
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                        {language === 'km' ? item.product.nameKh : item.product.nameEn}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {item.soldCount} {language === 'km' ? 'គ្រឿងបានលក់' : 'units sold'}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-bold text-xs text-[#2481cc] font-mono">
                      {formatPrice(item.revenue)}
                    </div>
                    <div className="text-[10px] text-emerald-600 font-medium">
                      Stock: {item.product.stock}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live Orders Pipeline with Instant Status Updater */}
        <div className="p-4 bg-white dark:bg-[#17212b] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Package className="w-4 h-4 text-[#2481cc]" />
              <span>{language === 'km' ? 'ការកុម្ម៉ង់ចុងក្រោយ' : 'Recent Live Orders'}</span>
            </h4>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono">
              {orders.length} orders
            </span>
          </div>

          <div className="space-y-2.5 max-h-[320px] overflow-y-auto">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-xs flex items-center justify-between gap-2"
              >
                <div>
                  <div className="font-mono font-bold text-slate-900 dark:text-white">
                    #{order.orderNumber}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {order.customerName} ({order.customerPhone})
                  </div>
                  <div className="text-[10px] text-[#2481cc] font-bold font-mono">
                    {formatPrice(order.totalAmount)}
                  </div>
                </div>

                {/* Quick Status Select */}
                <div className="shrink-0 text-right">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order.id, e.target.value as OrderStatus)
                    }
                    className="text-[11px] font-semibold py-1 px-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-[#2481cc]"
                  >
                    <option value="pending">⏳ រង់ចាំ (Pending)</option>
                    <option value="confirmed">✓ បានបញ្ជាក់ (Confirmed)</option>
                    <option value="processing">📦 កំពុងរៀបចំ (Processing)</option>
                    <option value="delivering">🚚 កំពុងដឹក (Delivering)</option>
                    <option value="completed">🎉 បញ្ចប់ (Completed)</option>
                    <option value="cancelled">✕ បោះបង់ (Cancelled)</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

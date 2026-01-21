'use client';

import { useState, useMemo, CSSProperties } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import type { DaybreakAnalytics } from '@/hooks/use-daybreak-analytics';
import { COLORS, RADIUS, SPACING, formatDate, formatCurrency } from '@/lib/constants';
import { glassCardStyle, iconContainerStyle, sectionHeaderStyle, sectionTitleStyle, GRADIENTS } from './shared-styles';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DaybreakChartProps {
  data: DaybreakAnalytics | null;
  loading: boolean;
  onDateRangeChange?: (startDate: string, endDate: string) => void;
}

// Premium Styles
const styles = {
  filterRow: {
    display: 'flex',
    gap: `${SPACING.lg}px`,
    marginBottom: `${SPACING.xl}px`,
    flexWrap: 'wrap',
    alignItems: 'flex-end',
  } as CSSProperties,
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  } as CSSProperties,
  label: {
    fontSize: '12px',
    color: COLORS.textMuted,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  } as CSSProperties,
  input: {
    padding: '10px 14px',
    borderRadius: RADIUS.md,
    border: `1px solid rgba(255, 255, 255, 0.1)`,
    fontSize: '14px',
    fontFamily: 'inherit',
    background: 'rgba(255, 255, 255, 0.05)',
    color: COLORS.textPrimary,
    fontWeight: 500,
    transition: 'all 0.2s ease',
  } as CSSProperties,
  chartWrapper: {
    height: '420px',
    position: 'relative',
    zIndex: 1,
  } as CSSProperties,
  emptyState: {
    height: '380px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: COLORS.textMuted,
    fontSize: '14px',
    fontWeight: 500,
    background: 'rgba(0, 0, 0, 0.02)',
    borderRadius: RADIUS.md,
  } as CSSProperties,
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: `${SPACING.lg}px`,
    marginBottom: `${SPACING.xl}px`,
  } as CSSProperties,
  summaryCard: (color: string): CSSProperties => ({
    padding: `${SPACING.lg}px`,
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderRadius: RADIUS.md,
    borderLeft: `4px solid ${color}`,
    border: `1px solid rgba(255, 255, 255, 0.1)`,
    borderLeftWidth: '4px',
    borderLeftColor: color,
    transition: 'transform 0.2s ease',
  }),
  summaryValue: {
    fontSize: '20px',
    fontWeight: 800,
    color: COLORS.textPrimary,
    lineHeight: 1,
    margin: 0,
  } as CSSProperties,
  summaryLabel: {
    fontSize: '11px',
    color: COLORS.textMuted,
    marginTop: '6px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  } as CSSProperties,
  chartTypeToggle: {
    display: 'flex',
    gap: '8px',
    marginLeft: 'auto',
  } as CSSProperties,
  chartTypeBtn: (isActive: boolean): CSSProperties => ({
    padding: '8px 16px',
    fontSize: '13px',
    borderRadius: RADIUS.md,
    border: `1px solid ${isActive ? COLORS.primary : 'rgba(255, 255, 255, 0.1)'}`,
    background: isActive ? `${COLORS.primary}20` : 'rgba(255, 255, 255, 0.05)',
    color: isActive ? COLORS.primary : COLORS.textSecondary,
    cursor: 'pointer',
    fontWeight: 700,
    transition: 'all 0.2s ease',
  }),
};

export function DaybreakChart({ data, loading, onDateRangeChange }: DaybreakChartProps) {
  const [chartType, setChartType] = useState<'revenue' | 'orders'>('revenue');
  const [dateRange, setDateRange] = useState(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return {
      start: thirtyDaysAgo.toISOString().split('T')[0],
      end: today.toISOString().split('T')[0],
    };
  });

  // Calculate summary totals
  const summary = useMemo(() => {
    if (!data?.data?.length) return null;
    return data.data.reduce(
      (acc, point) => ({
        totalRevenue: acc.totalRevenue + (point.revenue || 0),
        totalOrders: acc.totalOrders + (point.orders || 0),
        inVideoRevenue: acc.inVideoRevenue + (point.inVideoRevenue || 0),
        postVideoRevenue: acc.postVideoRevenue + (point.postVideoRevenue || 0),
        inVideoOrders: acc.inVideoOrders + (point.inVideoOrders || 0),
        postVideoOrders: acc.postVideoOrders + (point.postVideoOrders || 0),
      }),
      { totalRevenue: 0, totalOrders: 0, inVideoRevenue: 0, postVideoRevenue: 0, inVideoOrders: 0, postVideoOrders: 0 }
    );
  }, [data]);

  // Chart.js data configuration
  const chartData = useMemo(() => {
    if (!data?.data?.length) return null;

    const labels = data.data.map((point) => formatDate(point.date));
    const inVideoData = data.data.map((point) =>
      chartType === 'revenue' ? point.inVideoRevenue || 0 : point.inVideoOrders || 0
    );
    const postVideoData = data.data.map((point) =>
      chartType === 'revenue' ? point.postVideoRevenue || 0 : point.postVideoOrders || 0
    );

    const barColors = chartType === 'revenue'
      ? { inVideo: '#f59e0b', postVideo: '#ec4899' }  // Orange, Pink
      : { inVideo: '#8b5cf6', postVideo: '#06b6d4' };  // Purple, Cyan

    return {
      labels,
      datasets: [
        {
          label: 'In-Video',
          data: inVideoData,
          backgroundColor: barColors.inVideo,
          borderColor: barColors.inVideo,
          borderWidth: 1,
          borderRadius: 6,
          barThickness: 24,
        },
        {
          label: 'Post-Video',
          data: postVideoData,
          backgroundColor: barColors.postVideo,
          borderColor: barColors.postVideo,
          borderWidth: 1,
          borderRadius: 6,
          barThickness: 24,
        },
      ],
    };
  }, [data, chartType]);

  const chartOptions: ChartOptions<'bar'> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: COLORS.textSecondary,
          font: { size: 13, weight: 600 as const },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'rectRounded' as const,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y ?? 0;
            const formatted = chartType === 'revenue' ? formatCurrency(value) : value.toString();
            return `${label}: ${formatted}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: COLORS.textMuted,
          font: { size: 11 },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: COLORS.textMuted,
          font: { size: 11 },
          callback: (value) => {
            return chartType === 'revenue' ? formatCurrency(Number(value)) : value.toString();
          },
        },
      },
    },
  }), [chartType]);

  const handleDateChange = (field: 'start' | 'end', value: string) => {
    const newRange = { ...dateRange, [field]: value };
    setDateRange(newRange);
    onDateRangeChange?.(newRange.start, newRange.end);
  };

  const hasData = !!chartData;

  return (
    <div style={glassCardStyle}>
      {/* Header with icon and toggle */}
      <div style={sectionHeaderStyle}>
        <div style={iconContainerStyle(GRADIENTS.orange)}>📈</div>
        <h3 style={sectionTitleStyle}>Phân tích doanh thu theo ngày</h3>

        {/* Chart type toggle */}
        <div style={styles.chartTypeToggle}>
          <button
            type="button"
            onClick={() => setChartType('revenue')}
            style={styles.chartTypeBtn(chartType === 'revenue')}
          >
            💰 Doanh thu
          </button>
          <button
            type="button"
            onClick={() => setChartType('orders')}
            style={styles.chartTypeBtn(chartType === 'orders')}
          >
            📦 Đơn hàng
          </button>
        </div>
      </div>

      {/* Premium date filters */}
      <div style={styles.filterRow}>
        <div style={styles.inputGroup}>
          <label htmlFor="start-date" style={styles.label}>Từ ngày</label>
          <input
            id="start-date"
            type="date"
            value={dateRange.start}
            onChange={(e) => handleDateChange('start', e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="end-date" style={styles.label}>Đến ngày</label>
          <input
            id="end-date"
            type="date"
            value={dateRange.end}
            onChange={(e) => handleDateChange('end', e.target.value)}
            style={styles.input}
          />
        </div>
      </div>

      {/* Premium summary cards */}
      {summary && !loading && (
        <div style={styles.summaryGrid}>
          <div style={styles.summaryCard('#10b981')}>
            <p style={styles.summaryValue}>{formatCurrency(summary.totalRevenue)}</p>
            <p style={styles.summaryLabel}>Tổng doanh thu</p>
          </div>
          <div style={styles.summaryCard('#3b82f6')}>
            <p style={styles.summaryValue}>{summary.totalOrders}</p>
            <p style={styles.summaryLabel}>Tổng đơn hàng</p>
          </div>
          <div style={styles.summaryCard('#f59e0b')}>
            <p style={styles.summaryValue}>{formatCurrency(summary.inVideoRevenue)}</p>
            <p style={styles.summaryLabel}>In-Video Revenue</p>
          </div>
          <div style={styles.summaryCard('#ec4899')}>
            <p style={styles.summaryValue}>{formatCurrency(summary.postVideoRevenue)}</p>
            <p style={styles.summaryLabel}>Post-Video Revenue</p>
          </div>
        </div>
      )}

      {/* Chart.js Bar Chart */}
      {loading ? (
        <div style={styles.emptyState}>Đang tải dữ liệu...</div>
      ) : hasData && chartData ? (
        <div style={styles.chartWrapper}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      ) : (
        <div style={styles.emptyState}>Không có dữ liệu trong khoảng thời gian này</div>
      )}
    </div>
  );
}

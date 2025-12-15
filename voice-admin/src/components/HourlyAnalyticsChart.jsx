import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Chart from 'react-apexcharts';
import { getHourlyAnalytics } from '../services/api';

export default function HourlyAnalyticsChart() {
  const [showDuration, setShowDuration] = useState(false);

  const { data: response, isLoading } = useQuery({
    queryKey: ['hourlyAnalytics'],
    queryFn: getHourlyAnalytics,
  });

  const data = response?.data || [];
  const hours = data.map(item => `${item.hour}:00`);
  const calls = data.map(item => item.call_count);
  const avgDuration = data.map(item => item.avg_duration);

  const chartOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '60%',
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: hours,
      labels: {
        style: { colors: '#6c757d', fontSize: '11px' },
      },
    },
    yaxis: [
      {
        title: { text: 'Calls', style: { color: '#6c757d' } },
        labels: { style: { colors: '#6c757d' } },
      },
      ...(showDuration
        ? [
            {
              opposite: true,
              title: { text: 'Avg Duration (min)', style: { color: '#6c757d' } },
              labels: { style: { colors: '#6c757d' } },
            },
          ]
        : []),
    ],
    colors: ['#1a2942', '#7cb342'],
    legend: {
      position: 'top',
      horizontalAlign: 'left',
    },
    grid: {
      borderColor: '#e9ecef',
      strokeDashArray: 4,
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
  };

  const series = [
    { name: 'Calls', type: 'bar', data: calls },
    ...(showDuration ? [{ name: 'Avg Duration (min)', type: 'line', data: avgDuration }] : []),
  ];

  return (
    <div className="card h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title mb-0">Hourly Calls</h5>
          <button
            className={`btn btn-sm ${showDuration ? 'btn-dark' : 'btn-outline-dark'}`}
            onClick={() => setShowDuration(!showDuration)}
          >
            Avg Duration
          </button>
        </div>
        <div className="d-flex gap-3 mb-3">
          <small className="d-flex align-items-center gap-1">
            <span className="legend-dot" style={{ backgroundColor: '#1a2942' }}></span> Calls
          </small>
          {showDuration && (
            <small className="d-flex align-items-center gap-1">
              <span className="legend-dot" style={{ backgroundColor: '#7cb342' }}></span> Avg Duration (min)
            </small>
          )}
        </div>
        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: 300 }}>
            <div className="spinner-border text-secondary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <Chart options={chartOptions} series={series} type="bar" height={300} />
        )}
      </div>
    </div>
  );
}

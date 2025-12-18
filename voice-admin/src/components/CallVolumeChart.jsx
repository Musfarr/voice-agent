import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Chart from 'react-apexcharts';
import { getCallVolume } from '../services/api';

export default function CallVolumeChart() {
  const [days, setDays] = useState(7);

  const { data: response, isLoading } = useQuery({
    queryKey: ['callVolume', days],
    queryFn: () => getCallVolume(days),
  });

  const data = Array.isArray(response?.data)
    ? response.data
    : Array.isArray(response?.data?.data)
      ? response.data.data
      : Array.isArray(response?.data?.records)
        ? response.data.records
        : [];

  const dates = data.map((item) => item.date ?? item.day ?? '--');
  const leadCalls = data.map((item) => item.lead_calls ?? item.resolved_queries ?? 0);
  const issueCalls = data.map((item) => item.issue_calls ?? item.closed_queries ?? 0);
  const totalCalls = data.map(
    (item) => item.total_calls ?? item.total_queries ?? (Number(item.lead_calls ?? item.resolved_queries ?? 0) + Number(item.issue_calls ?? item.closed_queries ?? 0))
  );

  const chartOptions = {
    chart: {
      type: 'bar',
      stacked: true,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '50%',
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: dates,
      labels: {
        style: { colors: '#6c757d', fontSize: '11px' },
      },
    },
    yaxis: {
      title: { text: 'Calls', style: { color: '#6c757d' } },
      labels: { style: { colors: '#6c757d' } },
    },
    colors: ['#1a2942', '#e57373', '#7cb342'],
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
    { name: 'Resolved Queries', data: leadCalls },
    { name: 'Closed Queries', data: issueCalls },
    { name: 'Total Calls', data: totalCalls },
  ];

  return (
    <div className="card h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title mb-0">Call Volume</h5>
          <select
            className="form-select form-select-sm"
            style={{ width: 'auto' }}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          >
            <option value={7}>Last 7</option>
            <option value={15}>Last 15</option>
            <option value={30}>Last 30</option>
          </select>
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

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

  const data = response?.data || [];
  const dates = data.map(item => item.date);
  const leadCalls = data.map(item => item.lead_calls);
  const issueCalls = data.map(item => item.issue_calls);
  const totalCalls = data.map(item => item.total_calls);

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
    { name: 'Lead Calls', data: leadCalls },
    { name: 'Issue Calls', data: issueCalls },
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
        <div className="d-flex gap-3 mb-3">
          <small className="d-flex align-items-center gap-1">
            <span className="legend-dot" style={{ backgroundColor: '#1a2942' }}></span> Lead Calls
          </small>
          <small className="d-flex align-items-center gap-1">
            <span className="legend-dot" style={{ backgroundColor: '#e57373' }}></span> Issue Calls
          </small>
          <small className="d-flex align-items-center gap-1">
            <span className="legend-dot" style={{ backgroundColor: '#7cb342' }}></span> Total Calls
          </small>
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

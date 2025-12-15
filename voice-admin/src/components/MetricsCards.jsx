import { useQuery } from '@tanstack/react-query';
import { getDashboardAnalytics } from '../services/api';

export default function MetricsCards({ startDate, endDate }) {
  const { data: response, isLoading } = useQuery({
    queryKey: ['dashboardAnalytics', startDate, endDate],
    queryFn: () => getDashboardAnalytics(startDate, endDate),
  });

  const data = response?.data;

  const metrics = [
    {
      label: `RANGE ${endDate || '2025-12-03'}`,
      value: data?.total_calls ?? '--',
      subtitle: 'Total Calls',
      icon: 'bi-telephone',
      color: 'primary',
    },
    {
      label: 'FROM LEADS',
      value: data?.lead_calls ?? '--',
      subtitle: 'Lead Calls',
      icon: 'bi-person-plus',
      color: 'info',
    },
    {
      label: 'FROM ISSUES',
      value: data?.issue_calls ?? '--',
      subtitle: 'Issue Calls',
      icon: 'bi-exclamation-triangle',
      color: 'warning',
    },
    {
      label: 'ALL CALLS',
      value: data?.avg_call_duration ? data.avg_call_duration.toFixed(2) : '--',
      subtitle: 'Avg Call Duration (min)',
      icon: 'bi-clock',
      color: 'success',
    },
    {
      label: 'SUM',
      value: data?.total_call_minutes ?? '--',
      subtitle: 'Total Call Minutes',
      icon: 'bi-graph-up',
      color: 'secondary',
    },
  ];

  return (
    <div className="row g-3">
      {metrics.map((metric, index) => (
        <div key={index} className="col-12 col-sm-6 col-lg">
          <div className={`card metric-card h-100`}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <small className="text-muted text-uppercase">{metric.label}</small>
                  <h2 className="mb-1 mt-2">
                    {isLoading ? <span className="placeholder col-4"></span> : metric.value}
                  </h2>
                  <small className="text-muted">{metric.subtitle}</small>
                </div>
                <div className={`metric-icon bg-${metric.color}-subtle`}>
                  <i className={`bi ${metric.icon} text-${metric.color}`}></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

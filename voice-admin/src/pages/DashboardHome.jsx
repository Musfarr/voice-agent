import MetricsCards from '../components/MetricsCards';
import HourlyAnalyticsChart from '../components/HourlyAnalyticsChart';
import CallVolumeChart from '../components/CallVolumeChart';
import CallLogTable from '../components/CallLogTable';

export default function DashboardHome() {
  return (
    <div className=' container-lg px-8 py-4'>
      <MetricsCards />

      <div className="row g-3 mt-4">
        <div className="col-12 col-lg-6">
          <HourlyAnalyticsChart />
        </div>
        <div className="col-12 col-lg-6">
          <CallVolumeChart />
        </div>
      </div>

      <div className="mt-5">
        <CallLogTable />
      </div>
    </div>
  );
}

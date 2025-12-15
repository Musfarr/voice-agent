import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLeads, getIssues, getFilters } from '../services/api';

export default function CallLogTable() {
  const [activeTab, setActiveTab] = useState('leads');
  const [expandedRow, setExpandedRow] = useState(null);
  const [limit, setLimit] = useState(10);
  const [skip, setSkip] = useState(0);
  const [filters, setFilters] = useState({
    status: '',
    industry_type: '',
    organization: '',
    start_date: '',
    end_date: '',
  });

  const { data: filtersResponse, isLoading: filtersLoading } = useQuery({
    queryKey: ['filters'],
    queryFn: getFilters,
  });

  const filterOptions = filtersResponse?.data;

  const leadsQueryParams = useMemo(() => ({ ...filters, limit, skip }), [filters, limit, skip]);
  const issuesQueryParams = useMemo(() => ({ ...filters, limit, skip }), [filters, limit, skip]);

  const { data: leadsResponse, isLoading: leadsLoading } = useQuery({
    queryKey: ['leads', leadsQueryParams],
    queryFn: () => getLeads(leadsQueryParams),
    enabled: activeTab === 'leads',
  });

  const { data: issuesResponse, isLoading: issuesLoading } = useQuery({
    queryKey: ['issues', issuesQueryParams],
    queryFn: () => getIssues(issuesQueryParams),
    enabled: activeTab === 'issues',
  });

  const records = activeTab === 'leads' ? leadsResponse?.data?.records : issuesResponse?.data?.records;
  const total = activeTab === 'leads' ? leadsResponse?.data?.total : issuesResponse?.data?.total;
  const isLoading = activeTab === 'leads' ? leadsLoading : issuesLoading;
  const isAnyLoading = filtersLoading || isLoading;
  const isControlsDisabled = filtersLoading;

  const currentPage = Math.floor(skip / limit) + 1;
  const totalPages = total ? Math.max(1, Math.ceil(total / limit)) : 1;

  useEffect(() => {
    setSkip(0);
    setExpandedRow(null);
  }, [activeTab, filters, limit]);

  const toggleTranscript = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      industry_type: '',
      organization: '',
      start_date: '',
      end_date: '',
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="card">
      <div className="card-body">
        {isAnyLoading && (
          <div className="api-loading-overlay" aria-label="Loading">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        {/* Filters */}
        <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-funnel"></i>
            <span className="fw-medium">Filters</span>
            <button className="btn btn-sm btn-outline-secondary" onClick={clearFilters} disabled={isControlsDisabled}>
              Clear
            </button>
          </div>

          <select
            className="form-select form-select-sm"
            style={{ width: 'auto' }}
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            disabled={isControlsDisabled}
          >
            <option value="">{activeTab === 'leads' ? 'Lead status' : 'Issue status'}</option>
            {(activeTab === 'leads'
              ? filterOptions?.lead_statuses || []
              : filterOptions?.issue_statuses || []
            ).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            className="form-select form-select-sm"
            style={{ width: 'auto' }}
            value={filters.industry_type}
            onChange={(e) => handleFilterChange('industry_type', e.target.value)}
            disabled={isControlsDisabled}
          >
            <option value="">Industry</option>
            {(filterOptions?.industries || []).map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>

          <select
            className="form-select form-select-sm"
            style={{ width: 'auto' }}
            value={filters.organization}
            onChange={(e) => handleFilterChange('organization', e.target.value)}
            disabled={isControlsDisabled}
          >
            <option value="">Organization</option>
            {(filterOptions?.organizations || []).map((org) => (
              <option key={org} value={org}>
                {org}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="form-control form-control-sm"
            style={{ width: 'auto' }}
            value={filters.start_date}
            onChange={(e) => handleFilterChange('start_date', e.target.value)}
            placeholder="Start date"
            disabled={isControlsDisabled}
          />

          <input
            type="date"
            className="form-control form-control-sm"
            style={{ width: 'auto' }}
            value={filters.end_date}
            onChange={(e) => handleFilterChange('end_date', e.target.value)}
            placeholder="End date"
            disabled={isControlsDisabled}
          />
        </div>

        {/* Tabs */}
        <div className="d-flex gap-2 mb-3">
          <button
            className={`btn btn-sm ${activeTab === 'leads' ? 'btn-dark' : 'btn-outline-dark'}`}
            onClick={() => setActiveTab('leads')}
            disabled={isControlsDisabled}
          >
            Leads
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'issues' ? 'btn-dark' : 'btn-outline-dark'}`}
            onClick={() => setActiveTab('issues')}
            disabled={isControlsDisabled}
          >
            Issues
          </button>
        </div>

        {/* Pagination */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
          <div className="text-muted small">
            {typeof total === 'number' ? (
              <>
                Showing <strong>{Math.min(skip + 1, total)}</strong>–<strong>{Math.min(skip + limit, total)}</strong> of{' '}
                <strong>{total}</strong>
              </>
            ) : (
              <>Showing results</>
            )}
          </div>

          <div className="d-flex align-items-center gap-2">
            <select
              className="form-select form-select-sm"
              style={{ width: 'auto' }}
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              aria-label="Rows per page"
              disabled={isControlsDisabled}
            >
              <option value={10}>10 / page</option>
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
              <option value={100}>100 / page</option>
            </select>

            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setSkip(Math.max(0, skip - limit))}
              disabled={skip === 0 || isAnyLoading}
            >
              Prev
            </button>

            <span className="small text-muted">
              Page <strong>{currentPage}</strong> / <strong>{totalPages}</strong>
            </span>

            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setSkip(skip + limit)}
              disabled={isAnyLoading || (typeof total === 'number' ? skip + limit >= total : false)}
            >
              Next
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-hover align-middle calllog-table">
            <thead className="table-light">
              <tr>
                <th className="text-start">Name</th>
                <th className="text-center">Email</th>
                <th className="text-center">Organization</th>
                <th className="text-center">Industry</th>
                <th className="text-center">Status</th>
                <th className="text-center">Created At</th>
                <th className="text-center">Caller</th>
                <th className="text-center">Duration</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="9" className="text-center py-4">
                    <div className="spinner-border text-secondary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : !records?.length ? (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-muted">
                    No data available
                  </td>
                </tr>
              ) : (
                records.map((item, index) => (
                  <React.Fragment key={item.id || index}>
                    <tr>
                      <td className="text-start fw-medium">{item.name || '--'}</td>
                      <td className="text-center">{item.email || '--'}</td>
                      <td className="text-center">{item.organization || '--'}</td>
                      <td className="text-center">{item.industry_type || item.industry || '--'}</td>
                      <td className="text-center">
                        <span className={`badge bg-${getStatusColor(item.status)}`}>
                          {item.status || '--'}
                        </span>
                      </td>
                      <td className="text-center">{item.created_at ? new Date(item.created_at).toLocaleString() : '--'}</td>
                      <td className="text-center">{item.caller_numbers || '--'}</td>
                      <td className="text-center">{item.call_duration ? `${item.call_duration} min` : '--'}</td>
                      <td className="text-center">
                        <div className="d-flex gap-1 justify-content-center">
                          {item.recording_text && (
                            <button
                              className={`btn btn-sm ${expandedRow === item.id ? 'btn-dark' : 'btn-outline-dark'}`}
                              title="View transcript"
                              onClick={() => toggleTranscript(item.id)}
                            >
                              <i className="bi bi-chat-text"></i>
                            </button>
                          )}
                          {item.recordings && (
                            <a
                              href={item.recordings}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-primary"
                              title="Play recording"
                            >
                              <i className="bi bi-play-circle"></i>
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                    {expandedRow === item.id && item.recording_text && (
                      <tr key={`transcript-${item.id}`} className="transcript-row">
                        <td colSpan="9" className="bg-light p-3">
                          <div className="transcript-content">
                            <h6 className="mb-2 d-flex align-items-center gap-2">
                              <i className="bi bi-chat-quote"></i> Call Transcript
                            </h6>
                            <div className="transcript-text p-3 bg-white rounded border">
                              {item.recording_text.split('\n').map((line, i) => (
                                <p key={i} className={`mb-2 ${line.startsWith('Caller:') ? 'text-primary' : line.startsWith('Agent:') ? 'text-success' : ''}`}>
                                  {line.startsWith('Caller:') && <strong>Caller: </strong>}
                                  {line.startsWith('Agent:') && <strong>Agent: </strong>}
                                  {line.replace(/^(Caller:|Agent:)\s*/, '')}
                                </p>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function getStatusColor(status) {
  const colors = {
    contacted: 'info',
    converted: 'success',
    pending: 'warning',
    closed: 'secondary',
    open: 'primary',
    resolved: 'success',
  };
  return colors[status?.toLowerCase()] || 'secondary';
}

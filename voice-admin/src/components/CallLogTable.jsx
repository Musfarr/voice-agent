import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLeads, getIssues, getFilters } from '../services/api';

export default function CallLogTable() {
  const [activeTab, setActiveTab] = useState('leads');
  const [expandedRow, setExpandedRow] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    industry_type: '',
    organization: '',
    start_date: '',
    end_date: '',
  });

  const { data: filterOptions } = useQuery({
    queryKey: ['filters'],
    queryFn: getFilters,
  });

  const { data: leadsResponse, isLoading: leadsLoading } = useQuery({
    queryKey: ['leads', filters],
    queryFn: () => getLeads(filters),
    enabled: activeTab === 'leads',
  });

  const { data: issuesResponse, isLoading: issuesLoading } = useQuery({
    queryKey: ['issues', filters],
    queryFn: () => getIssues(filters),
    enabled: activeTab === 'issues',
  });

  const records = activeTab === 'leads' ? leadsResponse?.data?.records : issuesResponse?.data?.records;
  const isLoading = activeTab === 'leads' ? leadsLoading : issuesLoading;

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
        {/* Filters */}
        <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-funnel"></i>
            <span className="fw-medium">Filters</span>
            <button className="btn btn-sm btn-outline-secondary" onClick={clearFilters}>
              Clear
            </button>
          </div>

          <select
            className="form-select form-select-sm"
            style={{ width: 'auto' }}
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
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
          />

          <input
            type="date"
            className="form-control form-control-sm"
            style={{ width: 'auto' }}
            value={filters.end_date}
            onChange={(e) => handleFilterChange('end_date', e.target.value)}
            placeholder="End date"
          />
        </div>

        {/* Tabs */}
        <div className="d-flex gap-2 mb-3">
          <button
            className={`btn btn-sm ${activeTab === 'leads' ? 'btn-dark' : 'btn-outline-dark'}`}
            onClick={() => setActiveTab('leads')}
          >
            Leads
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'issues' ? 'btn-dark' : 'btn-outline-dark'}`}
            onClick={() => setActiveTab('issues')}
          >
            Issues
          </button>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Organization</th>
                <th>Industry</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Caller</th>
                <th>Duration</th>
                <th>Actions</th>
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
                      <td>{item.name || '--'}</td>
                      <td>{item.email || '--'}</td>
                      <td>{item.organization || '--'}</td>
                      <td>{item.industry_type || item.industry || '--'}</td>
                      <td>
                        <span className={`badge bg-${getStatusColor(item.status)}`}>
                          {item.status || '--'}
                        </span>
                      </td>
                      <td>{item.created_at ? new Date(item.created_at).toLocaleString() : '--'}</td>
                      <td>{item.caller_numbers || '--'}</td>
                      <td>{item.call_duration ? `${item.call_duration} min` : '--'}</td>
                      <td>
                        <div className="d-flex gap-1">
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

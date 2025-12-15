import { useState } from 'react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      onLogin();
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card login-card">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <i className="bi bi-headset" style={{ fontSize: '3rem', color: 'var(--navy-dark)' }}></i>
                  <h2 className="mt-3 fw-bold">AI Voice Analytics</h2>
                  <p className="text-muted">Sign in to access your dashboard</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email address
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-dark btn-lg w-100">
                    Sign In
                  </button>
                </form>

                <div className="text-center mt-3">
                  <small className="text-muted">Demo: Use any credentials to login</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react'
import './WorkerAuth.css'

function WorkerAuth({ onLogin, onClose }) {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })

  // Signup form state
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    department: 'Picking',
    shift: 'morning'
  })

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      // Store token and worker data
      localStorage.setItem('token', data.data.token)
      localStorage.setItem('worker', JSON.stringify(data.data.worker))

      setSuccess('Login successful!')
      setTimeout(() => {
        onLogin(data.data.worker)
        onClose()
      }, 1000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupData.name,
          email: signupData.email,
          password: signupData.password,
          phone: signupData.phone,
          department: signupData.department,
          shift: signupData.shift
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed')
      }

      // Store token and worker data
      localStorage.setItem('token', data.data.token)
      localStorage.setItem('worker', JSON.stringify(data.data.worker))

      setSuccess('Account created successfully!')
      setTimeout(() => {
        onLogin(data.data.worker)
        onClose()
      }, 1000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose}>×</button>
        
        <div className="auth-header">
          <div className="auth-icon">👷</div>
          <h2>{isLogin ? 'Worker Login' : 'Worker Sign Up'}</h2>
          <p>{isLogin ? 'Access your warehouse dashboard' : 'Create your worker account'}</p>
        </div>

        {/* Toggle Tabs */}
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
          >
            Login
          </button>
          <button 
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
          >
            Sign Up
          </button>
        </div>

        {/* Error/Success Messages */}
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        {/* Login Form */}
        {isLogin ? (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        ) : (
          /* Signup Form */
          <form onSubmit={handleSignup} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={signupData.name}
                  onChange={handleSignupChange}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={signupData.phone}
                  onChange={handleSignupChange}
                  placeholder="+91 9876543210"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={signupData.email}
                onChange={handleSignupChange}
                placeholder="worker@waretrack.com"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  placeholder="Min 6 characters"
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={signupData.confirmPassword}
                  onChange={handleSignupChange}
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Department</label>
                <select
                  name="department"
                  value={signupData.department}
                  onChange={handleSignupChange}
                >
                  <option value="Receiving">Receiving</option>
                  <option value="Storage">Storage</option>
                  <option value="Picking">Picking</option>
                  <option value="Shipping">Shipping</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
              <div className="form-group">
                <label>Shift</label>
                <select
                  name="shift"
                  value={signupData.shift}
                  onChange={handleSignupChange}
                >
                  <option value="morning">Morning (6AM - 2PM)</option>
                  <option value="afternoon">Afternoon (2PM - 10PM)</option>
                  <option value="night">Night (10PM - 6AM)</option>
                </select>
              </div>
            </div>
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
        )}

        <div className="auth-footer">
          {isLogin ? (
            <p>Don't have an account? <span onClick={() => setIsLogin(false)}>Sign up</span></p>
          ) : (
            <p>Already have an account? <span onClick={() => setIsLogin(true)}>Login</span></p>
          )}
        </div>
      </div>
    </div>
  )
}

export default WorkerAuth

import { useState } from 'react';

export default function AuthScreen({ mode, onSwitchMode, onSignupSuccess, onLoginSuccess }) {
  const isSignup = mode === 'signup';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleModeChange = (nextMode) => {
    setMessage('');
    setPassword('');
    setConfirmPassword('');
    onSwitchMode(nextMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignup) {
      const trimmedName = fullName.trim();
      const normalizedEmail = email.trim().toLowerCase();

      if (password !== confirmPassword) {
        setMessage('Passwords do not match.');
        return;
      }
      if (password.length < 8) {
        setMessage('Password must be at least 8 characters.');
        return;
      }

      setMessage('');
      setPassword('');
      setConfirmPassword('');
      setEmail(normalizedEmail);
      const error = await onSignupSuccess({ name: trimmedName, email: normalizedEmail, password });
      if (error) setMessage(error);
    } else {
      const normalizedEmail = email.trim().toLowerCase();
      const error = await onLoginSuccess(normalizedEmail, password);
      if (error) {
        setMessage(error);
      } else {
        setMessage('');
        setPassword('');
      }
    }
  };

  return (
    <section key={mode} className="screen auth active page-transition" id={mode}>
      <aside className="brand-panel">
        <div className="brand">
          <div className="brand-house" />
          <div className="brand-name">
            Emy's <span>Store</span>
          </div>
        </div>
        <div className="tagline">YOUR EVERYDAY STORE</div>
      </aside>

      <main className="auth-panel">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h1>{isSignup ? 'Create an account' : 'Log in your account'}</h1>

          {isSignup && (
            <div className="field">
              <label htmlFor="fullName">Full name</label>
              <input
                id="fullName"
                placeholder="Ex. Juan Dela Cruz"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="field">
            <label htmlFor="authEmail">Email</label>
            <input
              id="authEmail"
              type="email"
              placeholder="your email@gmail.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="authPassword">Password</label>
            <input
              id="authPassword"
              type="password"
              minLength={isSignup ? 8 : undefined}
              placeholder="Min. of 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {isSignup ? (
            <div className="field">
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                id="confirmPassword"
                type="password"
                minLength={8}
                placeholder="Min. of 8 characters"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          ) : (
            <button
              className="forgot"
              type="button"
              onClick={() => alert('Password recovery can be connected to your email service.')}
            >
              Forgot password
            </button>
          )}

          <div className="message">{message}</div>

          <button className="auth-submit" type="submit">
            {isSignup ? 'Create account' : 'Log in'}
          </button>

          <p className="auth-switch">
            {isSignup ? (
              <button type="button" onClick={() => handleModeChange('login')}>
                Already have an account? Log in
              </button>
            ) : (
              <button type="button" onClick={() => handleModeChange('signup')}>
                Don’t have an account? Sign up
              </button>
            )}
          </p>
        </form>
      </main>
    </section>
  );
}
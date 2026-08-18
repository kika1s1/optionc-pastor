import { Link } from 'react-router-dom';
import { PasswordField } from './PasswordField.jsx';

export function LoginScreen({ email, password, error, onEmail, onPassword, onSubmit }) {
  return (
    <div className="min-h-dvh overflow-x-hidden bg-[#f8fafc] font-sans text-base leading-7 text-slate-700 antialiased">
      <div className="lg:grid lg:min-h-dvh lg:grid-cols-[minmax(0,1fr)_min(100%,32rem)] xl:grid-cols-[minmax(0,1fr)_36rem]">
        <section className="px-5 pb-4 pt-7 sm:px-8 sm:pt-10 lg:flex lg:flex-col lg:justify-center lg:border-r lg:border-slate-200 lg:bg-white lg:px-12 lg:py-16 xl:px-20">
          <Link to="/" className="hero-in inline-block font-serif text-2xl font-semibold tracking-tight text-slate-900">
            Option<span className="text-amber-600">C</span>
          </Link>
          <h1 className="hero-in-delay display-heading mt-4 max-w-lg text-3xl sm:text-4xl lg:mt-8">
            Sign in to the parish desk.
          </h1>
          <p className="hero-in-late section-copy mt-4 max-w-md">
            Overview and walkthrough requests from pastors and principals arrive here, on the same record your office
            already uses.
          </p>
          <Link to="/" className="hero-in-late mt-8 hidden text-base font-semibold text-sky-800 underline decoration-sky-300 underline-offset-4 lg:inline-block">
            Return to the public site
          </Link>
        </section>

        <section className="flex items-start px-5 pb-10 sm:px-8 lg:items-center lg:bg-white lg:px-10 lg:py-16">
          <div className="hero-in-delay surface mx-auto w-full max-w-md p-5 sm:p-6 lg:max-w-none">
            <p className="section-kicker">Staff access</p>
            <h2 className="mt-2 font-serif text-2xl font-semibold text-slate-900">Sign in</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Use the email and password issued to your OptionC office.
            </p>

            <form className="mt-6 space-y-5 sm:mt-8" onSubmit={onSubmit}>
              <div>
                <label htmlFor="login-email" className="mb-1.5 block text-sm font-bold text-slate-800">
                  Work email
                </label>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  inputMode="email"
                  autoComplete="username"
                  required
                  placeholder="pastor@stathanasius.org"
                  value={email}
                  onChange={(event) => onEmail(event.target.value)}
                  aria-invalid={Boolean(error)}
                  className="field-input form-field"
                />
              </div>
              <PasswordField
                id="login-password"
                name="password"
                label="Password"
                autoComplete="current-password"
                required
                placeholder="At least 12 characters"
                value={password}
                onChange={onPassword}
                invalid={Boolean(error)}
              />
              {error ? (
                <p className="error-in rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800" role="alert">
                  {error}
                </p>
              ) : null}
              <button
                type="submit"
                className="btn-primary w-full bg-sky-700 hover:bg-sky-600"
              >
                Sign in
              </button>
            </form>

            <Link
              to="/"
              className="mt-6 block text-center text-sm font-semibold text-sky-800 underline decoration-sky-300 underline-offset-4 lg:hidden"
            >
              View the public site
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

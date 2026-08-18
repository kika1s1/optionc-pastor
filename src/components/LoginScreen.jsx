import { Link } from 'react-router-dom';
import { PasswordField } from './PasswordField.jsx';

export function LoginScreen({ email, password, error, onEmail, onPassword, onSubmit }) {
  const fieldClass = `field-input w-full rounded-xl border bg-white px-4 py-3.5 text-lg text-slate-900 outline-none ring-amber-400 placeholder:text-slate-400 focus:ring-4 sm:py-4 sm:text-xl ${
    error ? 'border-rose-400' : 'border-slate-300'
  }`;

  return (
    <div className="min-h-dvh overflow-x-hidden bg-sky-50 font-sans text-lg leading-7 text-slate-700 antialiased sm:text-xl sm:leading-8">
      <div className="lg:grid lg:min-h-dvh lg:grid-cols-[minmax(0,1fr)_min(100%,32rem)] xl:grid-cols-[minmax(0,1fr)_36rem]">
        <section className="px-5 pb-4 pt-7 sm:px-8 sm:pt-10 lg:flex lg:flex-col lg:justify-center lg:bg-sky-100 lg:px-12 lg:py-16 xl:px-20">
          <Link to="/" className="hero-in inline-block font-serif text-3xl font-semibold tracking-tight text-slate-900">
            Option<span className="text-amber-600">C</span>
          </Link>
          <h1 className="hero-in-delay mt-4 max-w-lg font-serif text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl lg:mt-8 lg:text-5xl">
            Sign in to the parish desk.
          </h1>
          <p className="hero-in-late mt-4 max-w-md text-lg leading-8 text-slate-600 sm:text-xl sm:leading-8 lg:text-2xl lg:leading-9">
            Overview and walkthrough requests from pastors and principals arrive here, on the same record your office
            already uses.
          </p>
          <Link to="/" className="hero-in-late mt-8 hidden text-lg font-semibold text-sky-800 underline decoration-sky-300 underline-offset-4 lg:inline-block">
            Return to the public site
          </Link>
        </section>

        <section className="flex items-start px-5 pb-10 sm:px-8 lg:items-center lg:bg-white lg:px-10 lg:py-16">
          <div className="hero-in-delay mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 lg:max-w-none lg:border-0 lg:p-0 lg:shadow-none">
            <p className="text-base font-semibold uppercase tracking-[0.16em] text-amber-700">Staff access</p>
            <h2 className="mt-2 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">Sign in</h2>
            <p className="mt-2 text-base leading-7 text-slate-600 sm:text-lg">
              Use the email and password issued to your OptionC office.
            </p>

            <form className="mt-6 space-y-5 sm:mt-8" onSubmit={onSubmit}>
              <div>
                <label htmlFor="login-email" className="mb-2 block text-base font-semibold text-slate-800 sm:text-lg">
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
                  className={fieldClass}
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
                <p className="error-in rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-base font-semibold text-rose-800 sm:text-lg" role="alert">
                  {error}
                </p>
              ) : null}
              <button
                type="submit"
                className="btn-anim w-full rounded-xl bg-sky-700 px-6 py-3.5 text-lg font-semibold text-white hover:bg-sky-600 sm:py-4 sm:text-xl"
              >
                Sign in
              </button>
            </form>

            <Link
              to="/"
              className="mt-6 block text-center text-base font-semibold text-sky-800 underline decoration-sky-300 underline-offset-4 sm:text-lg lg:hidden"
            >
              View the public site
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

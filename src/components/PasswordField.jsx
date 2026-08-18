import { useState } from 'react';

export function PasswordField({
  id,
  name,
  label,
  value,
  onChange,
  autoComplete,
  placeholder,
  required = false,
  invalid = false,
}) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-base font-semibold text-slate-800 sm:text-lg">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={show ? 'text' : 'password'}
          autoComplete={autoComplete}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={invalid}
          className={`field-input w-full rounded-xl border bg-white px-4 py-3.5 pr-12 text-lg text-slate-900 outline-none ring-amber-400 placeholder:text-slate-400 focus:ring-4 sm:py-4 sm:text-xl ${
            invalid ? 'border-rose-400' : 'border-slate-400'
          }`}
        />
        <button
          type="button"
          onClick={() => setShow((current) => !current)}
          aria-label={show ? 'Hide password' : 'Show password'}
          className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-lg p-2 text-sky-800 hover:bg-sky-50"
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12s-3.75 6.75-9.75 6.75S2.25 12 2.25 12Z" />
      <circle cx="12" cy="12" r="2.75" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6.4A9.3 9.3 0 0 1 12 6.25c6 0 9.75 6.75 9.75 6.75a16.6 16.6 0 0 1-3.2 3.7M6.4 6.4C4.1 8 2.25 12 2.25 12S6 18.75 12 18.75c1.5 0 2.9-.35 4.15-.95" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.9 9.9A2.75 2.75 0 0 0 14.1 14.1" />
    </svg>
  );
}

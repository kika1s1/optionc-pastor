import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

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
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold text-slate-800">
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
          className={`field-input form-field pr-12 ${
            invalid ? 'border-rose-400' : 'border-slate-400'
          }`}
        />
        <button
          type="button"
          onClick={() => setShow((current) => !current)}
          aria-label={show ? 'Hide password' : 'Show password'}
          className="icon-button absolute top-1/2 right-2 -translate-y-1/2 text-sky-800 hover:bg-sky-50"
        >
          {show ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}

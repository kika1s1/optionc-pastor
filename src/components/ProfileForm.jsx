import { useEffect, useState } from 'react';
import { initials } from '../lib/user.js';
import { api } from '../lib/api.js';
import { PasswordField } from './PasswordField.jsx';

const fieldClass =
  'field-input form-field';

export function ProfileForm({ user, onSaved }) {
  const [values, setValues] = useState(formFromUser(user));
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setValues(formFromUser(user));
  }, [user]);

  function update(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setSaved(false);
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    setSaved(false);

    const emailChanged = values.email.trim().toLowerCase() !== user.email;
    if (emailChanged && !values.currentPassword) {
      setError('Enter your current password to change your email.');
      return;
    }

    if (values.newPassword || values.confirmPassword) {
      if (values.newPassword !== values.confirmPassword) {
        setError('New password and confirmation do not match.');
        return;
      }
      if (values.newPassword.length < 12) {
        setError('New password must be at least 12 characters.');
        return;
      }
      if (!values.currentPassword) {
        setError('Enter your current password to change it.');
        return;
      }
    }

    setPending(true);
    try {
      const data = await api('/api/profile', { method: 'PATCH', body: values });
      onSaved(data.user);
      setValues({
        ...formFromUser(data.user),
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setPending(false);
    }
  }

  const mark = initials(values.name);

  return (
    <form className="flex min-h-full w-full flex-col gap-6" onSubmit={submit}>
      <div className="grid w-full flex-1 gap-5 xl:grid-cols-2">
      <section className="admin-card flex h-full flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-800 font-serif text-xl font-semibold text-white">
            {mark}
          </span>
          <div>
            <p className="section-kicker">Staff record</p>
            <h2 className="font-serif text-2xl font-semibold text-slate-900">Your details</h2>
          </div>
        </div>

        <div className="mt-6 grid flex-1 gap-4 sm:grid-cols-2">
          <Field label="Full name" id="profile-name">
            <input
              id="profile-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              placeholder="Clare Brennan"
              value={values.name}
              onChange={update}
              className={fieldClass}
            />
          </Field>
          <Field label="Job title" id="profile-role">
            <input
              id="profile-role"
              name="role"
              type="text"
              autoComplete="organization-title"
              required
              placeholder="Director of Parish Relations"
              value={values.role}
              onChange={update}
              className={fieldClass}
            />
          </Field>
          <Field label="Work email" id="profile-email">
            <input
              id="profile-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              placeholder="staff@optionc.com"
              value={values.email}
              onChange={update}
              className={fieldClass}
            />
          </Field>
          <Field label="Phone" id="profile-phone">
            <input
              id="profile-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="(216) 555-0142"
              value={values.phone}
              onChange={update}
              className={fieldClass}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Parish or office" id="profile-parish">
              <input
                id="profile-parish"
                name="parish"
                type="text"
                autoComplete="organization"
                placeholder="OptionC parish relations"
                value={values.parish}
                onChange={update}
                className={fieldClass}
              />
            </Field>
          </div>
        </div>
      </section>

      <section className="admin-card flex h-full flex-col p-5 sm:p-6">
        <p className="section-kicker">Password</p>
        <h2 className="mt-2 font-serif text-2xl font-semibold text-slate-900">Change your password</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Leave the new password blank to keep the one you already use. Changing email or password needs your current
          password.
        </p>
        <div className="mt-6 grid flex-1 gap-4">
          <PasswordField
            id="profile-current-password"
            name="currentPassword"
            label="Current password"
            autoComplete="current-password"
            placeholder="Required to change email or password"
            value={values.currentPassword}
            onChange={(value) => {
              setValues((current) => ({ ...current, currentPassword: value }));
              setSaved(false);
            }}
            invalid={Boolean(error)}
          />
          <PasswordField
            id="profile-new-password"
            name="newPassword"
            label="New password"
            autoComplete="new-password"
            placeholder="At least 12 characters"
            value={values.newPassword}
            onChange={(value) => {
              setValues((current) => ({ ...current, newPassword: value }));
              setSaved(false);
            }}
            invalid={Boolean(error)}
          />
          <PasswordField
            id="profile-confirm-password"
            name="confirmPassword"
            label="Confirm new password"
            autoComplete="new-password"
            placeholder="Repeat the new password"
            value={values.confirmPassword}
            onChange={(value) => {
              setValues((current) => ({ ...current, confirmPassword: value }));
              setSaved(false);
            }}
            invalid={Boolean(error)}
          />
        </div>
      </section>
      </div>

      {error ? (
        <p className="error-in rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800" role="alert">
          {error}
        </p>
      ) : null}
      {saved ? (
        <p className="error-in rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800" role="status">
          Profile saved.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary bg-sky-700 hover:bg-sky-600 disabled:opacity-70"
      >
        {pending ? 'Saving…' : 'Save profile'}
      </button>
    </form>
  );
}

function Field({ id, label, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold text-slate-800">
        {label}
      </label>
      {children}
    </div>
  );
}

function formFromUser(user) {
  return {
    name: user.name || '',
    email: user.email || '',
    role: user.role || '',
    phone: user.phone || '',
    parish: user.parish || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
}

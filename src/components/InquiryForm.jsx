import { useState } from 'react';
import { api } from '../lib/api.js';
import { ROLES } from '../lib/constants.js';

const fieldClass =
  'field-input form-field';

export function InquiryForm({ intent, onIntent }) {
  const [values, setValues] = useState({
    name: '',
    email: '',
    parish: '',
    role: '',
    note: '',
  });
  const [error, setError] = useState('');
  const [sent, setSent] = useState(null);
  const [pending, setPending] = useState('');

  function update(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function submit(nextIntent) {
    setError('');
    setPending(nextIntent);
    onIntent(nextIntent);
    try {
      const data = await api('/api/inquiries', {
        method: 'POST',
        body: { ...values, intent: nextIntent },
      });
      setSent(data.intent);
    } catch (err) {
      setError(err.message);
    } finally {
      setPending('');
    }
  }

  if (sent) {
    return (
      <div className="flex min-h-64 flex-col justify-center">
        <p className="section-kicker">Request received</p>
        <h3 className="mt-2 font-serif text-2xl font-semibold text-slate-900">Thank you.</h3>
        <p className="section-copy mt-4">
          {sent === 'walkthrough'
            ? 'We received your walkthrough request. Someone from OptionC will follow up to schedule a half hour with your own families.'
            : 'We received your request. The overview will come to the email you entered.'}
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        const submitter = event.nativeEvent.submitter;
        submit(submitter?.dataset.intent || intent);
      }}
    >
      <div>
        <p className="section-kicker">Your details</p>
        <h3 className="mt-2 font-serif text-2xl font-semibold text-slate-900">Tell us who to send this to.</h3>
      </div>
      <div>
        <label htmlFor="f-name" className="mb-1.5 block text-sm font-bold text-slate-800">
          Name
        </label>
        <input
          id="f-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          placeholder="Fr. Michael Dolan"
          className={fieldClass}
          value={values.name}
          onChange={update}
        />
      </div>
      <div>
        <label htmlFor="f-email" className="mb-1.5 block text-sm font-bold text-slate-800">
          Email
        </label>
        <input
          id="f-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="pastor@stathanasius.org"
          className={fieldClass}
          value={values.email}
          onChange={update}
        />
      </div>
      <div>
        <label htmlFor="f-parish" className="mb-1.5 block text-sm font-bold text-slate-800">
          Parish or school
        </label>
        <input
          id="f-parish"
          name="parish"
          type="text"
          required
          placeholder="St. Athanasius Parish & School"
          className={fieldClass}
          value={values.parish}
          onChange={update}
        />
      </div>
      <div>
        <label htmlFor="f-role" className="mb-1.5 block text-sm font-bold text-slate-800">
          Your role
        </label>
        <select
          id="f-role"
          name="role"
          required
          className={`${fieldClass} ${values.role ? 'text-slate-900' : 'text-slate-400'}`}
          value={values.role}
          onChange={update}
        >
          <option value="" disabled>
            Select your role
          </option>
          {ROLES.map((role) => (
            <option key={role} className="text-slate-900">
              {role}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="f-note" className="mb-1.5 block text-sm font-bold text-slate-800">
          Anything you'd like us to know? (optional)
        </label>
        <textarea
          id="f-note"
          name="note"
          rows="4"
          placeholder="Please send the Saturday overview."
          className={fieldClass}
          value={values.note}
          onChange={update}
        />
      </div>
      {error ? (
        <p className="error-in rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800" role="alert">
          {error}
        </p>
      ) : null}
      <div className="grid grid-cols-1 gap-3">
        <button
          type="submit"
          data-intent="overview"
          disabled={Boolean(pending)}
          className="btn-primary w-full disabled:opacity-60"
        >
          {pending === 'overview' ? 'Sending…' : 'Send me the overview'}
        </button>
        <button
          type="submit"
          data-intent="walkthrough"
          disabled={Boolean(pending)}
          className="btn-secondary w-full disabled:opacity-60"
        >
          {pending === 'walkthrough' ? 'Sending…' : 'Request a walkthrough'}
        </button>
      </div>
      <p className="text-sm leading-6 text-slate-500">
        We'll only use your details to send the overview and follow up with you.
      </p>
    </form>
  );
}

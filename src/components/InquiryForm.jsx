import { useState } from 'react';
import { api } from '../lib/api.js';
import { ROLES } from '../lib/constants.js';

const fieldClass =
  'field-input w-full rounded-xl border border-slate-400 bg-white px-4 py-3.5 text-lg text-slate-900 outline-none ring-amber-400 placeholder:text-slate-400 focus:ring-4 sm:py-4 sm:text-xl';

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
        <p className="text-base font-semibold uppercase tracking-[0.16em] text-amber-700">Request received</p>
        <h3 className="mt-2 font-serif text-3xl font-semibold text-slate-900">Thank you.</h3>
        <p className="mt-4 text-lg leading-8 text-slate-600 sm:text-xl">
          {sent === 'walkthrough'
            ? 'We received your walkthrough request. Someone from OptionC will follow up to schedule a half hour with your own families.'
            : 'We received your request. The overview will come to the email you entered.'}
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        const submitter = event.nativeEvent.submitter;
        submit(submitter?.dataset.intent || intent);
      }}
    >
      <div>
        <p className="text-base font-semibold uppercase tracking-[0.16em] text-amber-700">Your details</p>
        <h3 className="mt-2 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">Tell us who to send this to.</h3>
      </div>
      <div>
        <label htmlFor="f-name" className="mb-2 block text-base font-semibold text-slate-800 sm:text-lg">
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
        <label htmlFor="f-email" className="mb-2 block text-base font-semibold text-slate-800 sm:text-lg">
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
        <label htmlFor="f-parish" className="mb-2 block text-base font-semibold text-slate-800 sm:text-lg">
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
        <label htmlFor="f-role" className="mb-2 block text-base font-semibold text-slate-800 sm:text-lg">
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
        <label htmlFor="f-note" className="mb-2 block text-base font-semibold text-slate-800 sm:text-lg">
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
        <p className="error-in rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-base font-semibold text-rose-800 sm:text-lg" role="alert">
          {error}
        </p>
      ) : null}
      <div className="grid grid-cols-1 gap-3">
        <button
          type="submit"
          data-intent="overview"
          disabled={Boolean(pending)}
          className="btn-anim w-full rounded-xl bg-amber-600 px-6 py-4 text-lg font-semibold text-white hover:bg-amber-500 disabled:opacity-60 sm:text-xl"
        >
          {pending === 'overview' ? 'Sending…' : 'Send me the overview'}
        </button>
        <button
          type="submit"
          data-intent="walkthrough"
          disabled={Boolean(pending)}
          className="btn-anim w-full rounded-xl border-2 border-sky-700 px-6 py-4 text-lg font-semibold text-sky-800 hover:bg-sky-50 disabled:opacity-60 sm:text-xl"
        >
          {pending === 'walkthrough' ? 'Sending…' : 'Request a walkthrough'}
        </button>
      </div>
      <p className="text-base leading-7 text-slate-500 sm:text-lg">
        We'll only use your details to send the overview and follow up with you.
      </p>
    </form>
  );
}

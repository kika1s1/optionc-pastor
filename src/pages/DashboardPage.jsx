import { useEffect, useMemo, useState } from 'react';
import { DashboardSidebar } from '../components/DashboardSidebar.jsx';
import { LoginScreen } from '../components/LoginScreen.jsx';
import { ProfileForm } from '../components/ProfileForm.jsx';
import { ProfileMenu } from '../components/ProfileMenu.jsx';
import { api } from '../lib/api.js';
import { ROLE_COLORS } from '../lib/constants.js';

const TITLES = {
  all: 'All inquiries',
  new: 'New inquiries',
  overview: 'Overview requests',
  walkthrough: 'Walkthrough requests',
  contacted: 'Contacted',
};

export function DashboardPage() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [inquiries, setInquiries] = useState([]);
  const [filter, setFilter] = useState('all');
  const [section, setSection] = useState('inquiries');

  useEffect(() => {
    document.title = 'Inquiry dashboard — OptionC';
    loadWorkspace().catch(() => setUser(null));
  }, []);

  async function loadWorkspace() {
    try {
      const session = await api('/api/session');
      setUser(session.user);
      const data = await api('/api/inquiries');
      setInquiries(data.inquiries);
      return true;
    } catch (err) {
      if (err.status === 401) setUser(null);
      return false;
    }
  }

  async function login(event) {
    event.preventDefault();
    setLoginError('');
    try {
      const data = await api('/api/login', { method: 'POST', body: { email, password } });
      setUser(data.user);
      setPassword('');
      const list = await api('/api/inquiries');
      setInquiries(list.inquiries);
    } catch (err) {
      setLoginError(err.message);
    }
  }

  async function logout() {
    await api('/api/logout', { method: 'POST' });
    setInquiries([]);
    setUser(null);
  }

  async function updateStatus(id, status) {
    await api(`/api/inquiries/${id}`, { method: 'PATCH', body: { status } });
    await loadWorkspace();
  }

  const counts = useMemo(
    () => ({
      all: inquiries.length,
      new: inquiries.filter((item) => item.status === 'new').length,
      walkthrough: inquiries.filter((item) => item.intent === 'walkthrough').length,
      overview: inquiries.filter((item) => item.intent === 'overview').length,
      contacted: inquiries.filter((item) => item.status === 'contacted').length,
    }),
    [inquiries],
  );

  const visible = useMemo(() => {
    return inquiries.filter((item) => {
      if (filter === 'all') return true;
      if (filter === 'new' || filter === 'contacted') return item.status === filter;
      return item.intent === filter;
    });
  }, [filter, inquiries]);

  if (!user) {
    return (
      <LoginScreen
        email={email}
        password={password}
        error={loginError}
        onEmail={setEmail}
        onPassword={setPassword}
        onSubmit={login}
      />
    );
  }

  return (
    <div className="min-h-dvh bg-sky-50 font-sans text-lg leading-7 text-slate-700 antialiased sm:text-xl sm:leading-8">
      <div className="flex min-h-dvh">
        <aside className="sticky top-0 flex h-dvh w-60 shrink-0 flex-col border-r border-slate-200 bg-white sm:w-72">
          <div className="h-1.5 shrink-0 bg-amber-500" />
          <DashboardSidebar
            filter={filter}
            section={section}
            counts={counts}
            user={user}
            onFilter={(id) => {
              setFilter(id);
              setSection('inquiries');
            }}
            onOpenProfile={() => setSection('profile')}
          />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
            <div className="h-1.5 bg-amber-500" />
            <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-amber-700">Parish desk</p>
                <h1 className="truncate font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
                  {section === 'profile' ? 'Your profile' : TITLES[filter]}
                </h1>
              </div>
              <ProfileMenu user={user} onEditProfile={() => setSection('profile')} onSignOut={logout} />
            </div>
          </header>

          <main className="flex w-full min-w-0 flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            {section === 'profile' ? (
              <ProfileForm user={user} onSaved={setUser} />
            ) : (
              <>
            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Stat label="All inquiries" value={counts.all} box="border-slate-200 bg-white" tone="text-slate-500" number="text-slate-900" />
              <Stat label="New" value={counts.new} box="border-sky-200 bg-sky-100" tone="text-sky-800" number="text-sky-900" />
              <Stat label="Walkthroughs" value={counts.walkthrough} box="border-amber-200 bg-amber-100" tone="text-amber-800" number="text-amber-900" />
              <Stat label="Overviews" value={counts.overview} box="border-emerald-200 bg-emerald-100" tone="text-emerald-800" number="text-emerald-900" />
            </section>

            {visible.length === 0 ? (
              <p className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center text-xl text-slate-500 sm:text-2xl">
                No inquiries in this list yet. When someone submits the website form, it will appear here.
              </p>
            ) : (
              <div className="mt-8 space-y-4">
                {visible.map((item) => (
                  <InquiryCard key={item.id} item={item} onStatus={updateStatus} />
                ))}
              </div>
            )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, box, tone, number }) {
  return (
    <article className={`card-anim rounded-2xl border p-5 sm:p-6 ${box}`}>
      <p className={`text-base font-semibold sm:text-lg ${tone}`}>{label}</p>
      <p className={`mt-2 font-serif text-4xl font-semibold sm:text-5xl ${number}`}>{value}</p>
    </article>
  );
}

function InquiryCard({ item, onStatus }) {
  const roleClass = ROLE_COLORS[item.role] || ROLE_COLORS.Other;
  const intentClass = item.intent === 'walkthrough' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800';
  const statusClass = item.status === 'new' ? 'bg-sky-100 text-sky-800' : 'bg-slate-200 text-slate-700';
  const nextStatus = item.status === 'new' ? 'contacted' : 'new';

  return (
    <article className="card-anim rounded-2xl border border-slate-200 bg-white p-5 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">{item.name}</h2>
          <p className="mt-2 text-base text-slate-500 sm:text-lg">
            {new Date(item.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className={roleClass}>{item.role}</Badge>
          <Badge className={intentClass}>{item.intent === 'walkthrough' ? 'Walkthrough' : 'Overview'}</Badge>
          <Badge className={statusClass}>{item.status === 'new' ? 'New' : 'Contacted'}</Badge>
        </div>
      </div>
      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-base font-semibold text-slate-500 sm:text-lg">Email</dt>
          <dd>
            <a className="break-all font-semibold text-sky-800 underline decoration-sky-300 underline-offset-4" href={`mailto:${item.email}`}>
              {item.email}
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-base font-semibold text-slate-500 sm:text-lg">Parish or school</dt>
          <dd className="text-slate-800">{item.parish}</dd>
        </div>
      </dl>
      {item.note ? <p className="mt-6 rounded-xl bg-stone-50 px-5 py-4 text-lg leading-8 text-slate-700 sm:text-xl">{item.note}</p> : null}
      <button
        type="button"
        onClick={() => onStatus(item.id, nextStatus)}
        className="btn-anim mt-6 rounded-xl bg-sky-700 px-5 py-3 text-lg font-semibold text-white hover:bg-sky-600"
      >
        {item.status === 'new' ? 'Mark contacted' : 'Mark new'}
      </button>
    </article>
  );
}

function Badge({ className, children }) {
  return <span className={`rounded-md px-3 py-1 text-base font-semibold ${className}`}>{children}</span>;
}

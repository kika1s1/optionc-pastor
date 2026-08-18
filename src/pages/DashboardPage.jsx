import { useEffect, useMemo, useState } from 'react';
import { ArrowDownUp, CheckCircle2, Mail, RotateCcw, School, Search } from 'lucide-react';
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
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');

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
    } finally {
      setLoading(false);
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
    const query = search.trim().toLowerCase();
    return inquiries.filter((item) => {
      if (filter === 'all') return true;
      if (filter === 'new' || filter === 'contacted') return item.status === filter;
      return item.intent === filter;
    }).filter((item) => {
      if (!query) return true;
      return [item.name, item.email, item.parish, item.role, item.note].some((value) => String(value || '').toLowerCase().includes(query));
    }).sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return sort === 'oldest' ? timeA - timeB : timeB - timeA;
    });
  }, [filter, inquiries, search, sort]);

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
    <div className="min-h-dvh bg-[#f6f7f8] font-sans text-base leading-7 text-slate-700 antialiased">
      <div className="flex min-h-dvh">
        <aside className="sticky top-0 flex h-dvh w-56 shrink-0 flex-col border-r border-slate-200 bg-white sm:w-64">
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
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
              <div className="min-w-0">
                <p className="section-kicker">Parish desk</p>
                <h1 className="truncate font-serif text-2xl font-semibold text-slate-900">
                  {section === 'profile' ? 'Your profile' : TITLES[filter]}
                </h1>
              </div>
              <ProfileMenu user={user} onEditProfile={() => setSection('profile')} onSignOut={logout} />
            </div>
          </header>

          <main className="flex w-full min-w-0 flex-1 flex-col px-4 py-5 sm:px-6 lg:px-8">
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

            <section className="admin-card mt-5 flex flex-col gap-3 p-3 md:flex-row md:items-center md:justify-between">
              <label className="relative block flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <span className="sr-only">Search inquiries</span>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search inquiries"
                  className="form-field pl-9"
                />
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <ArrowDownUp className="h-4 w-4 text-slate-400" aria-hidden="true" />
                <span>Sort</span>
                <select value={sort} onChange={(event) => setSort(event.target.value)} className="form-field w-40">
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                </select>
              </label>
            </section>

            {loading ? (
              <p className="admin-card mt-5 px-6 py-10 text-center text-sm text-slate-500">
                Loading inquiries…
              </p>
            ) : visible.length === 0 ? (
              <p className="admin-card mt-5 border-dashed px-6 py-12 text-center text-base text-slate-500">
                No inquiries in this list yet. When someone submits the website form, it will appear here.
              </p>
            ) : (
              <div className="admin-card mt-5 overflow-hidden">
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
    <article className={`admin-card p-4 ${box}`}>
      <p className={`text-sm font-bold ${tone}`}>{label}</p>
      <p className={`mt-1 font-serif text-3xl font-semibold ${number}`}>{value}</p>
    </article>
  );
}

function InquiryCard({ item, onStatus }) {
  const roleClass = ROLE_COLORS[item.role] || ROLE_COLORS.Other;
  const intentClass = item.intent === 'walkthrough' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800';
  const statusClass = item.status === 'new' ? 'bg-sky-100 text-sky-800' : 'bg-slate-200 text-slate-700';
  const nextStatus = item.status === 'new' ? 'contacted' : 'new';
  const StatusIcon = item.status === 'new' ? CheckCircle2 : RotateCcw;
  const actionClass =
    item.status === 'new'
      ? 'border-sky-700 bg-sky-700 text-white hover:bg-sky-800 hover:border-sky-800'
      : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50';

  return (
    <article className="grid gap-4 border-b border-slate-200 bg-white p-4 last:border-b-0 xl:grid-cols-[minmax(14rem,1.4fr)_minmax(18rem,1.8fr)_auto] xl:items-start">
      <div className="min-w-0">
        <h2 className="truncate font-serif text-xl font-semibold text-slate-900">{item.name}</h2>
        <p className="mt-1 text-sm text-slate-500">
          {new Date(item.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge className={roleClass}>{item.role}</Badge>
          <Badge className={intentClass}>{item.intent === 'walkthrough' ? 'Walkthrough' : 'Overview'}</Badge>
          <Badge className={statusClass}>{item.status === 'new' ? 'New' : 'Contacted'}</Badge>
        </div>
      </div>

      <dl className="grid min-w-0 gap-3 md:grid-cols-2">
        <div>
          <dt className="admin-muted flex items-center gap-1.5 font-semibold">
            <Mail className="h-4 w-4" aria-hidden="true" />
            Email
          </dt>
          <dd>
            <a className="break-all font-semibold text-sky-800 underline decoration-sky-300 underline-offset-4" href={`mailto:${item.email}`}>
              {item.email}
            </a>
          </dd>
        </div>
        <div>
          <dt className="admin-muted flex items-center gap-1.5 font-semibold">
            <School className="h-4 w-4" aria-hidden="true" />
            Parish or school
          </dt>
          <dd className="text-slate-800">{item.parish}</dd>
        </div>
        {item.note ? <dd className="rounded-lg bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 md:col-span-2">{item.note}</dd> : null}
      </dl>

      <div className="flex xl:justify-end">
        <button
          type="button"
          onClick={() => onStatus(item.id, nextStatus)}
          className={`inline-flex min-h-9 min-w-28 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-bold leading-none shadow-sm transition-colors ${actionClass}`}
        >
          <StatusIcon className="h-4 w-4" aria-hidden="true" />
          {item.status === 'new' ? 'Mark contacted' : 'Mark new'}
        </button>
      </div>
    </article>
  );
}

function Badge({ className, children }) {
  return <span className={`badge-ui ${className}`}>{children}</span>;
}

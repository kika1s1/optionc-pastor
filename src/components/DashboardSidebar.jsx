import { Link } from 'react-router-dom';

const ITEMS = [
  { id: 'all', label: 'All inquiries' },
  { id: 'new', label: 'New' },
  { id: 'overview', label: 'Overviews' },
  { id: 'walkthrough', label: 'Walkthroughs' },
  { id: 'contacted', label: 'Contacted' },
];

export function DashboardSidebar({ filter, section, counts, user, onFilter, onOpenProfile }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <div className="border-b border-slate-200 px-5 py-6">
        <p className="font-serif text-3xl font-semibold tracking-tight text-slate-900">
          Option<span className="text-amber-600">C</span>
        </p>
        <p className="mt-1 text-base font-semibold text-slate-500">Parish desk</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5" aria-label="Inquiry lists">
        {ITEMS.map((item) => {
          const active = section !== 'profile' && filter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-current={active ? 'page' : undefined}
              onClick={() => onFilter(item.id)}
              className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-lg font-semibold ${
                active
                  ? 'bg-sky-100 text-sky-900 shadow-[inset_4px_0_0_0_#0284c7]'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{item.label}</span>
              <span
                className={`min-w-8 rounded-md px-2 py-0.5 text-center text-base ${
                  active ? 'bg-white text-sky-800' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {counts[item.id] ?? 0}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-4">
        {user ? (
          <button
            type="button"
            onClick={onOpenProfile}
            className={`mb-3 w-full rounded-xl px-4 py-3 text-left ${
              section === 'profile' ? 'bg-sky-100 shadow-[inset_4px_0_0_0_#0284c7]' : 'bg-sky-50 hover:bg-sky-100'
            }`}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-amber-700">Your profile</p>
            <p className="truncate font-serif text-xl font-semibold text-slate-900">{user.name}</p>
            <p className="truncate text-base font-semibold text-sky-800">{user.role}</p>
          </button>
        ) : null}
        <Link to="/" className="block rounded-xl px-4 py-3 text-lg font-semibold text-sky-800 hover:bg-sky-50">
          View public site
        </Link>
      </div>
    </div>
  );
}

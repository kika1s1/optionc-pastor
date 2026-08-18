import { Link } from 'react-router-dom';
import { Circle, ClipboardList, Eye, LayoutDashboard, LogOut, Send } from 'lucide-react';

const ITEMS = [
  { id: 'all', label: 'All inquiries', icon: LayoutDashboard },
  { id: 'new', label: 'New', icon: Circle },
  { id: 'overview', label: 'Overviews', icon: Send },
  { id: 'walkthrough', label: 'Walkthroughs', icon: ClipboardList },
  { id: 'contacted', label: 'Contacted', icon: Eye },
];

export function DashboardSidebar({ filter, section, counts, user, onFilter, onOpenProfile }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <div className="border-b border-slate-200 px-4 py-5">
        <p className="font-serif text-2xl font-semibold tracking-tight text-slate-900">
          Option<span className="text-amber-600">C</span>
        </p>
        <p className="mt-1 text-sm font-semibold text-slate-500">Parish desk</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4" aria-label="Inquiry lists">
        {ITEMS.map((item) => {
          const active = section !== 'profile' && filter === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              aria-current={active ? 'page' : undefined}
              onClick={() => onFilter(item.id)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-bold ${
                active
                  ? 'bg-sky-50 text-sky-900 shadow-[inset_3px_0_0_0_#0284c7]'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex min-w-0 items-center gap-2">
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{item.label}</span>
              </span>
              <span
                className={`min-w-7 rounded-md px-2 py-0.5 text-center text-xs ${
                  active ? 'bg-white text-sky-800' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {counts[item.id] ?? 0}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-3">
        {user ? (
          <button
            type="button"
            onClick={onOpenProfile}
            className={`mb-2 w-full rounded-lg px-3 py-3 text-left ${
              section === 'profile' ? 'bg-sky-50 shadow-[inset_3px_0_0_0_#0284c7]' : 'bg-slate-50 hover:bg-sky-50'
            }`}
          >
            <p className="section-kicker">Your profile</p>
            <p className="mt-1 truncate font-serif text-lg font-semibold text-slate-900">{user.name}</p>
            <p className="truncate text-sm font-semibold text-sky-800">{user.role}</p>
          </button>
        ) : null}
        <Link to="/" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold text-sky-800 hover:bg-sky-50">
          <LogOut className="h-4 w-4" aria-hidden="true" />
          View public site
        </Link>
      </div>
    </div>
  );
}

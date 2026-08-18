import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { initials } from '../lib/user.js';

export function ProfileMenu({ user, onEditProfile, onSignOut }) {
  const mark = initials(user.name);
  const [open, setOpen] = useState(false);
  const root = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    function onPointerDown(event) {
      if (root.current && !root.current.contains(event.target)) setOpen(false);
    }

    function onKeyDown(event) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="btn-anim flex items-center gap-3 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-4 hover:border-sky-200 hover:bg-sky-50"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-800 font-serif text-lg font-semibold text-white">
          {mark}
        </span>
        <span className="hidden text-left sm:block">
          <span className="block text-base font-semibold leading-tight text-slate-900">{user.name}</span>
          <span className="block text-sm font-medium leading-tight text-slate-500">{user.role}</span>
        </span>
        <span className={`chevron text-slate-400 ${open ? 'chevron-open' : ''}`} aria-hidden="true">
          ▾
        </span>
      </button>

      {open ? (
        <div
          role="menu"
          className="menu-in absolute right-0 z-50 mt-3 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg"
        >
          <div className="border-b border-slate-100 bg-sky-50 px-5 py-5">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-800 font-serif text-2xl font-semibold text-white">
                {mark}
              </span>
              <div>
                <p className="font-serif text-2xl font-semibold text-slate-900">{user.name}</p>
                <p className="text-base font-semibold text-sky-800">{user.role}</p>
              </div>
            </div>
            <p className="mt-3 truncate text-base text-slate-600">{user.email}</p>
          </div>
          <div className="p-2">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onEditProfile();
              }}
              className="block w-full rounded-xl px-4 py-3 text-left text-lg font-semibold text-slate-800 hover:bg-slate-50"
            >
              Edit profile
            </button>
            <Link
              role="menuitem"
              to="/"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 text-lg font-semibold text-slate-800 hover:bg-slate-50"
            >
              View public site
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onSignOut();
              }}
              className="block w-full rounded-xl px-4 py-3 text-left text-lg font-semibold text-rose-700 hover:bg-rose-50"
            >
              Sign out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

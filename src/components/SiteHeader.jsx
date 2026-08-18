import { useState } from 'react';

const LINKS = [
  { href: '#problem', label: 'The problem' },
  { href: '#platform', label: 'What runs on it' },
  { href: '#parishes', label: 'Multiple parishes' },
  { href: '#start', label: 'Getting started' },
];

export function SiteHeader({ onWalkthrough }) {
  const [open, setOpen] = useState(false);

  function close() {
    setOpen(false);
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="font-serif text-3xl font-semibold tracking-tight text-slate-900">
          Option<span className="text-amber-600">C</span>
        </a>
        <div className="hidden items-center gap-8 lg:flex">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="nav-link text-lg font-semibold text-slate-700 hover:text-sky-800">
              {link.label}
            </a>
          ))}
          <a href="#overview" className="btn-anim rounded-lg bg-amber-600 px-5 py-3 text-lg font-semibold text-white hover:bg-amber-500">
            Send me the overview
          </a>
        </div>
        <button
          type="button"
          className="rounded-lg border border-slate-300 px-4 py-2 text-lg font-semibold text-slate-800 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </button>
      </div>
      {open ? (
        <div id="mobile-menu" className="menu-in border-t border-slate-200 bg-white px-5 py-5 lg:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 text-xl font-semibold">
            {LINKS.map((link) => (
              <a key={link.href} href={link.href} className="rounded-lg px-2 py-2 text-slate-800 hover:bg-sky-50" onClick={close}>
                {link.label}
              </a>
            ))}
            <a href="#overview" className="btn-anim mt-2 rounded-lg bg-amber-600 px-5 py-3 text-center text-white" onClick={close}>
              Send me the overview
            </a>
            {onWalkthrough ? (
              <a
                href="#overview"
                className="text-center text-sky-800"
                onClick={() => {
                  onWalkthrough();
                  close();
                }}
              >
                Request a walkthrough
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </nav>
  );
}

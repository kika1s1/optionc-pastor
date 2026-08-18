import { useState } from 'react';
import { Menu, X } from 'lucide-react';

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
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-[0_1px_8px_rgb(15_23_42_/_0.04)] backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="font-serif text-2xl font-semibold tracking-tight text-slate-900">
          Option<span className="text-amber-600">C</span>
        </a>
        <div className="hidden items-center gap-7 lg:flex">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="nav-link text-base font-semibold text-slate-700 hover:text-sky-800">
              {link.label}
            </a>
          ))}
          <a href="#overview" className="btn-primary">
            Send me the overview
          </a>
        </div>
        <button
          type="button"
          className="icon-button border border-slate-300 text-slate-800 hover:bg-slate-50 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          <span className="sr-only">Menu</span>
        </button>
      </div>
      {open ? (
        <div id="mobile-menu" className="menu-in border-t border-slate-200 bg-white px-5 py-5 lg:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 text-base font-semibold">
            {LINKS.map((link) => (
              <a key={link.href} href={link.href} className="rounded-lg px-3 py-2.5 text-slate-800 hover:bg-sky-50" onClick={close}>
                {link.label}
              </a>
            ))}
            <a href="#overview" className="btn-primary mt-2" onClick={close}>
              Send me the overview
            </a>
            {onWalkthrough ? (
              <a
                href="#overview"
                className="btn-secondary"
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

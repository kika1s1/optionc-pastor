export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white py-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="font-serif text-3xl font-semibold text-slate-900">
          Option<span className="text-amber-600">C</span>
        </p>
        <p className="mt-6 max-w-4xl text-xl leading-8 text-slate-600">
          Founded in 2004, in answer to St. John Paul II's summons to the whole Church to cross the threshold of the
          Internet — a new forum where the young, as he wrote, increasingly turn to cyberspace as their window on the
          world. OptionC works exclusively with Catholic parishes and schools, teaching and reinforcing the faith
          through technology built for the Church.
        </p>
        <p className="mt-6 text-lg font-semibold uppercase tracking-[0.16em] text-amber-700">
          Faith · Stewardship · Community · Innovation
        </p>
        <div className="mt-10 flex flex-col justify-between gap-4 border-t border-slate-200 pt-8 text-lg text-slate-600 sm:flex-row">
          <p>© 2026 OptionC. All rights reserved.</p>
          <p className="flex flex-wrap gap-x-3">
            <a className="text-sky-800 underline decoration-sky-300 underline-offset-4" href="mailto:CatholicInnovation@OptionC.com">
              CatholicInnovation@OptionC.com
            </a>
            <span>·</span>
            <a className="text-sky-800 underline decoration-sky-300 underline-offset-4" href="tel:+18558228418">
              855.822.8418
            </a>
            <span>·</span>
            <a className="text-sky-800 underline decoration-sky-300 underline-offset-4" href="https://optionc.com" target="_blank" rel="noreferrer">
              optionc.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

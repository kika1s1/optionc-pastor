import { useEffect, useState } from 'react';
import { InquiryForm } from '../components/InquiryForm.jsx';
import { Reveal } from '../components/Reveal.jsx';
import { SiteFooter } from '../components/SiteFooter.jsx';
import { SiteHeader } from '../components/SiteHeader.jsx';
import { FAQS, PRINCIPAL_POINTS, PROBLEMS, START_TERMS } from '../lib/constants.js';

const PRODUCTS = [
  {
    name: 'Parish Management',
    tag: 'The parish office',
    body: 'Registration, sacramental history, ministries, and giving on one living family record.',
  },
  {
    name: 'School Management',
    tag: 'The school office',
    body: (
      <>
        Enrollment, tuition, grades, and attendance. Parents log in once. Administrators pull{' '}
        <strong className="font-semibold text-slate-900">NCEA reports on live, up-to-date data any time, any day</strong> — not
        once a year at reporting season.
      </>
    ),
  },
  {
    name: 'Matt Money',
    tag: 'Tuition & giving',
    patron: 'St. Matthew, patron of finance',
    body: (
      <>
        Other tuition services float your money for about <strong className="font-semibold text-slate-900">five days</strong>.
        OptionC distributes the <strong className="font-semibold text-slate-900">next business day</strong>, with no hidden
        fees. Your money is yours when families pay it, not when a processor releases it.
      </>
    ),
  },
  {
    name: 'ARC Communication',
    tag: 'Messaging & alerts',
    patron: 'Archangel Gabriel, patron of communication',
    body: (
      <>
        One message and one emergency alert to every family in your parish and your school.{' '}
        <strong className="font-semibold text-slate-900">One list, never two</strong> — and no separate alert vendor.
      </>
    ),
  },
  {
    name: 'Catholic Content',
    tag: 'Formation',
    body: (
      <>
        <strong className="font-semibold text-slate-900">1,200+ faith resources</strong> shared by your school and your faith
        formation program alike. The public school children in your parish program get the same library as the children in
        your classrooms — and their families sit on the same record as everyone else's.
      </>
    ),
  },
  {
    name: 'Vincent Volunteer',
    tag: 'Ministries & service · 2026 pilot',
    patron: 'St. Vincent de Paul, patron of charitable works and volunteers',
    body: (
      <>
        Hours log themselves — QR at the door, self-submit, or coordinator entry, all writing to the same family record.
        VIRTUS and background-check status updates automatically, and coordinators get{' '}
        <strong className="font-semibold text-slate-900">60 days' notice before a certification expires</strong> — not the
        week of the field trip. A family serving both your parish and your school uses one login, and each coordinator sees
        only their own organization's data.
      </>
    ),
  },
];

function Eyebrow({ children }) {
  return <p className="text-lg font-semibold uppercase tracking-[0.18em] text-amber-700">{children}</p>;
}

function Heading({ children, className = '' }) {
  return (
    <h2 className={`mt-4 max-w-4xl font-serif text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl ${className}`}>
      {children}
    </h2>
  );
}

export function HomePage() {
  const [intent, setIntent] = useState('overview');

  useEffect(() => {
    document.title = 'OptionC connects the family — OptionC';
    if (window.location.hash === '#walkthrough') setIntent('walkthrough');
  }, []);

  function chooseWalkthrough() {
    setIntent('walkthrough');
  }

  return (
    <div className="bg-white font-sans text-xl leading-8 text-slate-700 antialiased">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-amber-600 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <div className="h-1.5 bg-amber-500" />
      <SiteHeader onWalkthrough={chooseWalkthrough} />

      <main id="main">
        <header id="top" className="bg-gradient-to-b from-sky-50 to-white">
          <div className="mx-auto max-w-6xl px-5 pb-20 pt-16 sm:px-8 sm:pt-20">
            <p className="hero-in mb-6 text-lg font-semibold uppercase tracking-[0.18em] text-amber-700">Parish and school · Since 2004</p>
            <h1 className="hero-in-delay max-w-5xl font-serif text-4xl font-semibold leading-[1.15] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl xl:text-7xl">
              Your school knows the student.
              <br />
              Your parish knows the parishioner.
              <br />
              <span className="text-sky-800">OptionC connects the family.</span>
            </h1>
            <p className="hero-in-late mt-6 max-w-3xl text-xl leading-8 text-slate-600 sm:mt-8 sm:text-2xl sm:leading-9 lg:text-3xl lg:leading-10">
              Bring your school, parish, and faith formation records together in real time. Eliminate triple data entry,
              unite your staff, and get a complete, unified picture of every family you serve.
            </p>
            <div className="hero-in-late mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
              <a href="#overview" className="btn-anim rounded-lg bg-amber-600 px-8 py-4 text-center text-xl font-semibold text-white hover:bg-amber-500">
                Send me the overview
              </a>
              <a
                href="#overview"
                className="btn-anim rounded-lg border-2 border-sky-700 px-8 py-4 text-center text-xl font-semibold text-sky-800 hover:bg-sky-50"
                onClick={chooseWalkthrough}
              >
                Request a walkthrough
              </a>
            </div>
            <p className="mt-6 text-lg font-semibold text-slate-600">
              Run the parish system, the school system, or both — synced in real time.
            </p>

            <div className="hero-in-late mt-16 rounded-2xl border border-sky-100 bg-white p-6 shadow-sm sm:p-10">
              <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto_1fr]">
                <div>
                  <p className="mb-4 text-lg font-semibold uppercase tracking-[0.16em] text-slate-500">One family, today</p>
                  <div className="space-y-4">
                    <OfficeCard office="School office" id="ID 4471" name="Dolan, Michael & Anne" meta="Enrollment · Tuition · Emergency contact" />
                    <OfficeCard office="Parish office" id="ID 1180-B" name="Dolan, M. & A." meta="Registration · Ministries · Offertory" />
                    <OfficeCard office="Faith formation" id="ID FF-92" name="Dolan family" meta="First Communion prep" />
                  </div>
                </div>
                <p className="text-center font-serif text-5xl text-amber-600 lg:px-2" aria-hidden="true">
                  →
                </p>
                <div>
                  <p className="mb-4 text-lg font-semibold uppercase tracking-[0.16em] text-slate-500">One family, on OptionC</p>
                  <article className="rounded-xl border-2 border-amber-400 bg-amber-50 px-6 py-7">
                    <div className="flex justify-between text-base font-semibold text-amber-800">
                      <span>Parish & school</span>
                      <span>Synced live</span>
                    </div>
                    <h3 className="mt-2 font-serif text-3xl font-semibold text-slate-900">Dolan, Michael & Anne</h3>
                    <p className="text-lg text-slate-700">Registered 2019 · Two children enrolled</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {['Enrollment', 'Sacraments', 'Giving', 'Attendance', 'Formation', 'Alerts'].map((chip) => (
                        <span key={chip} className="rounded-md bg-white px-3 py-1.5 text-base font-semibold text-sky-800">
                          {chip}
                        </span>
                      ))}
                    </div>
                  </article>
                </div>
              </div>
              <p className="mt-8 max-w-4xl text-xl leading-8 text-slate-600">
                Your secretary registers the Dolans at the parish. Your school office enters them again at enrollment. Faith
                formation enters them a third time for First Communion. Three of those numbers belong to the same family.
                Nobody in your parish can see all three at once.
              </p>
            </div>
          </div>
        </header>

        <section id="problem" className="border-t border-slate-200 bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <Eyebrow>What pastors tell us</Eyebrow>
            <Heading>You already know something is being lost. You just can't see where.</Heading>
            <div className="mt-14 space-y-12">
              {PROBLEMS.map((item, index) => (
                <Reveal key={item.num} delay={index * 70}>
                  <article className="grid gap-5 border-t border-slate-200 pt-10 sm:grid-cols-[4rem_1fr]">
                    <p className="font-serif text-4xl font-semibold text-amber-600">{item.num}</p>
                    <div>
                      <h3 className="font-serif text-3xl font-semibold text-slate-900">{item.title}</h3>
                      <p className="mt-4 max-w-4xl text-xl leading-8 text-slate-600">{item.body}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-sky-100 bg-sky-50 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <Eyebrow>Why not the system the public school runs</Eyebrow>
            <Heading>What your parish runs on teaches something, whether you intend it to or not.</Heading>
            <p className="mt-8 max-w-3xl text-2xl leading-9 text-slate-600">
              A general-purpose platform would work. It would also open every morning on a login box.
            </p>
            <p className="mt-6 max-w-3xl text-2xl leading-9 text-slate-600">
              OptionC opens on the Church. Before a pastor sees his parish rolls, a principal her classrooms, or a parent
              his giving history, the screen begins with prayer and sacred beauty drawn from the treasury of the Church.
              Catholic content isn't a module bolted on the side. It's the first thing anyone sees, every day.
            </p>
            <Reveal>
            <blockquote className="mt-14 max-w-4xl border-l-4 border-amber-500 bg-white px-8 py-10 shadow-sm">
              <p className="font-serif text-2xl italic leading-9 text-slate-800 sm:text-3xl sm:leading-10">
                “OptionC has been a true blessing for our parish and school community. It's not just a software platform —
                it's a daily tool for evangelization that keeps our families immersed in the beauty and rhythm of the
                Catholic faith. Every log-in is an opportunity for formation. Every family touchpoint is a chance to
                encounter Christ.”
              </p>
              <footer className="mt-8">
                <p className="text-xl font-semibold text-slate-900">Fr. Joseph Okonski</p>
                <p className="text-lg text-slate-600">Pastor, St. Athanasius Parish · Archdiocese of Philadelphia</p>
              </footer>
            </blockquote>
            </Reveal>
          </div>
        </section>

        <section id="platform" className="border-t border-slate-200 bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <Eyebrow>What runs on the record</Eyebrow>
            <Heading>Not a roadmap. Software Catholic parishes and schools are running today.</Heading>
            <div className="mt-14 divide-y divide-slate-200 border-y border-slate-200">
              {PRODUCTS.map((product) => (
                <Reveal key={product.name}>
                <article className="grid gap-4 py-10 lg:grid-cols-[18rem_1fr] lg:gap-12">
                  <div>
                    <h3 className="font-serif text-3xl font-semibold text-slate-900">{product.name}</h3>
                    <p className="mt-2 text-lg font-semibold text-amber-700">{product.tag}</p>
                    {product.patron ? <p className="mt-2 text-lg text-slate-500">{product.patron}</p> : null}
                  </div>
                  <p className="text-xl leading-8 text-slate-600">{product.body}</p>
                </article>
                </Reveal>
              ))}
            </div>
            <p className="mt-10 font-serif text-2xl italic text-sky-800">
              The same family underneath all of it. Enter them once, on whichever side you run.
            </p>
          </div>
        </section>

        <section id="parishes" className="border-t border-amber-100 bg-amber-50 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <Eyebrow>One school, more than one parish</Eyebrow>
            <Heading>Three parishes support your school. Nobody can prove which families come from where.</Heading>
            <p className="mt-8 max-w-3xl text-2xl leading-9 text-slate-600">
              Most systems assume one parish and one school. Yours doesn't work that way — and the subsidy conversation
              every spring proves it. Each pastor believes he is carrying more than his share. Nobody can show otherwise,
              because the numbers don't exist in a form all four of you can read.
            </p>
            <p className="mt-6 max-w-3xl text-2xl font-semibold leading-9 text-sky-800">
              OptionC tracks every school family to its home parish.
            </p>
            <ul className="mt-10 max-w-3xl space-y-5 text-xl leading-8 text-slate-700">
              <li className="flex gap-3">
                <span className="mt-1 text-amber-600" aria-hidden="true">✦</span>
                <span>The principal sees one roster — the whole school, in one place</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 text-amber-600" aria-hidden="true">✦</span>
                <span>Each pastor sees his own parishioners inside it, and only his own</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 text-amber-600" aria-hidden="true">✦</span>
                <span>Subsidy conversations start from the same numbers instead of estimates</span>
              </li>
            </ul>
            <a href="#overview" className="btn-anim mt-12 inline-block rounded-lg bg-amber-600 px-8 py-4 text-xl font-semibold text-white hover:bg-amber-500">
              Send me the overview
            </a>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <Eyebrow>For your principal</Eyebrow>
            <Heading>The same record, answering her questions instead of yours.</Heading>
            <div className="mt-14 grid gap-6 md:grid-cols-2">
              {PRINCIPAL_POINTS.map((item, index) => (
                <Reveal key={item.title} delay={index * 60}>
                <article className="card-anim rounded-2xl border border-slate-200 bg-slate-50 p-8">
                  <h3 className="font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">{item.title}</h3>
                  <p className="mt-4 text-xl leading-8 text-slate-600">{item.body}</p>
                </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-stone-50 py-20 sm:py-24">
          <div className="mx-auto max-w-4xl px-5 sm:px-8">
            <Eyebrow>The honest part</Eyebrow>
            <Heading>Every parish we talk to is short-staffed.</Heading>
            <p className="mt-8 text-2xl leading-9 text-slate-600">
              A new system that costs your secretary her Tuesdays is not a gift, whatever it promises. So a walkthrough
              doesn't start with a demo. It starts by mapping what your parish and your school run today — what would
              change, what would stay, and what it would take from your office to get there. If the answer doesn't work
              for you, you'll know in the first half hour.
            </p>
            <p className="mt-6 text-2xl leading-9 text-slate-700">
              <strong className="font-semibold text-slate-900">Your parish and school own your records.</strong> OptionC is
              the steward of your data, never the owner of it. If you ever leave, your records leave with you.
            </p>
          </div>
        </section>

        <section id="start" className="border-t border-sky-100 bg-sky-50 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <Eyebrow>Getting started</Eyebrow>
            <Heading>Start with your parish, your school, or both.</Heading>
            <div className="mt-8 max-w-3xl space-y-6 text-2xl leading-9 text-slate-600">
              <p>
                A parish system and a school system don't talk to each other. Not overnight, not on a schedule, not at all
                — which is why the same family gets entered twice and drifts apart from there.
              </p>
              <p>
                OptionC's parish system and school system sync in real time on the same family. An address entered at the
                school desk is the address the parish office sees, immediately. Each one also stands on its own — a parish
                with no school, or a school whose parish isn't ready yet, runs perfectly well alone. The day the other
                joins, the family is already there.
              </p>
              <p>Nothing about starting requires a committee or a pilot year. It's your decision and your timeline.</p>
            </div>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {START_TERMS.map((term, index) => (
                <Reveal key={term.title} delay={index * 60}>
                <article className="card-anim rounded-2xl border border-sky-100 bg-white p-7">
                  <h3 className="font-serif text-3xl font-semibold text-sky-800">{term.title}</h3>
                  <p className="mt-3 text-lg leading-7 text-slate-600">{term.body}</p>
                </article>
                </Reveal>
              ))}
            </div>
            <p className="mt-10 max-w-3xl text-xl leading-8 text-slate-600">
              A half-hour walkthrough uses your own families, not a demo account — one family as both offices see them
              today, and as they'd look on one record.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <a href="#overview" className="btn-anim rounded-lg bg-amber-600 px-8 py-4 text-center text-xl font-semibold text-white hover:bg-amber-500">
                Send me the overview
              </a>
              <a
                href="#overview"
                className="btn-anim rounded-lg border-2 border-sky-700 px-8 py-4 text-xl font-semibold text-sky-800 hover:bg-white"
                onClick={chooseWalkthrough}
              >
                Request a walkthrough
              </a>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <Eyebrow>Questions pastors ask</Eyebrow>
            <Heading>The short answers.</Heading>
            <div className="mt-12 max-w-4xl divide-y divide-slate-200 border-y border-slate-200">
              {FAQS.map((item) => (
                <details key={item.q} className="group py-6">
                  <summary className="cursor-pointer list-none text-2xl font-semibold text-slate-900">
                    <span className="flex items-center justify-between gap-6">
                      {item.q}
                      <span className="text-3xl font-normal text-amber-600 group-open:hidden">+</span>
                      <span className="hidden text-3xl font-normal text-amber-600 group-open:inline">–</span>
                    </span>
                  </summary>
                  <p className="mt-4 text-xl leading-8 text-slate-600">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="overview" className="border-t border-slate-200 bg-stone-50 py-16 sm:py-24">
          <div className="mx-auto grid max-w-6xl items-start gap-8 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_minmax(0,32rem)]">
            <div>
              <Eyebrow>Next step</Eyebrow>
              <h2 id="walkthrough" className="mt-3 font-serif text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Send me the overview.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-600 sm:mt-6 sm:text-xl sm:leading-8 lg:text-2xl lg:leading-9">
                A short PDF you can read Saturday and forward to your business manager on Monday. No call required.
              </p>
              <p className="mt-4 text-lg leading-8 text-slate-600 sm:text-xl sm:leading-8 lg:text-2xl lg:leading-9">
                Prefer to talk? Ask for a walkthrough instead and we'll show you one of your own families as both offices
                see them today — and as they'd look on one record.
              </p>
              <div className="mt-8 space-y-3">
                <a
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-base font-semibold text-sky-800 hover:border-sky-200 hover:bg-sky-50 sm:text-lg"
                  href="mailto:CatholicInnovation@OptionC.com"
                >
                  <MailIcon />
                  <span className="break-all">CatholicInnovation@OptionC.com</span>
                </a>
                <a
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-base font-semibold text-sky-800 hover:border-sky-200 hover:bg-sky-50 sm:text-lg"
                  href="tel:+18558228418"
                >
                  <PhoneIcon />
                  <span>855.822.8418</span>
                </a>
              </div>
            </div>
            <Reveal>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
                <InquiryForm intent={intent} onIntent={setIntent} />
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function MailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6 shrink-0" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m4 7 8 6 8-6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6 shrink-0" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 3.75h3.2l1.1 3.3-2 1.4a12.5 12.5 0 0 0 6.75 6.75l1.4-2 3.3 1.1v3.2a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 6a2 2 0 0 1 2-2.25Z" />
    </svg>
  );
}

function OfficeCard({ office, id, name, meta }) {
  return (
    <article className="card-anim rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
      <div className="flex justify-between text-base font-semibold text-slate-500">
        <span>{office}</span>
        <span className="text-rose-700">{id}</span>
      </div>
      <h3 className="mt-1 font-serif text-2xl font-semibold text-slate-900">{name}</h3>
      <p className="text-lg text-slate-600">{meta}</p>
    </article>
  );
}

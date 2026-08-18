import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Church,
  Clock3,
  DatabaseZap,
  Mail,
  Phone,
  School,
  ShieldCheck,
  UsersRound,
} from 'lucide-react';
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
  return <p className="section-kicker">{children}</p>;
}

function Heading({ children, className = '' }) {
  return (
    <h2 className={`display-heading mt-4 max-w-4xl text-3xl sm:text-4xl lg:text-5xl ${className}`}>
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
    <div className="bg-white font-sans text-base leading-7 text-slate-700 antialiased">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-amber-600 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <SiteHeader onWalkthrough={chooseWalkthrough} />

      <main id="main">
        <header id="top" className="bg-[#f7f8fa]">
          <div className="mx-auto max-w-7xl px-5 pb-16 pt-14 sm:px-8 sm:pt-16 lg:pb-20">
            <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
              <div>
              <p className="hero-in section-kicker mb-5">Parish and school · Since 2004</p>
              <h1 className="hero-in-delay display-heading max-w-5xl text-4xl sm:text-5xl lg:text-6xl">
                Your school knows the student. Your parish knows the parishioner.{' '}
                <span className="text-sky-800">OptionC connects the family.</span>
              </h1>
              <p className="hero-in-late mt-6 max-w-3xl text-lg leading-8 text-slate-600">
                Bring your school, parish, and faith formation records together in real time. Eliminate triple data entry,
                unite your staff, and get a complete, unified picture of every family you serve.
              </p>
              <div className="hero-in-late mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a href="#overview" className="btn-primary">
                  Send me the overview
                </a>
                <a href="#overview" className="btn-secondary" onClick={chooseWalkthrough}>
                  Request a walkthrough
                </a>
              </div>
              <p className="mt-5 text-base font-semibold text-slate-600">
                Run the parish system, the school system, or both — synced in real time.
              </p>
              </div>
              <div className="hero-in-late grid gap-3">
                <TrustSignal icon={Clock3} label="Since 2004" />
                <TrustSignal icon={ShieldCheck} label="You own your records" />
                <TrustSignal icon={DatabaseZap} label="Synced in real time" />
              </div>
            </div>

            <div className="hero-in-late mt-12">
              <FamilyRecordPreview />
            </div>
          </div>
        </header>

        <section id="problem" className="section-band bg-white">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <Eyebrow>What pastors tell us</Eyebrow>
            <Heading>You already know something is being lost. You just can't see where.</Heading>
            <div className="mt-12 divide-y divide-slate-200 border-y border-slate-200">
              {PROBLEMS.map((item, index) => (
                <Reveal key={item.num} delay={index * 70}>
                  <article className="grid gap-5 py-8 sm:grid-cols-[4rem_1fr]">
                    <p className="font-serif text-3xl font-semibold text-amber-700">{item.num}</p>
                    <div>
                      <h3 className="font-serif text-2xl font-semibold text-slate-900">{item.title}</h3>
                      <p className="section-copy mt-3 max-w-4xl">{item.body}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section-band bg-[#f8fafc]">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div>
            <Eyebrow>Why not the system the public school runs</Eyebrow>
            <Heading>What your parish runs on teaches something, whether you intend it to or not.</Heading>
            <p className="section-copy mt-7 max-w-3xl">
              A general-purpose platform would work. It would also open every morning on a login box.
            </p>
            <p className="section-copy mt-5 max-w-3xl">
              OptionC opens on the Church. Before a pastor sees his parish rolls, a principal her classrooms, or a parent
              his giving history, the screen begins with prayer and sacred beauty drawn from the treasury of the Church.
              Catholic content isn't a module bolted on the side. It's the first thing anyone sees, every day.
            </p>
            </div>
            <aside className="surface-flat self-start p-5">
              <p className="section-kicker">Daily formation</p>
              <div className="mt-4 space-y-4">
                <ProofPoint icon={Church} title="Church first" body="The first screen carries Catholic content before the office workflow begins." />
                <ProofPoint icon={UsersRound} title="One family" body="Parish, school, and formation share the same family record." />
              </div>
            </aside>
          </div>
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <Reveal>
            <blockquote className="surface mt-12 max-w-4xl border-l-4 border-l-amber-500 px-6 py-8 sm:px-8">
              <p className="font-serif text-xl italic leading-8 text-slate-800 sm:text-2xl sm:leading-9">
                “OptionC has been a true blessing for our parish and school community. It's not just a software platform —
                it's a daily tool for evangelization that keeps our families immersed in the beauty and rhythm of the
                Catholic faith. Every log-in is an opportunity for formation. Every family touchpoint is a chance to
                encounter Christ.”
              </p>
              <footer className="mt-6">
                <p className="text-base font-semibold text-slate-900">Fr. Joseph Okonski</p>
                <p className="text-sm text-slate-600">Pastor, St. Athanasius Parish · Archdiocese of Philadelphia</p>
              </footer>
            </blockquote>
            </Reveal>
          </div>
        </section>

        <section id="platform" className="section-band bg-white">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <Eyebrow>What runs on the record</Eyebrow>
            <Heading>Not a roadmap. Software Catholic parishes and schools are running today.</Heading>
            <div className="mt-12 divide-y divide-slate-200 border-y border-slate-200">
              {PRODUCTS.map((product) => (
                <Reveal key={product.name}>
                <article className="grid gap-4 py-7 lg:grid-cols-[16rem_1fr] lg:gap-12">
                  <div>
                    <h3 className="font-serif text-2xl font-semibold text-slate-900">{product.name}</h3>
                    <p className="mt-1 text-sm font-bold uppercase tracking-[0.12em] text-amber-700">{product.tag}</p>
                    {product.patron ? <p className="mt-2 text-sm text-slate-500">{product.patron}</p> : null}
                  </div>
                  <p className="section-copy">{product.body}</p>
                </article>
                </Reveal>
              ))}
            </div>
            <p className="mt-8 font-serif text-xl italic text-sky-800">
              The same family underneath all of it. Enter them once, on whichever side you run.
            </p>
          </div>
        </section>

        <section id="parishes" className="section-band bg-[#fbfaf8]">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div>
            <Eyebrow>One school, more than one parish</Eyebrow>
            <Heading>Three parishes support your school. Nobody can prove which families come from where.</Heading>
            <p className="section-copy mt-7 max-w-3xl">
              Most systems assume one parish and one school. Yours doesn't work that way — and the subsidy conversation
              every spring proves it. Each pastor believes he is carrying more than his share. Nobody can show otherwise,
              because the numbers don't exist in a form all four of you can read.
            </p>
            <p className="mt-5 max-w-3xl text-lg font-semibold leading-8 text-sky-800">
              OptionC tracks every school family to its home parish.
            </p>
            <ul className="mt-8 max-w-3xl space-y-4 text-base leading-7 text-slate-700">
              <li className="flex gap-3">
                <Check className="mt-1 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
                <span>The principal sees one roster — the whole school, in one place</span>
              </li>
              <li className="flex gap-3">
                <Check className="mt-1 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
                <span>Each pastor sees his own parishioners inside it, and only his own</span>
              </li>
              <li className="flex gap-3">
                <Check className="mt-1 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
                <span>Subsidy conversations start from the same numbers instead of estimates</span>
              </li>
            </ul>
            <a href="#overview" className="btn-primary mt-9">
              Send me the overview
            </a>
            </div>
            <aside className="surface-flat self-start overflow-hidden">
              <div className="border-b border-slate-200 bg-white px-5 py-4">
                <p className="section-kicker">Shared roster</p>
              </div>
              <div className="divide-y divide-slate-200">
                {['Principal', 'Pastor A', 'Pastor B', 'Pastor C'].map((label, index) => (
                  <div key={label} className="flex items-center justify-between px-5 py-4 text-sm">
                    <span className="font-semibold text-slate-800">{label}</span>
                    <span className="badge-ui bg-sky-50 text-sky-800">{index === 0 ? 'Whole school' : 'Own parish'}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="section-band bg-white">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <Eyebrow>For your principal</Eyebrow>
            <Heading>The same record, answering her questions instead of yours.</Heading>
            <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 md:grid-cols-2">
              {PRINCIPAL_POINTS.map((item, index) => (
                <Reveal key={item.title} delay={index * 60}>
                <article className="bg-white p-6">
                  <h3 className="font-serif text-xl font-semibold text-slate-900 sm:text-2xl">{item.title}</h3>
                  <p className="section-copy mt-3">{item.body}</p>
                </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section-band bg-[#f8fafc]">
          <div className="mx-auto max-w-4xl px-5 sm:px-8">
            <Eyebrow>The honest part</Eyebrow>
            <Heading>Every parish we talk to is short-staffed.</Heading>
            <p className="section-copy mt-7">
              A new system that costs your secretary her Tuesdays is not a gift, whatever it promises. So a walkthrough
              doesn't start with a demo. It starts by mapping what your parish and your school run today — what would
              change, what would stay, and what it would take from your office to get there. If the answer doesn't work
              for you, you'll know in the first half hour.
            </p>
            <p className="surface-flat mt-6 border-l-4 border-l-sky-700 p-5 text-lg leading-8 text-slate-700">
              <strong className="font-semibold text-slate-900">Your parish and school own your records.</strong> OptionC is
              the steward of your data, never the owner of it. If you ever leave, your records leave with you.
            </p>
          </div>
        </section>

        <section id="start" className="section-band bg-white">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <Eyebrow>Getting started</Eyebrow>
            <Heading>Start with your parish, your school, or both.</Heading>
            <div className="mt-7 max-w-3xl space-y-5 section-copy">
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
            <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 sm:grid-cols-2 xl:grid-cols-4">
              {START_TERMS.map((term, index) => (
                <Reveal key={term.title} delay={index * 60}>
                <article className="bg-white p-6">
                  <h3 className="font-serif text-2xl font-semibold text-sky-800">{term.title}</h3>
                  <p className="mt-3 text-base leading-7 text-slate-600">{term.body}</p>
                </article>
                </Reveal>
              ))}
            </div>
            <p className="section-copy mt-8 max-w-3xl">
              A half-hour walkthrough uses your own families, not a demo account — one family as both offices see them
              today, and as they'd look on one record.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="#overview" className="btn-primary">
                Send me the overview
              </a>
              <a
                href="#overview"
                className="btn-secondary"
                onClick={chooseWalkthrough}
              >
                Request a walkthrough
              </a>
            </div>
          </div>
        </section>

        <section className="section-band bg-[#f8fafc]">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <Eyebrow>Questions pastors ask</Eyebrow>
            <Heading>The short answers.</Heading>
            <div className="mt-10 max-w-4xl overflow-hidden rounded-lg border border-slate-200 bg-white">
              {FAQS.map((item) => (
                <details key={item.q} className="group border-b border-slate-200 last:border-b-0">
                  <summary className="cursor-pointer list-none px-5 py-5 text-lg font-semibold text-slate-900 sm:px-6">
                    <span className="flex items-center justify-between gap-6">
                      {item.q}
                      <ChevronDown className="h-5 w-5 shrink-0 text-amber-700 transition-transform group-open:rotate-180" aria-hidden="true" />
                    </span>
                  </summary>
                  <p className="section-copy px-5 pb-5 sm:px-6">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="overview" className="section-band bg-white">
          <div className="mx-auto grid max-w-6xl items-start gap-8 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_minmax(0,32rem)]">
            <div>
              <Eyebrow>Next step</Eyebrow>
              <h2 id="walkthrough" className="display-heading mt-3 text-3xl sm:text-4xl lg:text-5xl">
                Send me the overview.
              </h2>
              <p className="section-copy mt-5 sm:mt-6">
                A short PDF you can read Saturday and forward to your business manager on Monday. No call required.
              </p>
              <p className="section-copy mt-4">
                Prefer to talk? Ask for a walkthrough instead and we'll show you one of your own families as both offices
                see them today — and as they'd look on one record.
              </p>
              <div className="mt-8 space-y-3">
                <a
                  className="surface-flat flex items-center gap-3 px-4 py-3 text-base font-semibold text-sky-800 hover:border-sky-300 hover:bg-sky-50"
                  href="mailto:CatholicInnovation@OptionC.com"
                >
                  <Mail className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span className="break-all">CatholicInnovation@OptionC.com</span>
                </a>
                <a
                  className="surface-flat flex items-center gap-3 px-4 py-3 text-base font-semibold text-sky-800 hover:border-sky-300 hover:bg-sky-50"
                  href="tel:+18558228418"
                >
                  <Phone className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span>855.822.8418</span>
                </a>
              </div>
            </div>
            <Reveal>
              <div className="surface p-5 sm:p-6">
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

function TrustSignal({ icon: Icon, label }) {
  return (
    <div className="surface-flat flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-700">
      <Icon className="h-4 w-4 shrink-0 text-sky-800" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

function ProofPoint({ icon: Icon, title, body }) {
  return (
    <div className="flex gap-3">
      <span className="icon-button bg-sky-50 text-sky-800">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div>
        <p className="font-semibold text-slate-900">{title}</p>
        <p className="mt-1 text-sm leading-6 text-slate-600">{body}</p>
      </div>
    </div>
  );
}

function FamilyRecordPreview() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_24px_70px_rgb(15_23_42_/_0.12)]">
      <div className="border-b border-slate-200 bg-white px-6 py-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="font-serif text-2xl font-semibold text-slate-900">
            Option<span className="text-amber-600">C</span>
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge-ui bg-slate-100 text-slate-700">Parish & school</span>
            <span className="badge-ui bg-emerald-50 text-emerald-800">Synced live</span>
          </div>
        </div>
      </div>
      <div className="grid gap-px bg-slate-200 xl:grid-cols-[minmax(22rem,0.82fr)_minmax(0,1.18fr)]">
        <div className="bg-[#f8fafc] p-6">
          <p className="section-kicker text-slate-500">One family, today</p>
          <div className="mt-5 grid gap-3">
            <OfficeCard icon={School} office="School office" id="ID 4471" name="Dolan, Michael & Anne" meta="Enrollment · Tuition · Emergency contact" />
            <OfficeCard icon={Church} office="Parish office" id="ID 1180-B" name="Dolan, M. & A." meta="Registration · Ministries · Offertory" />
            <OfficeCard icon={UsersRound} office="Faith formation" id="ID FF-92" name="Dolan family" meta="First Communion prep" />
          </div>
        </div>
        <div className="bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="section-kicker text-slate-500">One family, on OptionC</p>
            <span className="icon-button bg-amber-50 text-amber-700 shadow-sm" aria-hidden="true">
              <ArrowRight className="h-5 w-5" />
            </span>
          </div>
          <article className="mt-5 overflow-hidden rounded-xl border border-amber-300 bg-[#fffdf2]">
            <div className="border-b border-amber-200 px-6 py-4">
              <div className="flex flex-wrap justify-between gap-3 text-sm font-semibold text-amber-800">
                <span>Parish & school</span>
                <span>Synced live</span>
              </div>
              <h3 className="mt-3 font-serif text-4xl font-semibold leading-tight text-slate-900">Dolan, Michael & Anne</h3>
              <p className="mt-1 text-lg text-slate-700">Registered 2019 · Two children enrolled</p>
            </div>
            <div className="grid gap-px bg-amber-200/70 sm:grid-cols-2 lg:grid-cols-3">
              {['Enrollment', 'Sacraments', 'Giving', 'Attendance', 'Formation', 'Alerts'].map((chip) => (
                <div key={chip} className="bg-white/80 px-4 py-3 text-sm font-bold text-sky-800">
                  {chip}
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
      <p className="border-t border-slate-200 bg-white px-6 py-5 text-base leading-7 text-slate-600">
        Your secretary registers the Dolans at the parish. Your school office enters them again at enrollment. Faith
        formation enters them a third time for First Communion. Three of those numbers belong to the same family.
        Nobody in your parish can see all three at once.
      </p>
    </div>
  );
}

function OfficeCard({ icon: Icon, office, id, name, meta }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div className="flex items-start justify-between gap-3 text-sm font-semibold text-slate-500">
        <span className="inline-flex min-w-0 items-center gap-2">
          <Icon className="h-4 w-4 text-sky-800" aria-hidden="true" />
          {office}
        </span>
        <span className="shrink-0 text-rose-700">{id}</span>
      </div>
      <h3 className="mt-2 font-serif text-2xl font-semibold text-slate-900">{name}</h3>
      <p className="mt-1 text-base leading-7 text-slate-600">{meta}</p>
    </article>
  );
}

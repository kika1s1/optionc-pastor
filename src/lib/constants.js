export const ROLES = [
  'Pastor',
  'Parochial Vicar',
  'Parish Administrator',
  'Principal',
  'President',
  'Business Manager',
  'Director of Religious Education',
  'Other',
];

export const ROLE_COLORS = {
  Pastor: 'bg-sky-100 text-sky-800',
  'Parochial Vicar': 'bg-indigo-100 text-indigo-800',
  'Parish Administrator': 'bg-cyan-100 text-cyan-800',
  Principal: 'bg-amber-100 text-amber-800',
  President: 'bg-violet-100 text-violet-800',
  'Business Manager': 'bg-emerald-100 text-emerald-800',
  'Director of Religious Education': 'bg-rose-100 text-rose-800',
  Other: 'bg-slate-100 text-slate-700',
};

export const PROBLEMS = [
  {
    num: '01',
    title: "You find out a family left when you notice they're gone.",
    body: 'A family stops coming in February. You realize in October, if at all. There is no list of the families whose Mass attendance, giving, and sacramental prep all went quiet at the same time — because those three things live in three systems that never compare notes.',
  },
  {
    num: '02',
    title: 'Your office does the same work three times.',
    body: 'Most parish offices run on one secretary and a volunteer. Every hour spent re-keying a family into a second system is an hour not spent on the funeral, the bulletin, or the person standing at the door.',
  },
  {
    num: '03',
    title: 'Your school families are strangers to your parish.',
    body: 'A non-Catholic family can drive to your campus twice a day for nine years and graduate without anyone from the parish personally inviting them to Mass or OCIA. Not from indifference — because no office ever saw them as a family the parish could reach.',
  },
];

export const PRINCIPAL_POINTS = [
  {
    title: 'She stops finding out at re-enrollment',
    body: 'The signals that a family is leaving — attendance, unpaid balances, a sibling who never applied — finally sit in one place instead of three.',
  },
  {
    title: 'Her office stops re-typing your families',
    body: 'Enrollment, emergency contacts, sacramental records. Entered once, by whichever office gets there first.',
  },
  {
    title: 'Tuition lands the next business day',
    body: "She makes payroll on your schedule rather than a processor's, instead of waiting out a five-day float on every payment.",
  },
  {
    title: 'Her alert list and yours are the same list',
    body: "When she needs every family reached in eleven minutes, nobody's number is three years old.",
  },
];

export const START_TERMS = [
  { title: 'Real time', body: 'Parish and school stay synced on the same family, the moment anything changes.' },
  { title: 'Either or both', body: 'Run the parish system, the school system, or the two together.' },
  { title: 'No hidden fees', body: "What you're quoted is what you pay. Nothing unlocked later." },
  { title: 'Since 2004', body: 'Catholic parishes and schools have run on OptionC for twenty years.' },
];

export const FAQS = [
  {
    q: 'Our school serves more than one parish. Does that work?',
    a: 'Yes. Every school family is tracked to its home parish. The principal sees one roster; each pastor sees his own parishioners inside it.',
  },
  {
    q: 'Who owns our data?',
    a: 'You do. Your parish and school always own your family records. OptionC is the steward of your data, never the owner of it. If you ever leave, your records leave with you.',
  },
  {
    q: 'What does it cost?',
    a: "Pricing is quoted for your parish and school based on size. There are no hidden fees — what you're quoted is what you pay, with nothing unlocked later.",
  },
  {
    q: 'Can we start with just the parish, or just the school?',
    a: "Yes. The parish system and the school system each run on their own, so a parish without a school — or a school whose parish isn't ready — can start alone. When both are running they sync in real time on the same family: a change entered at the school desk is what the parish office sees the moment it's saved, with nothing to export, re-key, or reconcile.",
  },
];

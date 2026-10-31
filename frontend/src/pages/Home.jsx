
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Workflow,
  Users,
  Target,
  Bell,
  ChartNoAxesCombined,
  CheckCircle2,
} from "lucide-react";

const stages = [
  { name: "New", color: "bg-sky-500" },
  { name: "Contacted", color: "bg-violet-500" },
  { name: "Qualified", color: "bg-amber-500" },
  { name: "Proposal", color: "bg-pink-500" },
  { name: "Won", color: "bg-emerald-500" },
];

const features = [
  {
    icon: Users,
    title: "Lead management",
    description:
      "Keep every prospect organized with their contact details, company, and business needs.",
  },
  {
    icon: Workflow,
    title: "Visual sales pipeline",
    description:
      "Move leads through each stage and understand exactly where every opportunity stands.",
  },
  {
    icon: Bell,
    title: "Never miss a follow-up",
    description:
      "Schedule calls, emails, and meetings so every promising lead gets the attention it needs.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Know your numbers",
    description:
      "See active leads, wins, pending follow-ups, and overdue tasks in one dashboard.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f8faff] text-[#172033]">

      {/* Navbar */}
      <header className="relative z-10 border-b border-[#e5e9f2] bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4f46e5]">
              <Workflow size={22} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#172033]">
              Lead<span className="text-[#4f46e5]">Flow</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm text-[#697386] md:flex">
            <a href="#features" className="transition hover:text-[#4f46e5]">
              Features
            </a>
            <a href="#how-it-works" className="transition hover:text-[#4f46e5]">
              How it works
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden rounded-lg px-4 py-2 text-sm font-medium text-[#475467] transition hover:text-[#4f46e5] sm:block"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-[#4f46e5] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4338ca]"
            >
              Get started <ArrowRight size={16} />
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <main>
        <section className="relative px-6 pb-24 pt-20 md:pb-32 md:pt-28">
          <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-100/70 blur-[130px]" />

          <div className="relative mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm text-[#4f46e5]">
                <Workflow size={16} />
                A smarter way to manage your sales pipeline
              </div>

              <h1 className="text-5xl font-bold leading-tight tracking-tight text-[#172033] sm:text-6xl lg:text-7xl">
                Turn every lead into your{" "}
                <span className="bg-gradient-to-r from-[#4f46e5] to-[#818cf8] bg-clip-text text-transparent">
                  next win.
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#697386]">
                Organize your prospects, track every opportunity, and stay on
                top of every follow-up — all in one simple CRM.
              </p>

              <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4f46e5] px-6 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#4338ca]"
                >
                  Start managing leads <ArrowRight size={18} />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center rounded-xl border border-[#e5e9f2] bg-white px-6 py-3.5 font-semibold text-[#344054] transition hover:border-[#4f46e5] hover:bg-indigo-50"
                >
                  Explore how it works
                </a>
              </div>
            </div>

            {/* Pipeline visual */}
            <div className="relative mx-auto mt-20 max-w-5xl">
              <div className="pointer-events-none absolute inset-0 rounded-3xl bg-indigo-100/60 blur-3xl" />

              <div className="relative rounded-3xl border border-[#e5e9f2] bg-white p-5 shadow-xl shadow-slate-200/60 md:p-8">
                <div className="mb-7 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#697386]">Your pipeline</p>
                    <h2 className="mt-1 text-xl font-semibold text-[#172033]">
                      Lead journey
                    </h2>
                  </div>
                  <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                    ● Pipeline overview
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-5">
                  {stages.map((stage, index) => (
                    <div key={stage.name} className="relative">
                      <div className="rounded-2xl border border-[#e5e9f2] bg-[#f8faff] p-4">
                        <div className="flex items-center gap-2">
                          <span className={`h-2.5 w-2.5 rounded-full ${stage.color}`} />
                          <span className="text-sm font-medium text-[#475467]">
                            {stage.name}
                          </span>
                        </div>

                        <div className="mt-6 text-3xl font-bold text-[#172033]">
                          {["12", "08", "06", "04", "09"][index]}
                        </div>

                        <div className="mt-2 text-xs text-[#98a2b3]">
                          {index === 4 ? "Closed deals" : "Active leads"}
                        </div>

                        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#e5e9f2]">
                          <div
                            className={`h-full rounded-full ${stage.color}`}
                            style={{
                              width: ["80%", "62%", "48%", "35%", "72%"][index],
                            }}
                          />
                        </div>
                      </div>

                      {index < stages.length - 1 && (
                        <ArrowRight
                          size={16}
                          className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-[#98a2b3] md:block"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#e5e9f2] bg-[#f8faff] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-[#4f46e5]">
                      <Target size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#172033]">
                        Keep the momentum
                      </p>
                      <p className="mt-1 text-xs text-[#697386]">
                        Every stage brings you closer to a win.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-emerald-600">
                    <CheckCircle2 size={17} />
                    Stay on track
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-t border-[#e5e9f2] bg-white px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4f46e5]">
                Everything in one flow
              </p>
              <h2 className="mt-4 text-3xl font-bold text-[#172033] sm:text-4xl">
                Less chasing. More closing.
              </h2>
              <p className="mt-4 leading-7 text-[#697386]">
                The essential tools your team needs to keep leads moving and
                opportunities growing.
              </p>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="rounded-2xl border border-[#e5e9f2] bg-[#f8faff] p-6 transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/50"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-[#4f46e5]">
                      <Icon size={22} />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-[#172033]">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-[#697386]">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="border-t border-[#e5e9f2] bg-[#f8faff] px-6 py-24"
        >
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4f46e5]">
                Simple by design
              </p>
              <h2 className="mt-4 text-3xl font-bold text-[#172033] sm:text-4xl">
                Your leads. One clear path.
              </h2>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-4">
              {[
                ["01", "Add a lead", "Capture a new prospect and their details."],
                ["02", "Track progress", "Move the lead through your sales stages."],
                ["03", "Follow up", "Schedule the next call, email, or meeting."],
                ["04", "Win the deal", "Turn opportunities into successful deals."],
              ].map(([number, title, description], index) => (
                <div key={number} className="relative">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-[#4f46e5]">
                      {number}
                    </span>
                    {index < 3 && (
                      <div className="hidden h-px flex-1 bg-gradient-to-r from-indigo-200 to-transparent md:block" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-[#172033]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#697386]">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white px-6 pb-24 pt-10">
          <div className="mx-auto max-w-7xl rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-blue-50 px-6 py-16 text-center sm:px-12">
            <h2 className="text-3xl font-bold text-[#172033] sm:text-4xl">
              Ready to get your leads flowing?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[#697386]">
              Bring your prospects, pipeline, and follow-ups together in
              LeadFlow.
            </p>
            <Link
              to="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#4f46e5] px-6 py-3.5 font-semibold text-white transition hover:bg-[#4338ca]"
            >
              Get started for free <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e5e9f2] bg-white px-6 py-7">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-sm text-[#697386] sm:flex-row">
          <p>© {new Date().getFullYear()} LeadFlow. Keep every lead moving.</p>
          <p>Built for teams that turn opportunities into wins.</p>
        </div>
      </footer>
    </div>
  );
}

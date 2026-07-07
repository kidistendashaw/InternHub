import Link from 'next/link'
import Layout from '@/components/layout'

export default function Home() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Gradient glow behind hero */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary opacity-10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 pt-24 pb-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary border-opacity-40 bg-primary bg-opacity-10 text-primary text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            AI-Powered Matching
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight tracking-tight">
            Find Your Perfect
            <br />
            <span className="text-primary">Internship Match</span>
          </h1>

          <p className="text-lg md:text-xl text-foreground opacity-60 mb-10 max-w-2xl mx-auto leading-relaxed">
            InternHub uses AI to match students with internships based on their skills, GPA, and
            career goals — not just keywords.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary shadow-opacity-30 hover:shadow-primary hover:shadow-opacity-50"
            >
              Get Started Free
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-neutral-mid text-foreground hover:border-primary hover:text-primary font-semibold rounded-xl transition-all"
            >
              Sign In
            </Link>
          </div>

          {/* Social proof */}
          <p className="text-foreground opacity-40 text-sm mt-8">
            Trusted by students at top universities
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-neutral-mid bg-neutral-light">
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-3 gap-4 text-center">
          {[
            { value: '500+', label: 'Internships' },
            { value: '2,000+', label: 'Students Matched' },
            { value: '95%', label: 'Match Accuracy' },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-2xl md:text-3xl font-bold text-primary">{value}</div>
              <div className="text-foreground opacity-50 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why InternHub?</h2>
          <p className="text-foreground opacity-60 max-w-xl mx-auto">
            We remove the guesswork from internship hunting with data-driven matching.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/><circle cx="18" cy="6" r="3"/><path d="M18 3v3h3"/>
                </svg>
              ),
              title: 'Smart Matching',
              desc: 'Our AI weighs your skills, GPA, year of study, and preferences to surface the best-fit opportunities.',
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
                </svg>
              ),
              title: 'Match Scores',
              desc: 'See a percentage score and plain-English reasons for every match so you know exactly why it fits.',
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8m8 4H8m2-8H8"/>
                </svg>
              ),
              title: 'One-Click Apply',
              desc: 'Apply instantly and track every application in one place — no repeated form-filling.',
            },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="group bg-neutral-light border border-neutral-mid hover:border-primary rounded-2xl p-8 transition-all hover:-translate-y-1"
            >
              <div className="w-11 h-11 bg-primary bg-opacity-15 text-primary rounded-xl flex items-center justify-center mb-5 group-hover:bg-opacity-25 transition-colors">
                {icon}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-foreground opacity-60 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-neutral-light border-y border-neutral-mid">
        <div className="max-w-5xl mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-foreground opacity-60">Three steps to your next internship</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-px bg-neutral-mid" />

            {[
              { step: '01', title: 'Build Your Profile', desc: 'Upload your resume or fill in your skills, GPA, and education. Takes 2 minutes.' },
              { step: '02', title: 'Get AI Matches', desc: 'Our algorithm scores every active internship against your profile and surfaces the top matches.' },
              { step: '03', title: 'Apply & Track', desc: 'Apply with one click. Watch your application status update in real time.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="relative text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center text-lg font-bold mx-auto mb-5 shadow-lg shadow-primary shadow-opacity-30">
                  {step}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-foreground opacity-60 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 py-24">
        <div className="relative overflow-hidden bg-primary rounded-3xl p-12 md:p-16 text-center">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white opacity-5 rounded-full" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white opacity-5 rounded-full" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to find your match?
            </h2>
            <p className="text-white opacity-80 mb-8 max-w-xl mx-auto">
              Join students who stopped scrolling job boards and started getting matched.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary hover:bg-neutral-light font-semibold rounded-xl transition-colors shadow-lg"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}

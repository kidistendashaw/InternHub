import Link from 'next/link'
import Layout from '@/components/layout'

export default function Home() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-primary opacity-10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary border-opacity-30 bg-primary bg-opacity-8 text-primary text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Smart Internship Matching
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight tracking-tight">
            Find Your Perfect
            <br />
            <span className="text-primary">Internship Match</span>
          </h1>

          <p className="text-lg text-foreground opacity-55 mb-10 max-w-xl mx-auto leading-relaxed">
            Get matched with internships tailored to your skills, GPA, and career goals — not just keywords.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-2 px-7 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all shadow-lg"
              style={{ boxShadow: '0 4px 24px rgba(139,92,246,0.35)' }}
            >
              Get Started Free
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 border border-neutral-mid text-foreground opacity-70 hover:opacity-100 hover:border-primary font-semibold rounded-xl transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-neutral-mid bg-neutral-light bg-opacity-50">
        <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-3 gap-4 text-center">
          {[
            { value: '500+', label: 'Internships' },
            { value: '2,000+', label: 'Students' },
            { value: '95%', label: 'Match Accuracy' },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-2xl md:text-3xl font-bold text-primary">{value}</div>
              <div className="text-foreground opacity-45 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-foreground mb-3">Why InternHub?</h2>
          <p className="text-foreground opacity-50 max-w-md mx-auto text-sm">
            We remove the guesswork from internship hunting.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              icon: '🎯',
              title: 'Smart Matching',
              desc: 'Your skills, GPA, and preferences are scored against every active internship to surface the best fits.',
            },
            {
              icon: '📊',
              title: 'Match Scores',
              desc: 'See a percentage score and clear reasons for every recommendation.',
            },
            {
              icon: '⚡',
              title: 'One-Click Apply',
              desc: 'Apply instantly and track every application in one place.',
            },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="group bg-neutral-light border border-neutral-mid hover:border-primary rounded-2xl p-7 transition-all hover:-translate-y-1"
            >
              <div className="text-2xl mb-4">{icon}</div>
              <h3 className="font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-foreground opacity-50 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-neutral-light border-y border-neutral-mid">
        <div className="max-w-4xl mx-auto px-6 py-24">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-foreground mb-3">How It Works</h2>
            <p className="text-foreground opacity-50 text-sm">Three steps to your next internship</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Build Your Profile', desc: 'Upload your resume or fill in your skills, GPA, and education.' },
              { step: '02', title: 'Get Matches', desc: 'Your profile is scored against every active internship.' },
              { step: '03', title: 'Apply & Track', desc: 'Apply with one click and watch your status update in real time.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-base mx-auto mb-5"
                  style={{ background: 'rgb(var(--primary))', boxShadow: '0 4px 20px rgba(139,92,246,0.3)' }}
                >
                  {step}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-foreground opacity-50 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <div
          className="relative overflow-hidden rounded-3xl p-12 md:p-16 text-center"
          style={{ background: 'linear-gradient(135deg, rgb(109,40,217) 0%, rgb(139,92,246) 100%)' }}
        >
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-white opacity-5 rounded-full" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white opacity-5 rounded-full" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to find your match?
            </h2>
            <p className="text-white opacity-75 mb-8 max-w-md mx-auto text-sm">
              Join students who stopped scrolling job boards and started getting matched.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-7 py-3 bg-white text-primary hover:bg-opacity-90 font-semibold rounded-xl transition-colors shadow-lg"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}

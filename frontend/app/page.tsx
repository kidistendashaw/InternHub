import Link from 'next/link'
import Layout from '@/components/layout'

export default function Home() {
  return (
    <Layout>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">

        {/* Animated background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl animate-gradient"
               style={{ background: 'linear-gradient(135deg, rgb(139,92,246), rgb(109,40,217), rgb(52,211,153))' }} />
          <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full opacity-10 blur-2xl"
               style={{ background: 'rgb(139,92,246)' }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center w-full">

          {/* Left — text */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-medium mb-8 animate-fade-in"
                 style={{ borderColor: 'rgba(139,92,246,0.3)', background: 'rgba(139,92,246,0.08)', color: 'rgb(var(--primary))' }}>
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Smart Internship Matching
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight mb-6 animate-fade-up opacity-0-start">
              Find Your
              <span className="block" style={{ color: 'rgb(var(--primary))' }}>Perfect Match</span>
            </h1>

            <p className="text-foreground opacity-55 text-lg leading-relaxed mb-10 max-w-lg animate-fade-up opacity-0-start delay-200">
              Get matched with internships tailored to your skills, GPA, and career goals — not just keywords.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 animate-fade-up opacity-0-start delay-300">
              <Link href="/register"
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 text-white font-semibold rounded-xl transition-all text-sm animate-pulse-glow"
                style={{ background: 'linear-gradient(135deg, rgb(var(--primary-dark)), rgb(var(--primary)))' }}>
                Get Started Free
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link href="/login"
                className="inline-flex items-center justify-center px-7 py-3.5 border border-neutral-mid text-foreground opacity-60 hover:opacity-100 hover:border-primary font-semibold rounded-xl transition-all text-sm">
                Sign In
              </Link>
            </div>

            {/* Avatars */}
            <div className="flex items-center gap-3 mt-10 animate-fade-in opacity-0-start delay-500">
              <div className="flex -space-x-2">
                {[
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
                  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face',
                  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=40&h=40&fit=crop&crop=face',
                ].map((src, i) => (
                  <img key={i} src={src} alt="student" className="w-9 h-9 rounded-full border-2 object-cover"
                       style={{ borderColor: 'rgb(var(--background))' }} />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="#FBBF24">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
                <p className="text-foreground opacity-40 text-xs">Trusted by 2,000+ students</p>
              </div>
            </div>
          </div>

          {/* Right — floating card mockup */}
          <div className="hidden lg:block relative animate-slide-right opacity-0-start delay-300">
            {/* Main card */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl animate-float"
                 style={{ boxShadow: '0 30px 80px rgba(139,92,246,0.25)' }}>
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                alt="Students working"
                className="w-full object-cover"
                style={{ height: '380px' }}
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(15,12,22,0.8) 0%, transparent 60%)' }} />

              {/* Overlay card */}
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl p-4"
                   style={{ background: 'rgba(28,22,42,0.9)', backdropFilter: 'blur(12px)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <img src="https://images.unsplash.com/photo-1556157382-97eda2d62296?w=40&h=40&fit=crop" alt="company" className="w-9 h-9 rounded-xl object-cover" />
                  <div>
                    <p className="text-foreground text-sm font-semibold">Software Engineer Intern</p>
                    <p className="text-foreground opacity-40 text-xs">Safaricom · Nairobi</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="font-bold text-lg" style={{ color: 'rgb(var(--primary))' }}>87%</p>
                    <p className="text-foreground opacity-30 text-xs">match</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {['React', 'Node.js', 'Python'].map(s => (
                    <span key={s} className="px-2 py-0.5 text-xs rounded-lg font-medium"
                          style={{ background: 'rgba(139,92,246,0.15)', color: 'rgb(var(--primary))' }}>{s}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating badge top-right */}
            <div className="absolute -top-4 -right-4 px-4 py-3 rounded-2xl shadow-lg animate-float delay-300"
                 style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)', backdropFilter: 'blur(8px)' }}>
              <p className="text-accent text-xs font-semibold">✓ Application sent</p>
            </div>

            {/* Floating badge bottom-left */}
            <div className="absolute -bottom-4 -left-4 px-4 py-3 rounded-2xl shadow-lg animate-float delay-500"
                 style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', backdropFilter: 'blur(8px)' }}>
              <p className="text-xs font-semibold" style={{ color: 'rgb(var(--primary))' }}>🎯 95% match accuracy</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────── */}
      <section className="border-y border-neutral-mid" style={{ background: 'rgba(28,22,42,0.5)' }}>
        <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-3 gap-4 text-center">
          {[
            { value: '500+', label: 'Internships' },
            { value: '2,000+', label: 'Students Matched' },
            { value: '95%', label: 'Match Accuracy' },
          ].map(({ value, label }, i) => (
            <div key={label} className={`animate-count-up opacity-0-start delay-${(i + 1) * 100}`}>
              <div className="text-2xl md:text-3xl font-bold" style={{ color: 'rgb(var(--primary))' }}>{value}</div>
              <div className="text-foreground opacity-40 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16 animate-fade-up opacity-0-start">
          <h2 className="text-3xl font-bold text-foreground mb-3">Why InternHub?</h2>
          <p className="text-foreground opacity-45 text-sm max-w-sm mx-auto">We remove the guesswork from internship hunting.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop',
              icon: '🎯', title: 'Smart Matching',
              desc: 'Your skills, GPA, and preferences are scored against every active internship.',
              delay: 'delay-100',
            },
            {
              img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
              icon: '📊', title: 'Match Scores',
              desc: 'See a percentage score and clear reasons for every recommendation.',
              delay: 'delay-200',
            },
            {
              img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=200&fit=crop',
              icon: '⚡', title: 'One-Click Apply',
              desc: 'Apply instantly and track every application in one place.',
              delay: 'delay-300',
            },
          ].map(({ img, icon, title, desc, delay }) => (
            <div key={title}
              className={`group bg-neutral-light border border-neutral-mid rounded-2xl overflow-hidden card-hover animate-fade-up opacity-0-start ${delay}`}>
              <div className="relative h-40 overflow-hidden">
                <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(28,22,42,0.8))' }} />
                <div className="absolute bottom-3 left-4 text-2xl">{icon}</div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-foreground mb-1.5">{title}</h3>
                <p className="text-foreground opacity-45 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section style={{ background: 'rgba(28,22,42,0.4)' }} className="border-y border-neutral-mid">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <div className="text-center mb-16 animate-fade-up opacity-0-start">
            <h2 className="text-3xl font-bold text-foreground mb-3">How It Works</h2>
            <p className="text-foreground opacity-45 text-sm">Three steps to your next internship</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {[
                { n: '01', title: 'Build Your Profile', desc: 'Upload your resume. We auto-extract your skills, GPA, and education in seconds.', delay: 'delay-100' },
                { n: '02', title: 'Get Your Matches', desc: 'Our algorithm scores every active internship against your profile and surfaces the best fits.', delay: 'delay-200' },
                { n: '03', title: 'Apply & Track', desc: 'One-click apply. Watch your application status update in real time.', delay: 'delay-300' },
              ].map(({ n, title, desc, delay }) => (
                <div key={n} className={`flex gap-5 animate-slide-left opacity-0-start ${delay}`}>
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-0.5"
                       style={{ background: 'linear-gradient(135deg, rgb(var(--primary-dark)), rgb(var(--primary)))', boxShadow: '0 4px 16px rgba(139,92,246,0.3)' }}>
                    {n}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                    <p className="text-foreground opacity-40 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden lg:block relative animate-slide-right opacity-0-start delay-200">
              <div className="rounded-3xl overflow-hidden"
                   style={{ boxShadow: '0 20px 60px rgba(139,92,246,0.2)' }}>
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=400&fit=crop"
                  alt="Student working"
                  className="w-full object-cover"
                  style={{ height: '360px' }}
                />
              </div>
              <div className="absolute top-6 -left-6 px-4 py-3 rounded-2xl animate-float"
                   style={{ background: 'rgba(28,22,42,0.9)', border: '1px solid rgba(139,92,246,0.25)', backdropFilter: 'blur(10px)' }}>
                <p className="text-xs text-foreground opacity-50 mb-0.5">Match Score</p>
                <p className="text-2xl font-bold" style={{ color: 'rgb(var(--primary))' }}>92%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-14 animate-fade-up opacity-0-start">
          <h2 className="text-3xl font-bold text-foreground mb-3">What Students Say</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&crop=face',
              name: 'Sara T.', role: 'CS Student, AAU',
              text: 'InternHub found me a match in 2 days. The match score explained exactly why I was a fit.',
              delay: 'delay-100',
            },
            {
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
              name: 'Abebe M.', role: 'Engineering, EiABC',
              text: 'I applied to 3 internships in 10 minutes. One click and it was done.',
              delay: 'delay-200',
            },
            {
              avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=60&h=60&fit=crop&crop=face',
              name: 'Hana K.', role: 'Business, Unity University',
              text: 'The resume upload auto-filled everything. Saved me so much time.',
              delay: 'delay-300',
            },
          ].map(({ avatar, name, role, text, delay }) => (
            <div key={name}
              className={`bg-neutral-light border border-neutral-mid rounded-2xl p-6 card-hover animate-fade-up opacity-0-start ${delay}`}>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="#FBBF24">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ))}
              </div>
              <p className="text-foreground opacity-60 text-sm leading-relaxed mb-5">&ldquo;{text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <img src={avatar} alt={name} className="w-9 h-9 rounded-full object-cover" />
                <div>
                  <p className="text-foreground text-sm font-semibold">{name}</p>
                  <p className="text-foreground opacity-35 text-xs">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl p-12 md:p-16 text-center animate-scale-in opacity-0-start"
             style={{ background: 'linear-gradient(135deg, rgb(109,40,217) 0%, rgb(139,92,246) 50%, rgb(109,40,217) 100%)', backgroundSize: '200% 200%', animation: 'gradientShift 6s ease infinite' }}>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white opacity-5 rounded-full" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white opacity-5 rounded-full" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to find your match?</h2>
            <p className="text-white opacity-70 mb-8 max-w-md mx-auto text-sm">
              Join students who stopped scrolling job boards and started getting matched.
            </p>
            <Link href="/register"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white font-semibold rounded-xl transition-colors shadow-lg text-sm"
              style={{ color: 'rgb(var(--primary-dark))' }}>
              Create Free Account →
            </Link>
          </div>
        </div>
      </section>

    </Layout>
  )
}

import Link from 'next/link'
import Layout from '@/components/layout'

export default function Home() {
  return (
    <Layout>
      <div className="bg-gradient-to-b from-neutral-light to-background">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            AI-Powered Internship Matching
          </h1>
          <p className="text-xl text-foreground opacity-75 mb-8 max-w-3xl mx-auto">
            Connect with internships tailored to your skills. Our advanced AI algorithm matches students with opportunities based on experience, skills, and career goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-3 bg-primary hover:bg-primary-dark text-background font-semibold rounded-lg transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-background font-semibold rounded-lg transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Why InternHub?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-neutral-light border border-neutral-mid rounded-xl p-8">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white font-bold mb-4">
                AI
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Smart Matching</h3>
              <p className="text-foreground opacity-75">
                Our AI analyzes your profile to find internships that match your skills and interests perfectly.
              </p>
            </div>

            <div className="bg-neutral-light border border-neutral-mid rounded-xl p-8">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white font-bold mb-4">
                📊
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Match Scores</h3>
              <p className="text-foreground opacity-75">
                See detailed compatibility scores to understand why each opportunity is a great fit for you.
              </p>
            </div>

            <div className="bg-neutral-light border border-neutral-mid rounded-xl p-8">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white font-bold mb-4">
                📄
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Easy Applications</h3>
              <p className="text-foreground opacity-75">
                Apply to internships in seconds. Keep track of all your applications in one place.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="bg-primary rounded-xl p-12 text-center">
            <h2 className="text-3xl font-bold text-background mb-4">Ready to find your next internship?</h2>
            <p className="text-background opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of students who have found their perfect internship match with InternHub.
            </p>
            <Link
              href="/register"
              className="inline-block px-8 py-3 bg-background text-primary hover:bg-neutral-light font-semibold rounded-lg transition-colors"
            >
              Start Exploring
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}

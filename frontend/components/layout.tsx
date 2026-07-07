import Header from './header'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-background">
        {children}
      </main>
      <footer className="border-t border-neutral-mid border-opacity-60 py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center text-white font-bold text-xs"
              style={{ background: 'rgb(var(--primary))' }}
            >IH</div>
            <span className="text-sm font-semibold text-foreground">InternHub</span>
          </div>
          <p className="text-foreground opacity-30 text-xs">© 2024 InternHub. All rights reserved.</p>
          <div className="flex gap-4 text-foreground opacity-30 text-xs">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Contact</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

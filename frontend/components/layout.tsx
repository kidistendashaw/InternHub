import Header from './header'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-background">
        {children}
      </main>
      <footer className="bg-neutral-light border-t border-neutral-mid py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xs">IH</div>
            <span className="text-foreground font-semibold">InternHub</span>
          </div>
          <p className="text-foreground opacity-40 text-sm">© 2024 InternHub. All rights reserved.</p>
          <div className="flex gap-5 text-foreground opacity-40 text-sm">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Contact</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

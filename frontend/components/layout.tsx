import Header from './header'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-background">
        {children}
      </main>
      <footer className="bg-neutral-light border-t border-neutral-mid py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-foreground opacity-75">
          <p>&copy; 2024 InternHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

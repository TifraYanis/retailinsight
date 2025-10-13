import "./globals.css";
import { Providers } from "./providers";
import ThemeToggle from "../components/ThemeToggle";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>RetailInsight</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Providers>
          <div className="min-h-dvh grid grid-cols-12">
            {/* Sidebar */}
            <aside className="hidden md:block col-span-2 border-r border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/60 backdrop-blur">
              <div className="p-5 space-y-6">
                <div className="text-lg font-semibold tracking-wide">RetailInsight</div>
                <nav className="space-y-2 text-sm">
                  <a className="block nav-link" href="/">Dashboard</a>
                  <a className="block nav-link" href="/insights">Insights</a>
                  <a className="block nav-link" href="/map">Stores Map</a>
                </nav>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  by <a className="underline" href="https://github.com/TifraYanis" target="_blank">Tifra Yanis</a>
                </div>
              </div>
            </aside>

            {/* Main */}
            <main className="col-span-12 md:col-span-10">
              <header className="border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/60 backdrop-blur">
                <div className="container flex flex-wrap items-center justify-between py-3 gap-3">
                  <div>
                    <div className="text-2xl md:text-3xl font-semibold">
                      Sales <span className="text-emerald-500">Forecasting</span> Dashboard
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      RetailInsight — Next.js + FastAPI
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a className="btn" href="http://localhost:8000/docs" target="_blank" rel="noreferrer">API Docs</a>
                    <ThemeToggle />
                  </div>
                </div>
              </header>
              <div className="container py-6">{children}</div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}

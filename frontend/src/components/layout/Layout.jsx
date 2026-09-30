import { Header } from './Header';

/**
 * Main layout wrapper with sticky Header and scrollable content area
 */
export function Layout({ children, isDark, toggleTheme, stats }) {
  return (
    <div className="min-h-screen transition-colors duration-500">
      <Header isDark={isDark} toggleTheme={toggleTheme} stats={stats} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}

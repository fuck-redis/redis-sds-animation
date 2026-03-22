import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-slate-500">
            Redis SDS (Simple Dynamic String) 可视化教学网站
          </p>
        </div>
      </footer>
    </div>
  );
}

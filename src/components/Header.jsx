import { useState } from "react";
import { Menu, ChevronDown, X } from "lucide-react";
import useUser from "@/utils/useUser";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { data: user } = useUser();

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#2563EB] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center space-x-2 text-xl sm:text-2xl font-bold font-jetbrains-mono"
        >
          <span className="text-2xl">🎓</span>
          <span>Next Idiomas</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          <a
            href="/student/portal"
            className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors font-medium font-jetbrains-mono border border-white/40"
          >
            Portal do Aluno
          </a>
          <a
            href="/account/signin"
            className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors font-medium font-jetbrains-mono"
          >
            Login
          </a>
          <a
            href="/account/signup"
            className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors font-medium font-jetbrains-mono"
          >
            Cadastro
          </a>
          <a
            href="/secretary/students"
            className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors font-medium font-jetbrains-mono"
          >
            Secretaria
          </a>
          <a
            href="/teachers/classes"
            className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors font-medium font-jetbrains-mono"
          >
            Professores
          </a>
          <a
            href="/admin/users"
            className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors font-medium font-jetbrains-mono"
          >
            Administração
          </a>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-1 text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#262626] border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-4 space-y-3">
            <a
              href="/dashboard"
              className="block py-2 text-gray-700 dark:text-gray-300 font-jetbrains-mono"
            >
              Início
            </a>
            {user && (
              <>
                <a
                  href="/admin/users"
                  className="block py-2 text-gray-700 dark:text-gray-300 font-jetbrains-mono"
                >
                  Administração
                </a>
                <a
                  href="/secretary/students"
                  className="block py-2 text-gray-700 dark:text-gray-300 font-jetbrains-mono"
                >
                  Secretaria
                </a>
                <a
                  href="/teachers/classes"
                  className="block py-2 text-gray-700 dark:text-gray-300 font-jetbrains-mono"
                >
                  Professores
                </a>
              </>
            )}
            {!user && (
              <a
                href="/account/signin"
                className="block py-2 text-gray-700 dark:text-gray-300 font-jetbrains-mono"
              >
                Login
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

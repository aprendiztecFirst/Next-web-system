import { useState } from "react";
import Header from "@/components/Header";
import useUser from "@/utils/useUser";
import { User, Mail, Key, LogOut } from "lucide-react";

export default function DashboardPage() {
  const { data: user, loading } = useUser();
  const [profile, setProfile] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1E1E1E] flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400 font-jetbrains-mono">
          Carregando...
        </p>
      </div>
    );
  }

  if (!user) {
    if (typeof window !== "undefined") {
      window.location.href = "/account/signin";
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1E1E1E]">
      <Header />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8 font-jetbrains-mono">
            Início
          </h1>

          {/* User Profile Card */}
          <div className="bg-white dark:bg-[#262626] rounded-2xl shadow-lg dark:ring-1 dark:ring-gray-700 p-8 mb-8">
            <div className="flex items-center space-x-6 mb-8">
              {/* User Photo */}
              <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <User size={48} className="text-gray-600 dark:text-gray-300" />
              </div>

              {/* User Info */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1 font-jetbrains-mono">
                  {user.name || "Usuário"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => alert("Funcionalidade em desenvolvimento")}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-jetbrains-mono"
              >
                <Mail size={20} />
                <span>Verificar Email</span>
              </button>

              <button
                onClick={() => alert("Funcionalidade em desenvolvimento")}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-jetbrains-mono"
              >
                <Key size={20} />
                <span>Alterar Senha</span>
              </button>

              <a
                href="/account/logout"
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors font-jetbrains-mono"
              >
                <LogOut size={20} />
                <span>Sair</span>
              </a>
            </div>
          </div>

          {/* Quick Access Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a
              href="/secretary/students"
              className="bg-white dark:bg-[#262626] rounded-xl shadow-lg dark:ring-1 dark:ring-gray-700 p-6 hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 bg-purple-500 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">📋</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 font-jetbrains-mono">
                Área da Secretaria
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                Gerencie alunos, turmas e matrículas
              </p>
            </a>

            <a
              href="/teachers/classes"
              className="bg-white dark:bg-[#262626] rounded-xl shadow-lg dark:ring-1 dark:ring-gray-700 p-6 hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 bg-indigo-500 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">👨‍🏫</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 font-jetbrains-mono">
                Área dos Professores
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                Acesse suas turmas e horários
              </p>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

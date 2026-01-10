import { useState } from "react";
import { useLocation, Link } from "react-router";
import useAuth from "@/utils/useAuth";
import { GraduationCap, Home, UserPlus, LogIn } from "lucide-react";

export default function SignUpPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");

  const location = useLocation();
  const { signUpWithCredentials } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password || !name) {
      setError("Por favor, preencha todos os campos");
      setLoading(false);
      return;
    }

    try {
      // Store role in localStorage to use during onboarding
      localStorage.setItem("pendingRole", role);

      await signUpWithCredentials({
        email,
        password,
        name,
        callbackUrl: "/onboarding",
        redirect: true,
      });
    } catch (err) {
      setError("Não foi possível criar a conta. O email pode já estar em uso.");
      setLoading(false);
    }
  };

  const navTabs = [
    { name: "Início", href: "/", icon: Home },
    { name: "Login", href: "/account/signin", icon: LogIn },
    { name: "Cadastro", href: "/account/signup", icon: UserPlus },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1E1E1E] flex flex-col">
      {/* Navigation Tabs */}
      <nav className="bg-white dark:bg-[#262626] border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">Next Idiomas</span>
            </div>
            <div className="flex items-center gap-1">
              {navTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = location.pathname === tab.href;
                return (
                  <Link
                    key={tab.href}
                    to={tab.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                      ? "bg-blue-500 text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                  >
                    <Icon className="w-4 h-4" strokeWidth={2} />
                    {tab.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center p-4">
        <form
          noValidate
          onSubmit={onSubmit}
          className="w-full max-w-md bg-white dark:bg-[#262626] rounded-2xl shadow-xl dark:shadow-none dark:ring-1 dark:ring-gray-700 p-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 text-center font-jetbrains-mono">
            Next Idiomas
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-8 font-jetbrains-mono">
            Crie sua conta
          </p>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-jetbrains-mono">
                Nome Completo
              </label>
              <input
                required
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 font-jetbrains-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-jetbrains-mono">
                Email
              </label>
              <input
                required
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 font-jetbrains-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-jetbrains-mono">
                Senha
              </label>
              <input
                required
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Crie uma senha"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 font-jetbrains-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-jetbrains-mono">
                Tipo de Usuário
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 font-jetbrains-mono"
              >
                <option value="student">Aluno</option>
                <option value="teacher">Professor</option>
                <option value="secretary">Secretaria</option>
              </select>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-600 dark:text-red-400 font-jetbrains-mono">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 active:bg-black dark:active:bg-white transition-colors disabled:opacity-50 font-jetbrains-mono"
            >
              {loading ? "Criando conta..." : "Criar Conta"}
            </button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400 font-jetbrains-mono">
              Já tem uma conta?{" "}
              <a
                href="/account/signin"
                className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300"
              >
                Entre aqui
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

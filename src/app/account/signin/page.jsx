import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import useAuth from "@/utils/useAuth";
import { GraduationCap, User, Users, BookOpen, Settings, Home, UserPlus, LogIn } from "lucide-react";

export default function SignInPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithCredentials } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!profile) {
      setError("Por favor, selecione seu perfil");
      setLoading(false);
      return;
    }

    if (!email || !password) {
      setError("Por favor, preencha todos os campos");
      setLoading(false);
      return;
    }

    try {
      await signInWithCredentials({
        email,
        password,
        callbackUrl: "/dashboard",
        redirect: true,
      });
    } catch (err) {
      setError("Email ou senha incorretos. Tente novamente.");
      setLoading(false);
    }
  };

  const roles = [
    { name: "Aluno", icon: GraduationCap, value: "student" },
    { name: "Secretaria", icon: Users, value: "secretary" },
    { name: "Professor", icon: BookOpen, value: "teacher" },
    { name: "Administrador", icon: Settings, value: "admin" },
  ];

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

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <form
          noValidate
          onSubmit={onSubmit}
          className="w-full max-w-md bg-white dark:bg-[#262626] rounded-2xl shadow-lg dark:shadow-none dark:ring-1 dark:ring-gray-700 p-8 mb-6"
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-white" strokeWidth={2} />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center mb-2">
            Login Next Idiomas
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-8 text-sm">
            Selecione seu perfil e faça login no sistema
          </p>

          <div className="space-y-5">
            {/* Profile Selector */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                Perfil
              </label>
              <select
                required
                value={profile}
                onChange={(e) => setProfile(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione seu perfil</option>
                <option value="student">Aluno</option>
                <option value="secretary">Secretaria</option>
                <option value="teacher">Professor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                Email
              </label>
              <input
                required
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                Senha
              </label>
              <input
                required
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 active:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>

            {/* Sign Up Link */}
            <button
              type="button"
              onClick={() => navigate("/account/signup")}
              className="w-full py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cadastrar-se
            </button>
          </div>
        </form>

        {/* Role Cards */}
        <div className="w-full max-w-md grid grid-cols-2 gap-3">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.value}
                type="button"
                onClick={() => setProfile(role.value)}
                className="bg-white dark:bg-[#262626] rounded-xl shadow-md dark:shadow-none dark:ring-1 dark:ring-gray-700 p-6 flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300 mb-2" strokeWidth={2} />
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {role.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

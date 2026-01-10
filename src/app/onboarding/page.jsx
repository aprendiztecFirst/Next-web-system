import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";

export default function OnboardingPage() {
  const { data: user, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [role, setRole] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pendingRole = localStorage.getItem("pendingRole");
      if (pendingRole && !role) {
        setRole(pendingRole);
      }
    }
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (!res.ok) {
        throw new Error("Erro ao criar perfil");
      }

      // Clear localStorage
      localStorage.removeItem("pendingRole");

      // Redirect to dashboard
      if (typeof window !== "undefined") {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao finalizar cadastro. Tente novamente.");
      setLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1E1E1E] flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400 font-jetbrains-mono">
          Carregando...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1E1E1E] flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-[#262626] rounded-2xl shadow-xl dark:shadow-none dark:ring-1 dark:ring-gray-700 p-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 text-center font-jetbrains-mono">
          Complete seu Cadastro
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-8 font-jetbrains-mono">
          Olá, {user?.name}! Confirme suas informações.
        </p>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-jetbrains-mono">
              Tipo de Usuário
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 font-jetbrains-mono"
            >
              <option value="">Selecione...</option>
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
            disabled={loading || !role}
            className="w-full py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 active:bg-black dark:active:bg-white transition-colors disabled:opacity-50 font-jetbrains-mono"
          >
            {loading ? "Finalizando..." : "Finalizar Cadastro"}
          </button>
        </div>
      </form>
    </div>
  );
}

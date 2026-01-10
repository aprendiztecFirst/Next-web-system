import { useState, useEffect } from "react";
import Header from "@/components/Header";
import useUser from "@/utils/useUser";
import { Users, Shield } from "lucide-react";

export default function AdminUsersPage() {
  const { data: user, loading: userLoading } = useUser();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const res = await fetch("/api/admin/profiles");
      if (!res.ok) throw new Error("Erro ao carregar perfis");
      const data = await res.json();
      setProfiles(data.profiles || []);
    } catch (error) {
      console.error(error);
    } finally {
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
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-8">
            <Shield className="text-red-500" size={40} />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
              Gerenciar Usuários
            </h1>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-[#262626] rounded-xl shadow-lg dark:ring-1 dark:ring-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                    Total
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
                    {profiles.length}
                  </p>
                </div>
                <Users className="text-gray-400" size={32} />
              </div>
            </div>

            <div className="bg-white dark:bg-[#262626] rounded-xl shadow-lg dark:ring-1 dark:ring-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                    Alunos
                  </p>
                  <p className="text-3xl font-bold text-orange-500 font-jetbrains-mono">
                    {profiles.filter((p) => p.role === "student").length}
                  </p>
                </div>
                <span className="text-3xl">📚</span>
              </div>
            </div>

            <div className="bg-white dark:bg-[#262626] rounded-xl shadow-lg dark:ring-1 dark:ring-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                    Professores
                  </p>
                  <p className="text-3xl font-bold text-indigo-500 font-jetbrains-mono">
                    {profiles.filter((p) => p.role === "teacher").length}
                  </p>
                </div>
                <span className="text-3xl">👨‍🏫</span>
              </div>
            </div>

            <div className="bg-white dark:bg-[#262626] rounded-xl shadow-lg dark:ring-1 dark:ring-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                    Secretaria
                  </p>
                  <p className="text-3xl font-bold text-purple-500 font-jetbrains-mono">
                    {profiles.filter((p) => p.role === "secretary").length}
                  </p>
                </div>
                <span className="text-3xl">📋</span>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white dark:bg-[#262626] rounded-xl shadow-lg dark:ring-1 dark:ring-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
                      Nome
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
                      Tipo
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
                      Criado em
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-8 text-center text-gray-500 dark:text-gray-400 font-jetbrains-mono"
                      >
                        Carregando usuários...
                      </td>
                    </tr>
                  ) : profiles.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-8 text-center text-gray-500 dark:text-gray-400 font-jetbrains-mono"
                      >
                        Nenhum usuário encontrado
                      </td>
                    </tr>
                  ) : (
                    profiles.map((profile) => (
                      <tr
                        key={profile.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="px-6 py-4 text-gray-900 dark:text-gray-100 font-jetbrains-mono">
                          {profile.name}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-jetbrains-mono ${
                              profile.role === "student"
                                ? "bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400"
                                : profile.role === "teacher"
                                  ? "bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400"
                                  : profile.role === "secretary"
                                    ? "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400"
                            }`}
                          >
                            {profile.role === "student"
                              ? "Aluno"
                              : profile.role === "teacher"
                                ? "Professor"
                                : profile.role === "secretary"
                                  ? "Secretaria"
                                  : profile.role === "admin"
                                    ? "Admin"
                                    : profile.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-jetbrains-mono ${
                              profile.active
                                ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400"
                            }`}
                          >
                            {profile.active ? "Ativo" : "Inativo"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                          {profile.created_at
                            ? new Date(profile.created_at).toLocaleDateString(
                                "pt-BR",
                              )
                            : "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

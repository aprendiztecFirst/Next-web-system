import { useState, useEffect } from "react";
import Header from "@/components/Header";
import SecretaryNav from "@/components/SecretaryNav";
import useUser from "@/utils/useUser";
import { Search, UserPlus, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function StudentsPage() {
  const { data: user, loading: userLoading } = useUser();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentLevel, setCurrentLevel] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const level = params.get("level");
    setCurrentLevel(level);
    fetchStudents(level, statusFilter);
  }, [statusFilter]);

  const fetchStudents = async (level, status) => {
    try {
      setLoading(true);
      let url = "/api/students?";
      const params = new URLSearchParams();
      if (level) params.append("level", level);
      if (status) params.append("status", status);

      url += params.toString();

      const res = await fetch(url);
      if (!res.ok) throw new Error("Erro ao carregar alunos");
      const data = await res.json();
      setStudents(data.students || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;
    try {
      setDeleting(true);
      const res = await fetch(`/api/students/${studentToDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Erro ao excluir aluno");
      }

      setStudents((prev) => prev.filter((s) => s.id !== studentToDelete.id));
      toast.success(`Aluno "${studentToDelete.full_name}" excluído com sucesso!`);
      setStudentToDelete(null);
    } catch (error) {
      console.error("Erro ao excluir:", error);
      toast.error("Não foi possível excluir o aluno. Tente novamente.");
    } finally {
      setDeleting(false);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.full_name.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase()),
  );

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
      <SecretaryNav currentPath="/secretary/students" />

      <main className="pt-8 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
              Alunos {currentLevel ? `- ${currentLevel}` : ""}
            </h1>
            <a
              href="/secretary/new-student"
              className="flex items-center space-x-2 px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-jetbrains-mono"
            >
              <UserPlus size={20} />
              <span>Novo Aluno</span>
            </a>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Buscar por nome ou email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#262626] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 font-jetbrains-mono"
              />
            </div>
            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-[#262626] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 font-jetbrains-mono appearance-none cursor-pointer"
              >
                <option value="all">Todos os Status</option>
                <option value="active">Ativos</option>
                <option value="inactive">Inativos</option>
              </select>
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white dark:bg-[#262626] rounded-xl shadow-lg dark:ring-1 dark:ring-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
                      Nome
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
                      Telefone
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-8 text-center text-gray-500 dark:text-gray-400 font-jetbrains-mono"
                      >
                        Carregando alunos...
                      </td>
                    </tr>
                  ) : filteredStudents.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-8 text-center text-gray-500 dark:text-gray-400 font-jetbrains-mono"
                      >
                        Nenhum aluno encontrado
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => (
                      <tr
                        key={student.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="px-6 py-4 text-gray-900 dark:text-gray-100 font-jetbrains-mono">
                          <a
                            href={`/secretary/students/${student.id}`}
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {student.full_name}
                          </a>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                          {student.email}
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                          {student.phone || "-"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-jetbrains-mono ${student.active
                              ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400"
                              }`}
                          >
                            {student.active ? "Ativo" : "Inativo"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            type="button"
                            onClick={() => setStudentToDelete(student)}
                            title="Excluir Aluno"
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors inline-flex items-center justify-center"
                          >
                            <Trash2 size={18} />
                          </button>
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

      {/* Confirmation Modal */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#262626] rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 text-red-600 dark:text-red-400 mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold font-jetbrains-mono">
                Excluir Aluno
              </h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 font-jetbrains-mono text-sm mb-6">
              Tem certeza que deseja excluir o aluno{" "}
              <strong className="text-gray-900 dark:text-gray-100">
                {studentToDelete.full_name}
              </strong>
              ? Esta ação é permanente e removerá todas as matrículas deste aluno.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
                disabled={deleting}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 font-semibold font-jetbrains-mono transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold font-jetbrains-mono transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                {deleting ? (
                  <span>Excluindo...</span>
                ) : (
                  <>
                    <Trash2 size={16} />
                    <span>Confirmar Exclusão</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

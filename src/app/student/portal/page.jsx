import { useState, useEffect } from "react";
import Header from "@/components/Header";
import useUser from "@/utils/useUser";
import { BookOpen, Calendar, FileText } from "lucide-react";

export default function StudentPortalPage() {
  const { data: user, loading: userLoading } = useUser();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await fetch("/api/classes?active=true");
      if (!res.ok) throw new Error("Erro ao carregar turmas");
      const data = await res.json();
      setClasses(data.classes || []);
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
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 font-jetbrains-mono mb-2">
              Portal do Aluno
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-jetbrains-mono">
              Olá, {user.name}! Bem-vindo ao seu portal.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-[#262626] rounded-xl shadow-lg dark:ring-1 dark:ring-gray-700 p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
                    Minhas Turmas
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                    {classes.length} turmas disponíveis
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#262626] rounded-xl shadow-lg dark:ring-1 dark:ring-gray-700 p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Calendar className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
                    Horários
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                    Ver calendário
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#262626] rounded-xl shadow-lg dark:ring-1 dark:ring-gray-700 p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <FileText className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
                    Materiais
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                    Acessar conteúdo
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Available Classes */}
          <div className="bg-white dark:bg-[#262626] rounded-xl shadow-lg dark:ring-1 dark:ring-gray-700 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6 font-jetbrains-mono">
              Turmas Disponíveis
            </h2>

            {loading ? (
              <p className="text-center text-gray-500 dark:text-gray-400 font-jetbrains-mono py-8">
                Carregando turmas...
              </p>
            ) : classes.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 font-jetbrains-mono py-8">
                Nenhuma turma disponível no momento
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((cls) => (
                  <div
                    key={cls.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 font-jetbrains-mono">
                      {cls.name}
                    </h3>
                    <div className="space-y-2 text-sm mb-4">
                      <p className="text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                        <span className="font-medium">Idioma:</span>{" "}
                        {cls.language}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                        <span className="font-medium">Nível:</span> {cls.level}
                      </p>
                      {cls.schedule && (
                        <p className="text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                          <span className="font-medium">Horário:</span>{" "}
                          {cls.schedule}
                        </p>
                      )}
                      {cls.teacher_name && (
                        <p className="text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                          <span className="font-medium">Professor:</span>{" "}
                          {cls.teacher_name}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() =>
                        alert("Funcionalidade de matrícula em desenvolvimento")
                      }
                      className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-jetbrains-mono"
                    >
                      Matricular
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

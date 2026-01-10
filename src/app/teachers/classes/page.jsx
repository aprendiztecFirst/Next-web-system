import { useState, useEffect } from "react";
import Header from "@/components/Header";
import useUser from "@/utils/useUser";
import { BookOpen, Calendar } from "lucide-react";

export default function TeacherClassesPage() {
  const { data: user, loading: userLoading } = useUser();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await fetch("/api/classes");
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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
              Minhas Turmas
            </h1>
            <a
              href="/teachers/schedule"
              className="flex items-center space-x-2 px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-jetbrains-mono"
            >
              <Calendar size={20} />
              <span>Ver Horários</span>
            </a>
          </div>

          {/* Classes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <p className="col-span-full text-center text-gray-500 dark:text-gray-400 font-jetbrains-mono py-8">
                Carregando turmas...
              </p>
            ) : classes.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 dark:text-gray-400 font-jetbrains-mono py-8">
                Nenhuma turma atribuída
              </p>
            ) : (
              classes.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-white dark:bg-[#262626] rounded-xl shadow-lg dark:ring-1 dark:ring-gray-700 p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
                        {cls.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                        {cls.language} - {cls.level}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    {cls.schedule && (
                      <p className="text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                        <span className="font-medium">📅 Horário:</span>{" "}
                        {cls.schedule}
                      </p>
                    )}
                    <p className="text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                      <span className="font-medium">👥 Vagas:</span>{" "}
                      {cls.max_students}
                    </p>
                    {cls.start_date && (
                      <p className="text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                        <span className="font-medium">🗓️ Início:</span>{" "}
                        {new Date(cls.start_date).toLocaleDateString("pt-BR")}
                      </p>
                    )}
                  </div>

                  <div className="mt-6">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-jetbrains-mono ${
                        cls.active
                          ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400"
                      }`}
                    >
                      {cls.active ? "Ativa" : "Inativa"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

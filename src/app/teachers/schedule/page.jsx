import { useState, useEffect } from "react";
import Header from "@/components/Header";
import useUser from "@/utils/useUser";
import { Clock } from "lucide-react";

export default function TeacherSchedulePage() {
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

  const daysOfWeek = [
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
    "Domingo",
  ];

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
              Meus Horários
            </h1>
            <a
              href="/teachers/classes"
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-jetbrains-mono"
            >
              Ver Turmas
            </a>
          </div>

          {/* Weekly Schedule */}
          <div className="bg-white dark:bg-[#262626] rounded-xl shadow-lg dark:ring-1 dark:ring-gray-700 p-8">
            <div className="flex items-center space-x-2 mb-6">
              <Clock className="text-indigo-500" size={24} />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
                Agenda Semanal
              </h2>
            </div>

            {loading ? (
              <p className="text-center text-gray-500 dark:text-gray-400 font-jetbrains-mono py-8">
                Carregando horários...
              </p>
            ) : (
              <div className="space-y-4">
                {daysOfWeek.map((day) => {
                  const dayClasses = classes.filter(
                    (cls) =>
                      cls.schedule &&
                      cls.schedule
                        .toLowerCase()
                        .includes(day.substring(0, 3).toLowerCase()),
                  );

                  return (
                    <div
                      key={day}
                      className="border-l-4 border-indigo-500 pl-4 py-2"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 font-jetbrains-mono">
                        {day}
                      </h3>
                      {dayClasses.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-jetbrains-mono">
                          Nenhuma aula agendada
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {dayClasses.map((cls) => (
                            <div
                              key={cls.id}
                              className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3"
                            >
                              <p className="font-semibold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
                                {cls.name}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                                {cls.schedule}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* All Classes List */}
          <div className="mt-8 bg-white dark:bg-[#262626] rounded-xl shadow-lg dark:ring-1 dark:ring-gray-700 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6 font-jetbrains-mono">
              Todas as Turmas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classes.map((cls) => (
                <div
                  key={cls.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 font-jetbrains-mono">
                    {cls.name}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                    <p>
                      <span className="font-medium">Idioma:</span>{" "}
                      {cls.language}
                    </p>
                    <p>
                      <span className="font-medium">Nível:</span> {cls.level}
                    </p>
                    {cls.schedule && (
                      <p>
                        <span className="font-medium">Horário:</span>{" "}
                        {cls.schedule}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

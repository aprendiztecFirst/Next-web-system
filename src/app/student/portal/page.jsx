import { useState, useEffect } from "react";
import Header from "@/components/Header";
import useUser from "@/utils/useUser";
import { BookOpen, Calendar, FileText } from "lucide-react";

export default function StudentPortalPage() {
  const { data: user, loading: userLoading } = useUser();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isClassesDropdownOpen, setIsClassesDropdownOpen] = useState(false);
  const [isScheduleDropdownOpen, setIsScheduleDropdownOpen] = useState(false);

  const availableClassesList = [
    "iLearn 01",
    "iLearn 02",
    "iLearn 03",
    "Top Notch Fundamentals A",
    "Top Notch Fundamentals B",
    "Top Notch 1A",
    "Top Notch 1B",
    "Top Notch 2A",
    "Top Notch 2B",
    "Top Notch 3A",
    "Top Notch 3B",
  ];

  const weeklySchedule = {
    "Segunda e Quarta": [
      { time: "14:15", name: "TN 2A / iLearn 2" },
      { time: "15:30", name: "TN 3B / iLearn 3" },
      { time: "17:00", name: "TN 3A" },
      { time: "19:00", name: "VIP: alciene / TN 1A" },
      { time: "20:00", name: "TN 2B" },
    ],
    "Terça e Quinta": [
      { time: "14:15", name: "iLearn 1 / VIP: Patrícia" },
      { time: "15:30", name: "TN 2B / TN 1B" },
      { time: "17:00", name: "VIP: Guilherme" },
      { time: "19:00", name: "Fundamentals B" },
      { time: "20:00", name: "VIP: Marcos" },
    ],
  };

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
            <div className="relative">
              <button
                onClick={() => {
                  setIsClassesDropdownOpen(!isClassesDropdownOpen);
                  setIsScheduleDropdownOpen(false);
                }}
                className="w-full text-left bg-white dark:bg-[#262626] rounded-xl shadow-lg dark:ring-1 dark:ring-gray-700 p-6 hover:bg-gray-50 dark:hover:bg-[#2d2d2d] transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                      <BookOpen className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
                        Minhas Turmas
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                        Clique para ver turmas
                      </p>
                    </div>
                  </div>
                  <div className={`transform transition-transform ${isClassesDropdownOpen ? "rotate-180" : ""}`}>
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </button>

              {isClassesDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#262626] rounded-xl shadow-2xl dark:ring-1 dark:ring-gray-700 z-10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="max-h-[300px] overflow-y-auto py-2">
                    {availableClassesList.map((className, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-6 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-400 font-jetbrains-mono border-b border-gray-100 dark:border-gray-800 last:border-0 transition-colors"
                        onClick={() => {
                          alert(`Turma selecionada: ${className}`);
                          setIsClassesDropdownOpen(false);
                        }}
                      >
                        {className}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  setIsScheduleDropdownOpen(!isScheduleDropdownOpen);
                  setIsClassesDropdownOpen(false);
                }}
                className="w-full text-left bg-white dark:bg-[#262626] rounded-xl shadow-lg dark:ring-1 dark:ring-gray-700 p-6 hover:bg-gray-50 dark:hover:bg-[#2d2d2d] transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
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
                  <div className={`transform transition-transform ${isScheduleDropdownOpen ? "rotate-180" : ""}`}>
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </button>

              {isScheduleDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#262626] rounded-xl shadow-2xl dark:ring-1 dark:ring-gray-700 z-10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="max-h-[400px] overflow-y-auto p-4 space-y-4">
                    {Object.entries(weeklySchedule).map(([day, slots]) => (
                      <div key={day} className="space-y-2">
                        <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 font-jetbrains-mono uppercase tracking-wider sticky top-0 bg-white dark:bg-[#262626] pb-1 border-b border-gray-100 dark:border-gray-800">
                          {day}
                        </h4>
                        <div className="space-y-1">
                          {slots.map((slot, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors group/item"
                            >
                              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 font-jetbrains-mono mr-4">
                                {slot.time}
                              </span>
                              <span className="text-sm text-gray-800 dark:text-gray-200 font-jetbrains-mono text-right group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400">
                                {slot.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <a
              href="https://login.pearson.com/v1/piapi/piui/signin?client_id=bWPoUiRnLpUhX2rhGeP4AaLCeyQYNYDA&login_success_url=https:%2F%2Fenglish-dashboard.pearson.com%2Flogin%3FiesCode%3DS3csGhKKxv"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white dark:bg-[#262626] rounded-xl shadow-lg dark:ring-1 dark:ring-gray-700 p-6 hover:bg-gray-50 dark:hover:bg-[#2d2d2d] transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileText className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
                    Materiais
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                    Acessar plataforma Pearson
                  </p>
                </div>
              </div>
            </a>
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

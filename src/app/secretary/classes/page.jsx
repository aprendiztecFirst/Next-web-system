import { useState, useEffect } from "react";
import Header from "@/components/Header";
import SecretaryNav from "@/components/SecretaryNav";
import useUser from "@/utils/useUser";
import { Search, Plus } from "lucide-react";

export default function ClassesPage() {
  const { data: user, loading: userLoading } = useUser();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  const filteredClasses = classes.filter(
    (cls) =>
      cls.name.toLowerCase().includes(search.toLowerCase()) ||
      cls.language.toLowerCase().includes(search.toLowerCase()) ||
      cls.level.toLowerCase().includes(search.toLowerCase()),
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
      <SecretaryNav currentPath="/secretary/classes" />

      <main className="pt-8 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
              Turmas
            </h1>
            <a
              href="/secretary/new-class"
              className="flex items-center space-x-2 px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-jetbrains-mono"
            >
              <Plus size={20} />
              <span>Nova Turma</span>
            </a>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Buscar por nome, idioma ou nível..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#262626] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 font-jetbrains-mono"
              />
            </div>
          </div>

          {/* Classes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <p className="col-span-full text-center text-gray-500 dark:text-gray-400 font-jetbrains-mono py-8">
                Carregando turmas...
              </p>
            ) : filteredClasses.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 dark:text-gray-400 font-jetbrains-mono py-8">
                Nenhuma turma encontrada
              </p>
            ) : (
              filteredClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-white dark:bg-[#262626] rounded-xl shadow-lg dark:ring-1 dark:ring-gray-700 p-6 hover:shadow-xl transition-shadow"
                >
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 font-jetbrains-mono">
                    {cls.name}
                  </h3>
                  <div className="space-y-2 text-sm">
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
                    <p className="text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                      <span className="font-medium">Vagas:</span>{" "}
                      {cls.max_students}
                    </p>
                  </div>
                  <div className="mt-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-jetbrains-mono ${cls.active
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

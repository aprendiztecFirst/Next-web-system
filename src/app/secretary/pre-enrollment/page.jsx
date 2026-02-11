import { useState, useEffect } from "react";
import Header from "@/components/Header";
import SecretaryNav from "@/components/SecretaryNav";
import useUser from "@/utils/useUser";
import { Plus } from "lucide-react";

export default function PreEnrollmentPage() {
  const { data: user, loading: userLoading } = useUser();
  const [preEnrollments, setPreEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    preferred_language: "",
    preferred_level: "",
    preferred_schedule: "",
    notes: "",
  });

  useEffect(() => {
    fetchPreEnrollments();
  }, []);

  const fetchPreEnrollments = async () => {
    try {
      const res = await fetch("/api/pre-enrollments");
      if (!res.ok) throw new Error("Erro ao carregar pré-matrículas");
      const data = await res.json();
      setPreEnrollments(data.preEnrollments || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/pre-enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Erro ao criar pré-matrícula");

      setShowForm(false);
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        preferred_language: "",
        preferred_level: "",
        preferred_schedule: "",
        notes: "",
      });
      fetchPreEnrollments();
    } catch (error) {
      console.error(error);
      alert("Erro ao criar pré-matrícula");
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
      <SecretaryNav currentPath="/secretary/pre-enrollment" />

      <main className="pt-8 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
              Pré-matrícula
            </h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-jetbrains-mono"
            >
              <Plus size={20} />
              <span>Nova Pré-matrícula</span>
            </button>
          </div>

          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="bg-white dark:bg-[#262626] rounded-2xl shadow-lg dark:ring-1 dark:ring-gray-700 p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-jetbrains-mono">
                Nova Pré-matrícula
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Nome Completo *"
                  required
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 font-jetbrains-mono"
                />
                <input
                  type="email"
                  placeholder="Email *"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 font-jetbrains-mono"
                />
                <input
                  type="tel"
                  placeholder="Telefone *"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 font-jetbrains-mono"
                />
                <input
                  type="text"
                  placeholder="Idioma Preferido"
                  value={formData.preferred_language}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferred_language: e.target.value,
                    })
                  }
                  className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 font-jetbrains-mono"
                />
                <input
                  type="text"
                  placeholder="Nível Preferido"
                  value={formData.preferred_level}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferred_level: e.target.value,
                    })
                  }
                  className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 font-jetbrains-mono"
                />
                <input
                  type="text"
                  placeholder="Horário Preferido"
                  value={formData.preferred_schedule}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferred_schedule: e.target.value,
                    })
                  }
                  className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 font-jetbrains-mono"
                />
              </div>
              <textarea
                placeholder="Observações"
                rows="3"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="w-full mt-6 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 font-jetbrains-mono"
              />
              <div className="flex space-x-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-jetbrains-mono"
                >
                  Cadastrar
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-jetbrains-mono"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {/* Pre-enrollments Table */}
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
                      Idioma
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
                      Status
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
                        Carregando...
                      </td>
                    </tr>
                  ) : preEnrollments.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-8 text-center text-gray-500 dark:text-gray-400 font-jetbrains-mono"
                      >
                        Nenhuma pré-matrícula encontrada
                      </td>
                    </tr>
                  ) : (
                    preEnrollments.map((enrollment) => (
                      <tr
                        key={enrollment.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="px-6 py-4 text-gray-900 dark:text-gray-100 font-jetbrains-mono">
                          {enrollment.full_name}
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                          {enrollment.email}
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                          {enrollment.phone}
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                          {enrollment.preferred_language || "-"}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 font-jetbrains-mono">
                            {enrollment.status}
                          </span>
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

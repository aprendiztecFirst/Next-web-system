import { useState, useEffect } from "react";
import Header from "@/components/Header";
import SecretaryNav from "@/components/SecretaryNav";
import useUser from "@/utils/useUser";
import { useParams } from "react-router";

export default function EditTeacherPage() {
    const { id } = useParams();
    const { data: user, loading: userLoading } = useUser();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [fetchingClasses, setFetchingClasses] = useState(true);
    const [classes, setClasses] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        active: true,
        classIds: []
    });

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setFetchingClasses(true);

            // Fetch teacher and classes in parallel
            const [teacherRes, classesRes] = await Promise.all([
                fetch(`/api/teachers/${id}`),
                fetch("/api/classes")
            ]);

            if (!teacherRes.ok) throw new Error("Erro ao carregar dados do professor");
            if (!classesRes.ok) throw new Error("Erro ao carregar turmas");

            const teacherData = await teacherRes.json();
            const classesData = await classesRes.json();

            const teacher = teacherData.teacher;
            const assignedClassIds = teacherData.classes.map(c => c.id);

            setFormData({
                full_name: teacher.full_name || "",
                email: teacher.email || "",
                phone: teacher.phone || "",
                active: teacher.active === 1 || teacher.active === true,
                classIds: assignedClassIds
            });

            setClasses(classesData.classes || []);
        } catch (err) {
            console.error(err);
            setError("Erro ao carregar dados.");
        } finally {
            setLoading(false);
            setFetchingClasses(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleClassToggle = (classId) => {
        setFormData((prev) => {
            const isSelected = prev.classIds.includes(classId);
            if (isSelected) {
                return { ...prev, classIds: prev.classIds.filter(id => id !== classId) };
            } else {
                return { ...prev, classIds: [...prev.classIds, classId] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setSaving(true);

        try {
            const res = await fetch(`/api/teachers/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Erro ao atualizar professor");
            }

            setSuccess(true);
            setTimeout(() => {
                window.location.href = "/secretary/teachers";
            }, 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (userLoading || loading) return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#1E1E1E] flex items-center justify-center">
            <p className="text-gray-600 dark:text-gray-400 font-jetbrains-mono">Carregando...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#1E1E1E]">
            <Header />
            <SecretaryNav currentPath="/secretary/teachers" />

            <main className="pt-8 pb-16 px-4">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8 font-jetbrains-mono">
                        Editar Professor
                    </h1>

                    <form
                        onSubmit={handleSubmit}
                        className="bg-white dark:bg-[#262626] rounded-2xl shadow-lg dark:ring-1 dark:ring-gray-700 p-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-jetbrains-mono">
                                    Nome Completo
                                </label>
                                <input
                                    type="text"
                                    name="full_name"
                                    required
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-jetbrains-mono"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-jetbrains-mono">
                                    E-mail
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-jetbrains-mono"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-jetbrains-mono">
                                    Telefone
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="(00) 00000-0000"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-jetbrains-mono"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="active"
                                        id="active"
                                        checked={formData.active}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="active" className="text-sm font-medium text-gray-700 dark:text-gray-300 font-jetbrains-mono">
                                        Professor Ativo
                                    </label>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 font-jetbrains-mono">
                                    Turmas Atribuídas
                                </label>
                                {fetchingClasses ? (
                                    <p className="text-gray-500 text-sm">Carregando turmas...</p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-[#1E1E1E]">
                                        {classes.map((cls) => (
                                            <div
                                                key={cls.id}
                                                onClick={() => handleClassToggle(cls.id)}
                                                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${formData.classIds.includes(cls.id)
                                                        ? "bg-blue-600 border-blue-600 text-white shadow-md"
                                                        : "bg-white dark:bg-[#262626] border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400"
                                                    }`}
                                            >
                                                <div className="flex-1">
                                                    <p className={`font-bold text-sm ${formData.classIds.includes(cls.id) ? "text-white" : ""}`}>
                                                        {cls.name}
                                                    </p>
                                                    <p className={`text-xs ${formData.classIds.includes(cls.id) ? "text-blue-100" : "text-gray-500"}`}>
                                                        {cls.level} - {cls.language}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl font-jetbrains-mono text-sm">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl font-jetbrains-mono text-sm">
                                Alterações salvas com sucesso! Redirecionando...
                            </div>
                        )}

                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 font-jetbrains-mono"
                            >
                                {saving ? "Salvando..." : "Salvar Alterações"}
                            </button>
                            <a
                                href="/secretary/teachers"
                                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-jetbrains-mono"
                            >
                                Cancelar
                            </a>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

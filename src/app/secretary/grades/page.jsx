import Header from "@/components/Header";
import SecretaryNav from "@/components/SecretaryNav";
import { GraduationCap } from "lucide-react";

export default function GradesPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#1E1E1E]">
            <Header />
            <SecretaryNav currentPath="/secretary/grades" />

            <main className="pt-8 pb-16 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <GraduationCap size={40} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 font-jetbrains-mono">
                        Notas de Alunos
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-jetbrains-mono">
                        Lançamento de notas, acompanhamento de frequência e boletins escolares.
                        Módulo acadêmico em desenvolvimento.
                    </p>
                </div>
            </main>
        </div>
    );
}

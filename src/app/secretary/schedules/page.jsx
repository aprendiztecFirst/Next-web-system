import Header from "@/components/Header";
import SecretaryNav from "@/components/SecretaryNav";
import { Clock } from "lucide-react";

export default function SchedulesPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#1E1E1E]">
            <Header />
            <SecretaryNav currentPath="/secretary/schedules" />

            <main className="pt-8 pb-16 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Clock size={40} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 font-jetbrains-mono">
                        Horários
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-jetbrains-mono">
                        Gestão de grades horárias, reserva de salas e disponibilidade de professores.
                        Esta funcionalidade está sendo preparada para você.
                    </p>
                </div>
            </main>
        </div>
    );
}

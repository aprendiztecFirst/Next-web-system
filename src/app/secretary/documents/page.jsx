import Header from "@/components/Header";
import SecretaryNav from "@/components/SecretaryNav";
import { FileText } from "lucide-react";

export default function DocumentsPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#1E1E1E]">
            <Header />
            <SecretaryNav currentPath="/secretary/documents" />

            <main className="pt-8 pb-16 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FileText size={40} className="text-green-600 dark:text-green-400" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 font-jetbrains-mono">
                        Documentos
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-jetbrains-mono">
                        Emissão de certificados, contratos e declarações de matrícula.
                        Central de documentos administrativos em breve.
                    </p>
                </div>
            </main>
        </div>
    );
}

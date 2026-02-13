import { useState } from "react";
import { Users, BookOpen, Clock, FileText, GraduationCap, ChevronDown } from "lucide-react";

export default function SecretaryNav({ currentPath }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const navItems = [
        { name: "Alunos", href: "/secretary/students", icon: Users },
        { name: "Professores", href: "/secretary/teachers", icon: Users },
        {
            name: "Turmas",
            href: "/secretary/classes",
            icon: BookOpen,
            hasDropdown: true,
            options: [
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
            ]
        },
        { name: "Horários", href: "/secretary/schedules", icon: Clock },
        { name: "Documentos", href: "/secretary/documents", icon: FileText },
        { name: "Notas de Alunos", href: "/secretary/grades", icon: GraduationCap },
    ];

    return (
        <nav className="mt-16 bg-white dark:bg-[#262626] border-b border-gray-200 dark:border-gray-700 sticky top-16 z-40">
            <div className="max-w-7xl mx-auto px-4 overflow-x-visible scroller-hide">
                <div className="flex space-x-1 sm:space-x-4 min-w-max py-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPath?.startsWith(item.href);

                        if (item.hasDropdown) {
                            return (
                                <div
                                    key={item.href}
                                    className="relative group"
                                    onMouseEnter={() => setDropdownOpen(true)}
                                    onMouseLeave={() => setDropdownOpen(false)}
                                >
                                    <a
                                        href={item.href}
                                        className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all font-jetbrains-mono text-sm sm:text-base whitespace-nowrap ${isActive
                                            ? "bg-blue-600 text-white shadow-lg"
                                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                            }`}
                                    >
                                        <Icon size={18} />
                                        <span>{item.name}</span>
                                        <ChevronDown size={16} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                                    </a>

                                    {dropdownOpen && (
                                        <div className="absolute top-full left-0 w-64 mt-1 bg-white dark:bg-[#262626] border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="py-2 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                                {item.options.map((option) => (
                                                    <a
                                                        key={option}
                                                        href={`/secretary/students?level=${encodeURIComponent(option)}`}
                                                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-jetbrains-mono"
                                                    >
                                                        {option}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        return (
                            <a
                                key={item.href}
                                href={item.href}
                                className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all font-jetbrains-mono text-sm sm:text-base whitespace-nowrap ${isActive
                                    ? "bg-blue-600 text-white shadow-lg"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    }`}
                            >
                                <Icon size={18} />
                                <span>{item.name}</span>
                            </a>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}

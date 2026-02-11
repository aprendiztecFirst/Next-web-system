import { useNavigate } from "react-router";
import { GraduationCap, User, Users, BookOpen, Settings, Award, BookText, Medal } from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();

  const quickAccessCards = [
    {
      title: "Portal do Aluno",
      description: "Acesse sua área pessoal, verifique seu progresso e gerencie suas informações",
      icon: GraduationCap,
      href: "/student/portal",
      color: "bg-blue-500",
      action: "Acessar"
    },
    {
      title: "Login e Cadastro",
      description: "Entre na plataforma ou cadastre-se",
      icon: User,
      href: "/account/signin",
      color: "bg-green-500",
      action: "Acessar"
    },
    {
      title: "Área da Secretaria",
      description: "Gerencie alunos, turmas, turmas e matrículas",
      icon: BookText,
      href: "/secretary/students",
      color: "bg-yellow-500",
      action: "Acessar"
    },
    {
      title: "Área dos Professores",
      description: "Acesse recursos e materiais exclusivos",
      icon: BookOpen,
      href: "/teachers/classes",
      color: "bg-indigo-600",
      action: "Acessar"
    },
    {
      title: "Área da Administração",
      description: "Configurações, estatísticas e controle total",
      icon: Settings,
      href: "/admin/users",
      color: "bg-teal-500",
      action: "Acessar"
    },
    {
      title: "Sobre Nós",
      description: "Saiba mais sobre nossa missão e valores",
      icon: Users,
      href: "#about",
      color: "bg-orange-500",
      action: "Acessar"
    }
  ];

  const benefits = [
    {
      icon: Award,
      title: "Ensino de Qualidade",
      description: "Professores qualificados e metodologia moderna para aprendizado eficaz"
    },
    {
      icon: BookOpen,
      title: "Material Completo",
      description: "Recursos didáticos atualizados e plataforma digital integrada"
    },
    {
      icon: Medal,
      title: "Certificação",
      description: "Certificado reconhecido e preparação para exames internacionais"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/logo.jpg" alt="Next Idiomas" className="h-10 w-auto rounded-lg shadow-sm" />
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">Início</a>
              <a href="/account/signin" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Login</a>
              <a href="/student/portal" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Portal do Aluno</a>
              <a href="/teachers/classes" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Professores</a>
              <a href="/secretary/students" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Secretaria</a>
              <a href="/admin/users" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Administração</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section with Gradient */}
      <section className="relative bg-gradient-to-br from-blue-500 via-blue-400 to-teal-400 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Bem-vindo à Next Idiomas
          </h1>
          <p className="text-lg md:text-xl mb-8 text-blue-50 max-w-3xl mx-auto">
            Sistema completo de gestão escolar para instituições de ensino de idiomas
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/account/signin")}
              className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors shadow-lg"
            >
              Fazer Login
            </button>
            <button
              onClick={() => navigate("/secretary/students")}
              className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg transition-colors border-2 border-white/50"
            >
              Área da Secretaria
            </button>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Acesso Rápido</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickAccessCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {card.description}
                  </p>
                  <button
                    onClick={() => navigate(card.href)}
                    className="text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors"
                  >
                    {card.action} →
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Por que escolher Next Idiomas?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm">
            © 2026 Next Idiomas. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

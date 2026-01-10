import useAuth from "@/utils/useAuth";

export default function LogoutPage() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1E1E1E] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#262626] rounded-2xl shadow-xl dark:shadow-none dark:ring-1 dark:ring-gray-700 p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center font-jetbrains-mono">
          Sair da Conta
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-8 font-jetbrains-mono">
          Tem certeza que deseja sair?
        </p>

        <button
          onClick={handleSignOut}
          className="w-full py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 active:bg-black dark:active:bg-white transition-colors font-jetbrains-mono"
        >
          Sair
        </button>
      </div>
    </div>
  );
}

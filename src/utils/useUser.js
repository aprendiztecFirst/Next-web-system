import * as React from 'react';



const useUser = () => {
  // BYPASS MODE (Modo Dev)
  // Retorna um usuário falso para liberar o acesso ao sistema sem banco de dados
  const mockUser = {
    id: "dev-user-id",
    name: "Usuário Dev (Admin)",
    email: "dev@nextidiomas.com",
    image: null,
    role: "ADMIN", // Pode ser ALUNO, PROFESSOR, SECRETARIA
  };

  return {
    user: mockUser,
    data: mockUser,
    loading: false,
    refetch: () => { }
  };
};

export { useUser }

export default useUser;
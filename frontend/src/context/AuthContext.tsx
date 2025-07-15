import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Usuario, AuthContextType } from '../types';
import AuthService, { RegisterData, LoginData } from '../services/auth.service';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há um usuário armazenado no localStorage
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const register = async (nome: string, email: string, senha: string): Promise<boolean> => {
    try {
      const data: RegisterData = { nome, email, senha };
      const response = await AuthService.register(data);
      
      setCurrentUser(response.user);
      return true;
    } catch (error: any) {
      console.error('Erro no registro:', error);
      // Verifica se o erro é do tipo AxiosError e tem uma resposta do servidor
      if (error.response && error.response.data) {
        console.error('Mensagem do servidor:', error.response.data.message);
      }
      return false;
    }
  };

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      const data: LoginData = { email, senha };
      const response = await AuthService.login(data);
      
      setCurrentUser(response.user);
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const logout = () => {
    AuthService.logout();
    setCurrentUser(null);
  };

  const value: AuthContextType = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
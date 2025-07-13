import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Usuario, AuthContextType } from '../types';

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

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const register = async (nome: string, email: string, senha: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (users.find((user: Usuario) => user.email === email)) {
        return false; // Email já existe
      }

      const newUser: Usuario = {
        nome,
        email,
        senha
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Criando uma cópia sem a senha para armazenar
      const userForStorage = {
        nome: newUser.nome,
        email: newUser.email
      };
      setCurrentUser(userForStorage as Usuario);
      localStorage.setItem('currentUser', JSON.stringify(userForStorage));
      
      return true;
    } catch (error) {
      return false;
    }
  };

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: Usuario) => u.email === email && u.senha === senha);
      
      if (user) {
        // Criando uma cópia sem a senha para armazenar
        const userForStorage = {
          nome: user.nome,
          email: user.email
        };
        setCurrentUser(userForStorage as Usuario);
        localStorage.setItem('currentUser', JSON.stringify(userForStorage));
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const value: AuthContextType = {
    currentUser,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
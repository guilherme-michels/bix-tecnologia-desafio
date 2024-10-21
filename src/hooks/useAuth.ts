import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

const mockUser: User = {
  id: "1",
  name: "Guilherme Michels",
  email: "a@a.com",
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      console.log("Usuário encontrado no localStorage:", storedUser);
      setUser(JSON.parse(storedUser));
    } else {
      console.log("Nenhum usuário encontrado no localStorage");
    }
    setLoading(false);
  }, []);

  const login = (email: string, password: string) => {
    console.log("Tentativa de login:", email, password);
    if (email === "a@a.com" && password === "teste123") {
      console.log("Login bem-sucedido");
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      router.push("/dashboard");
    } else {
      console.log("Credenciais inválidas");
      throw new Error("Credenciais inválidas");
    }
  };

  const logout = () => {
    console.log("Logout realizado");
    setUser(null);
    localStorage.removeItem("user");
    router.push("/auth");
  };

  return { user, loading, login, logout };
}

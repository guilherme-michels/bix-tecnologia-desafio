import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

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
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    console.log("Tentativa de login:", email, password);
    if (email === "a@a.com" && password === "teste123") {
      console.log("Login bem-sucedido");
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      await router.push("/dashboard");

      return mockUser;
    }

    throw new Error("Credenciais inválidas");
  };

  const logout = useCallback(() => {
    console.log("Logout realizado");
    setUser(null);
    localStorage.removeItem("user");
    router.push("/auth");
  }, [router]);

  return { user, loading, login, logout };
}

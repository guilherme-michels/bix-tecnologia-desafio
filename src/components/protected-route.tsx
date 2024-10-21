import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      console.log("ProtectedRoute: Redirecionando para /auth");
      router.push("/auth");
    }
  }, [user, loading, router]);

  if (loading) {
    console.log("ProtectedRoute: Carregando...");
    return <div>Carregando...</div>;
  }

  if (!user) {
    console.log("ProtectedRoute: Usuário não autenticado");
    return null;
  }

  console.log("ProtectedRoute: Renderizando conteúdo protegido");
  return <>{children}</>;
}

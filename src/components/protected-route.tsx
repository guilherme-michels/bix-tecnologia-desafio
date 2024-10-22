import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { loading, checkAuth } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      setIsChecking(true);
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) {
        router.replace("/auth");
      } else {
        setIsAuthorized(true);
      }
      setIsChecking(false);
    };

    if (!loading) {
      verifyAuth();
    }
  }, [loading, checkAuth, router]);

  if (loading || isChecking) {
    return <div>Carregando...</div>;
  }

  if (!isAuthorized) {
    return null;
  }

  console.log("ProtectedRoute: Renderizando conteúdo protegido");
  return <>{children}</>;
}


import { LoginForm } from "@/components/auth/LoginForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div>
        <LoginForm />
        <div className="mt-4 text-center">
             <Button variant="link" asChild className="text-sm text-destructive hover:text-destructive/80">
                <Link href="/admin/dashboard">
                    Acessar Painel Admin (Simulação)
                </Link>
            </Button>
        </div>
    </div>
  );
}


import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { List, ShieldAlert, LogIn } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from "lucide-react"

const merchantPages = [
  { href: "/auth/login", label: "Login do Comerciante" },
  { href: "/auth/merchant/register", label: "Cadastro de Comerciante (Self-service / Admin)" },
  { href: "/dashboard", label: "Painel Principal (Dashboard Comerciante)" },
  { href: "/dashboard/clients", label: "Gerenciamento de Clientes (Comerciante)" },
  { href: "/dashboard/sales", label: "Registro de Vendas (Comerciante)" },
  { href: "/dashboard/whatsapp", label: "Comunicação via WhatsApp (Comerciante)" },
  { href: "/dashboard/settings", label: "Configurações da Conta (Comerciante)" },
];

const adminPages = [
  { href: "/admin/dashboard", label: "Painel do Administrador" },
  { href: "/admin/users", label: "Gerenciamento de Usuários (Admin, Comerciantes)" },
  { href: "/admin/merchants", label: "Gerenciamento de Comerciantes (Empresas)" },
  { href: "/admin/clients", label: "Gerenciamento de Clientes (Global)" },
  { href: "/admin/sales", label: "Gerenciamento de Vendas (Global)" },
];

const otherPages = [
    { href: "/original-landing-page", label: "Exemplo Landing Page Original" },
];

export default function DevIndexPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen flex flex-col items-center">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <List className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-headline">Páginas Criadas</CardTitle>
          </div>
          <CardDescription>
            Use esta página para navegar e validar todas as telas da aplicação Retorna+ Web.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle className="font-bold">Atenção Desenvolvedor!</AlertTitle>
            <AlertDescription>
              Esta página é apenas para fins de desenvolvimento e validação.
              Lembre-se de removê-la ou reverter a página inicial antes de implantar a versão final.
            </AlertDescription>
          </Alert>

          <section className="mb-8">
            <h2 className="text-xl font-semibold font-headline mb-3 flex items-center">
                <LogIn className="mr-2 h-5 w-5 text-secondary" />
                Fluxo do Comerciante
            </h2>
            <ul className="space-y-3">
                {merchantPages.map((page) => (
                <li key={page.href}>
                    <Button variant="outline" asChild className="w-full justify-start text-lg py-6 hover:bg-muted/50">
                    <Link href={page.href}>
                        {page.label}
                    </Link>
                    </Button>
                </li>
                ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold font-headline mb-3 flex items-center">
                <ShieldAlert className="mr-2 h-5 w-5 text-destructive" />
                Fluxo do Administrador (Novo)
            </h2>
             <Alert variant="default" className="mb-4 border-accent/70 text-accent [&>svg]:text-accent">
                <Terminal className="h-4 w-4" />
                <AlertTitle className="font-bold">Acesso Admin (Simulado)</AlertTitle>
                <AlertDescription>
                Para acessar as telas de admin, utilize o link "Painel do Administrador" na página de <Link href="/auth/login" className="underline">Login</Link> ou navegue diretamente pelos links abaixo.
                </AlertDescription>
            </Alert>
            <ul className="space-y-3">
                {adminPages.map((page) => (
                <li key={page.href}>
                    <Button variant="outline" asChild className="w-full justify-start text-lg py-6 hover:bg-muted/50 border-destructive/30 hover:border-destructive/60">
                    <Link href={page.href}>
                        {page.label}
                    </Link>
                    </Button>
                </li>
                ))}
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold font-headline mb-3">Outras Páginas</h2>
             <ul className="space-y-3">
                {otherPages.map((page) => (
                <li key={page.href}>
                    <Button variant="ghost" asChild className="w-full justify-start text-lg py-6 hover:bg-muted/30">
                    <Link href={page.href}>
                        {page.label}
                    </Link>
                    </Button>
                </li>
                ))}
            </ul>
          </section>

        </CardContent>
      </Card>
      <footer className="py-8 text-center text-foreground/70">
        Retorna+ Web Development Index - {new Date().getFullYear()}
      </footer>
    </div>
  );
}

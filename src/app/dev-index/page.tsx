
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { List } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from "lucide-react"

const appPages = [
  { href: "/original-landing-page", label: "Página Inicial (Exemplo Landing Page Original)" },
  { href: "/auth/login", label: "Login do Comerciante" },
  { href: "/auth/merchant/register", label: "Cadastro de Comerciante" },
  { href: "/dashboard", label: "Painel Principal (Dashboard)" },
  { href: "/dashboard/clients", label: "Gerenciamento de Clientes" },
  { href: "/dashboard/sales", label: "Registro de Vendas" },
  { href: "/dashboard/whatsapp", label: "Comunicação via WhatsApp" },
  { href: "/dashboard/settings", label: "Configurações da Conta" },
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
              Lembre-se de removê-la ou reverter a página inicial antes de implantar a versão final da aplicação ou integrá-la com o backend.
              A rota principal "/" está atualmente redirecionando para esta página de índice.
            </AlertDescription>
          </Alert>

          <ul className="space-y-3">
            {appPages.map((page) => (
              <li key={page.href}>
                <Button variant="outline" asChild className="w-full justify-start text-lg py-6 hover:bg-muted/50">
                  <Link href={page.href}>
                    {page.label}
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <footer className="py-8 text-center text-foreground/70">
        Retorna+ Web Development Index - {new Date().getFullYear()}
      </footer>
    </div>
  );
}

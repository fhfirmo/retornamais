
"use client";

import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function OriginalLandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-muted/40">
      <div className="absolute top-8 left-8">
        <Link href="/dev-index">
          <Button variant="outline">&larr; Voltar para Páginas Criadas</Button>
        </Link>
      </div>
      <div className="text-center">
        <Logo iconSize={48} textSize="text-4xl" className="mb-8 justify-center" />
        <Card className="w-full max-w-lg shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-headline">Bem-vindo ao Retorna+ Web!</CardTitle>
            <CardDescription>Este é um exemplo da sua landing page original.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-foreground">
              Esta página seria o ponto de entrada principal para os visitantes do seu site
              antes de qualquer login ou redirecionamento para o painel de desenvolvimento.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/auth/login">Login do Comerciante</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/auth/merchant/register">Cadastre-se</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        <p className="mt-8 text-sm text-muted-foreground">
          Retorna+ Web &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

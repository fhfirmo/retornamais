
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function HomePageRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Adiciona um pequeno delay para garantir que o router esteja pronto,
    // especialmente em ambientes de desenvolvimento com fast refresh.
    const timer = setTimeout(() => {
      router.replace('/dev-index');
    }, 100); // 100ms delay

    return () => clearTimeout(timer); // Limpa o timeout se o componente for desmontado
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-foreground">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-6" />
      <p className="text-xl font-semibold mb-2">Carregando ambiente de desenvolvimento...</p>
      <p className="text-lg text-muted-foreground mb-4">
        Redirecionando para a lista de páginas criadas.
      </p>
      <Link href="/dev-index" className="text-primary hover:underline font-medium">
        Se não for redirecionado automaticamente, clique aqui.
      </Link>
    </div>
  );
}

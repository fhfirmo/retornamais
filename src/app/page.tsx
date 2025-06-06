import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Users, Gift, MessageSquare } from 'lucide-react';
import { Logo } from '@/components/Logo';
import Image from 'next/image';

export default function HomePage() {
  const features = [
    {
      icon: <Users className="h-8 w-8 text-secondary" />,
      title: "Gestão de Clientes Fácil",
      description: "Cadastre e gerencie seus clientes de forma simples e rápida.",
    },
    {
      icon: <Gift className="h-8 w-8 text-secondary" />,
      title: "Cashback Automático",
      description: "Configure percentuais de cashback e fidelize seus clientes com recompensas.",
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-secondary" />,
      title: "Comunicação via WhatsApp",
      description: "Envie mensagens personalizadas para seus clientes direto pelo WhatsApp.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="py-4 px-6 md:px-10 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <Logo />
          <nav className="space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Entrar</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/merchant/register">Cadastre-se</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-16 md:py-24 bg-gradient-to-br from-background to-muted/30">
          <div className="container mx-auto text-center px-6">
            <h1 className="text-4xl md:text-5xl font-headline font-bold mb-6 text-primary">
              Fidelize seus clientes e aumente suas vendas com Retorna+
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-10 max-w-2xl mx-auto">
              A plataforma completa para gerenciar cashback, clientes e comunicação, tudo em um só lugar.
            </p>
            <Button size="lg" asChild className="shadow-lg">
              <Link href="/auth/merchant/register">Comece Agora Gratuitamente</Link>
            </Button>
            <div className="mt-12 relative aspect-video max-w-4xl mx-auto rounded-lg overflow-hidden shadow-2xl">
                <Image 
                    src="https://placehold.co/1200x675.png" 
                    alt="Dashboard Retorna+" 
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint="dashboard application"
                />
            </div>
          </div>
        </section>

        <section id="features" className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
              Recursos Poderosos para o seu Negócio
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="items-center">
                    <div className="p-3 bg-secondary/20 rounded-full mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/80 text-center">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6">
              Pronto para impulsionar seu negócio?
            </h2>
            <p className="text-lg text-foreground/80 mb-8 max-w-xl mx-auto">
              Junte-se a centenas de comerciantes que já estão transformando o relacionamento com seus clientes.
            </p>
            <Button size="lg" asChild className="shadow-lg">
              <Link href="/auth/merchant/register">Criar minha conta</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t">
        <div className="container mx-auto text-center text-foreground/70">
          &copy; {new Date().getFullYear()} Retorna+ Web. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}

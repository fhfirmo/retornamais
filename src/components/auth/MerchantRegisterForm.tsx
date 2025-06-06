"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres."),
  cnpjCpf: z.string().min(11, "CNPJ/CPF inválido.").max(18, "CNPJ/CPF inválido."), // Handles formats like 00.000.000/0000-00 and 000.000.000-00
  email: z.string().email("Email inválido."),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres."),
});

export function MerchantRegisterForm() {
  const { toast } = useToast();
  const router = useRouter();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      cnpjCpf: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, you'd send this to your backend
    console.log(values);
    toast({
      title: "Cadastro realizado com sucesso!",
      description: "Você será redirecionado em breve.",
    });
    // Add redirection logic here
    router.push('/dashboard');
  }

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Cadastro de Comerciante</CardTitle>
        <CardDescription>Crie sua conta para começar a usar o Retorna+.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Estabelecimento</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Minha Loja Incrível" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cnpjCpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CNPJ/CPF</FormLabel>
                  <FormControl>
                    <Input placeholder="00.000.000/0000-00 ou 000.000.000-00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="seuemail@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Cadastrar
            </Button>
          </form>
        </Form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Button variant="link" asChild className="p-0 h-auto">
            <Link href="/auth/login">
             Faça login
            </Link>
          </Button>
        </p>
      </CardContent>
    </Card>
  );
}

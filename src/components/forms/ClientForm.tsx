"use client";

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
import type { Client } from "@/types";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres."),
  phone: z.string().regex(/^\d{10,15}$/, "Número de telefone inválido (apenas dígitos, ex: 5511999999999)."),
});

interface ClientFormProps {
  client?: Client | null;
  onSubmitSuccess?: (client: Client) => void;
}

export function ClientForm({ client, onSubmitSuccess }: ClientFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: client?.name || "",
      phone: client?.phone || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Client data:", values);
    const newOrUpdatedClient: Client = {
      id: client?.id || crypto.randomUUID(),
      ...values,
      accumulatedCashback: client?.accumulatedCashback || 0,
      currentBalance: client?.currentBalance || 0,
    };
    
    toast({
      title: client ? "Cliente atualizado!" : "Cliente cadastrado!",
      description: `${values.name} foi ${client ? 'atualizado' : 'cadastrado'} com sucesso.`,
    });
    
    if (onSubmitSuccess) {
      onSubmitSuccess(newOrUpdatedClient);
    }
    if (!client) form.reset(); // Reset form if it's for new client
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Cliente</FormLabel>
              <FormControl>
                <Input placeholder="Ex: João da Silva" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone (WhatsApp)</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 5511999999999" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full md:w-auto">
          {client ? "Salvar Alterações" : "Cadastrar Cliente"}
        </Button>
      </form>
    </Form>
  );
}

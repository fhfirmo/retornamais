
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
import type { MerchantUser } from "@/types";
import React from "react";

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres."),
  cnpjCpf: z.string().min(11, "CNPJ/CPF inválido.").max(18, "CNPJ/CPF inválido."), 
  email: z.string().email("Email inválido."),
  // Password field can be optional for editing by admin, or handled differently
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres.").optional(),
});

type MerchantAdminFormValues = z.infer<typeof formSchema>;

interface MerchantAdminFormProps {
  merchant?: MerchantUser | null;
  onSubmit: (values: MerchantAdminFormValues, merchantId?: string) => void;
  onCancel: () => void;
  isEditing: boolean;
}

export function MerchantAdminForm({ merchant, onSubmit, onCancel, isEditing }: MerchantAdminFormProps) {
  const form = useForm<MerchantAdminFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: merchant?.name || "",
      cnpjCpf: merchant?.cnpjCpf || "",
      email: merchant?.email || "",
      password: "", // Password usually not pre-filled for edit
    },
  });

  React.useEffect(() => {
    if (merchant) {
      form.reset({
        name: merchant.name,
        cnpjCpf: merchant.cnpjCpf,
        email: merchant.email,
        password: "",
      });
    } else {
      form.reset({ name: "", cnpjCpf: "", email: "", password: "" });
    }
  }, [merchant, form]);

  const handleSubmit = (values: MerchantAdminFormValues) => {
    onSubmit(values, merchant?.id);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
              <FormLabel>Email de Contato</FormLabel>
              <FormControl>
                <Input type="email" placeholder="contato@loja.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!isEditing && ( // Only show password field when adding, or if a password reset mechanism is desired
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha Inicial (para novo comerciante)</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? "Salvar Alterações" : "Adicionar Comerciante"}
            </Button>
        </div>
      </form>
    </Form>
  );
}

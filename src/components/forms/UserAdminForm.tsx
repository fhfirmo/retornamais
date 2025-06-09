
"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UserAccount } from "@/types";

const brazilianStates = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
  "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC",
  "SP", "SE", "TO"
] as const;

const baseFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres."),
  email: z.string().email("Email inválido."),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido. Formato esperado: 000.000.000-00"),
  city: z.string().min(2, "Cidade deve ter pelo menos 2 caracteres."),
  neighborhood: z.string().min(2, "Bairro deve ter pelo menos 2 caracteres."),
  state: z.enum(brazilianStates, { errorMap: () => ({ message: "Selecione um estado válido."}) }),
  role: z.enum(["admin", "merchant"], { required_error: "Função é obrigatória."}),
});

const createUserFormSchema = baseFormSchema.extend({
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres."),
});

const editUserFormSchema = baseFormSchema.extend({
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres.").optional().or(z.literal('')), // Optional for edit
});


type CreateUserFormValues = z.infer<typeof createUserFormSchema>;
type EditUserFormValues = z.infer<typeof editUserFormSchema>;


interface UserAdminFormProps {
  user?: UserAccount | null;
  onSubmit: (values: CreateUserFormValues | EditUserFormValues, userId?: string) => void;
  onCancel: () => void;
  isEditing: boolean;
}

export function UserAdminForm({ user, onSubmit, onCancel, isEditing }: UserAdminFormProps) {
  const formSchema = isEditing ? editUserFormSchema : createUserFormSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      cpf: user?.cpf || "",
      city: user?.city || "",
      neighborhood: user?.neighborhood || "",
      state: user?.state || undefined,
      role: user?.role || "merchant",
      password: "",
    },
  });

  React.useEffect(() => {
    form.reset({
      name: user?.name || "",
      email: user?.email || "",
      cpf: user?.cpf || "",
      city: user?.city || "",
      neighborhood: user?.neighborhood || "",
      state: user?.state || undefined,
      role: user?.role || "merchant",
      password: "", // Always reset password field for security/UX
    });
  }, [user, form, isEditing]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values, user?.id);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Ex: João da Silva" {...field} />
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
                <Input type="email" placeholder="usuario@exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <Input placeholder="000.000.000-00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                    <Input placeholder="Ex: São Paulo" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="neighborhood"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Bairro</FormLabel>
                <FormControl>
                    <Input placeholder="Ex: Centro" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || undefined}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {brazilianStates.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Função do Usuário</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a função" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="merchant">Comerciante</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{isEditing ? "Nova Senha (opcional)" : "Senha"}</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormDescription>
                {isEditing ? "Deixe em branco para manter a senha atual." : "Mínimo de 6 caracteres."}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-3 pt-4 sticky bottom-0 bg-background py-3">
            <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? "Salvar Alterações" : "Adicionar Usuário"}
            </Button>
        </div>
      </form>
    </Form>
  );
}

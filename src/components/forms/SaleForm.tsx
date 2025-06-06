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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Client, Sale } from "@/types";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  clientId: z.string().min(1, "Selecione um cliente."),
  value: z.coerce.number().positive("Valor da venda deve ser positivo."),
  date: z.date({ required_error: "Data da venda é obrigatória." }),
});

interface SaleFormProps {
  clients: Client[];
  settings: { cashbackPercentage: number }; // Assuming settings are passed
  sale?: Sale | null;
  onSubmitSuccess?: (sale: Sale, updatedClient?: Client) => void;
}

export function SaleForm({ clients, settings, sale, onSubmitSuccess }: SaleFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: sale?.clientId || "",
      value: sale?.value || 0,
      date: sale ? new Date(sale.date) : new Date(),
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const client = clients.find(c => c.id === values.clientId);
    if (!client) {
      toast({ title: "Erro", description: "Cliente não encontrado.", variant: "destructive" });
      return;
    }

    const cashbackGenerated = (values.value * settings.cashbackPercentage) / 100;
    
    const newOrUpdatedSale: Sale = {
      id: sale?.id || crypto.randomUUID(),
      ...values,
      date: values.date.toISOString(),
      cashbackGenerated,
      clientName: client.name, // Add clientName for convenience
    };

    // Update client's balance (simplified)
    const updatedClient: Client = {
      ...client,
      accumulatedCashback: (client.accumulatedCashback || 0) + cashbackGenerated,
      currentBalance: (client.currentBalance || 0) + cashbackGenerated,
    };
    
    console.log("Sale data:", newOrUpdatedSale);
    console.log("Updated client:", updatedClient);

    toast({
      title: sale ? "Venda atualizada!" : "Venda registrada!",
      description: `Venda de R$ ${values.value.toFixed(2)} para ${client.name} ${sale ? 'atualizada' : 'registrada'}.`,
    });
    
    if (onSubmitSuccess) {
      onSubmitSuccess(newOrUpdatedSale, updatedClient);
    }
    if (!sale) form.reset({ clientId: "", value: 0, date: new Date() }); // Reset for new sale
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clients.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name} ({c.phone})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor da Venda (R$)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="Ex: 150.75" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data da Venda</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full md:w-auto">
          {sale ? "Salvar Alterações" : "Registrar Venda"}
        </Button>
      </form>
    </Form>
  );
}

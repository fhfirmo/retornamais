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
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CalendarIcon, Info } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Client, Sale, MerchantSettings, Campaign } from "@/types"; // Ensure MerchantSettings is imported
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import React from "react";

const formSchema = z.object({
  clientId: z.string().min(1, "Selecione um cliente."),
  value: z.coerce.number().positive("Valor da venda deve ser positivo."),
  date: z.date({ required_error: "Data da venda é obrigatória." }),
});

interface SaleFormProps {
  clients: Client[];
  settings: MerchantSettings; 
  sale?: Sale | null;
  onSubmitSuccess?: (sale: Sale, updatedClient?: Client) => void;
}

export function SaleForm({ clients, settings, sale, onSubmitSuccess }: SaleFormProps) {
  const { toast } = useToast();
  const [activeCampaignMessage, setActiveCampaignMessage] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: sale?.clientId || "",
      value: sale?.value || 0,
      date: sale ? new Date(sale.date) : new Date(),
    },
  });

  React.useEffect(() => {
    // Check for active campaigns when component mounts or settings change
    const today = new Date();
    const activeCampaign = settings.campaigns?.find(
      c => {
        const startDate = new Date(c.startDate);
        const endDate = new Date(c.endDate);
        startDate.setHours(0,0,0,0);
        endDate.setHours(23,59,59,999);
        return c.isActive && startDate <= today && endDate >= today;
      }
    );

    if (activeCampaign) {
      setActiveCampaignMessage(`Campanha "${activeCampaign.name}" ativa! Cashback será multiplicado por ${activeCampaign.cashbackMultiplier}x.`);
    } else {
      setActiveCampaignMessage(null);
    }
  }, [settings.campaigns]);


  function onSubmit(values: z.infer<typeof formSchema>) {
    const client = clients.find(c => c.id === values.clientId);
    if (!client) {
      toast({ title: "Erro", description: "Cliente não encontrado.", variant: "destructive" });
      return;
    }

    let effectiveCashbackPercentage = settings.cashbackPercentage;
    const today = new Date();
    const activeCampaign = settings.campaigns?.find(
      c => {
        const startDate = new Date(c.startDate);
        const endDate = new Date(c.endDate);
        startDate.setHours(0,0,0,0);
        endDate.setHours(23,59,59,999);
        return c.isActive && startDate <= today && endDate >= today;
      }
    );

    let campaignToastMessage: string | null = null;
    if (activeCampaign) {
      effectiveCashbackPercentage *= activeCampaign.cashbackMultiplier;
      campaignToastMessage = `Cashback multiplicado por ${activeCampaign.cashbackMultiplier}x devido à campanha "${activeCampaign.name}".`;
       toast({ 
        title: "Campanha Ativa!", 
        description: campaignToastMessage,
        variant: "default",
        className: "bg-yellow-100 border-yellow-400 text-yellow-700"
      });
    }


    const cashbackGenerated = (values.value * effectiveCashbackPercentage) / 100;
    
    const newOrUpdatedSale: Sale = {
      id: sale?.id || crypto.randomUUID(),
      ...values,
      date: values.date.toISOString(),
      cashbackGenerated,
      clientName: client.name, 
    };

    const updatedClient: Client = {
      ...client,
      accumulatedCashback: (client.accumulatedCashback || 0) + cashbackGenerated,
      currentBalance: (client.currentBalance || 0) + cashbackGenerated,
    };
    
    toast({
      title: sale ? "Venda atualizada!" : "Venda registrada!",
      description: `Venda de R$ ${values.value.toFixed(2)} para ${client.name} ${sale ? 'atualizada' : 'registrada'}. Cashback: R$ ${cashbackGenerated.toFixed(2)}`,
    });
    
    if (onSubmitSuccess) {
      onSubmitSuccess(newOrUpdatedSale, updatedClient);
    }
    if (!sale) {
       form.reset({ clientId: "", value: 0, date: new Date() });
    }
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
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || undefined}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clients.length > 0 ? clients.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name} ({c.phone})</SelectItem>
                  )) : <SelectItem value="" disabled>Nenhum cliente disponível</SelectItem>}
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
        {activeCampaignMessage && (
          <Alert variant="default" className="bg-secondary/20 border-secondary text-secondary-foreground [&>svg]:text-secondary">
            <Info className="h-4 w-4" />
            <AlertTitle>Campanha Ativa!</AlertTitle>
            <AlertDescription>
              {activeCampaignMessage}
            </AlertDescription>
          </Alert>
        )}
        <Button type="submit" className="w-full md:w-auto">
          {sale ? "Salvar Alterações" : "Registrar Venda"}
        </Button>
      </form>
    </Form>
  );
}
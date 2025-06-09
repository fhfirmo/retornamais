
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Campaign } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";


const formSchema = z.object({
  name: z.string().min(3, "Nome da campanha deve ter pelo menos 3 caracteres."),
  startDate: z.date({ required_error: "Data de início é obrigatória." }),
  endDate: z.date({ required_error: "Data de término é obrigatória." }),
  cashbackMultiplier: z.coerce.number().min(0.1, "Multiplicador deve ser positivo.").max(10, "Multiplicador muito alto."),
  isActive: z.boolean().default(true),
}).refine(data => data.endDate >= data.startDate, {
  message: "Data de término não pode ser anterior à data de início.",
  path: ["endDate"],
});

interface CampaignFormProps {
  campaign?: Campaign | null;
  onSubmitSuccess: (campaign: Campaign) => void;
}

export function CampaignForm({ campaign, onSubmitSuccess }: CampaignFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: campaign?.name || "",
      startDate: campaign ? parseISO(campaign.startDate) : new Date(),
      endDate: campaign ? parseISO(campaign.endDate) : new Date(new Date().setDate(new Date().getDate() + 7)), // Default to 7 days from now
      cashbackMultiplier: campaign?.cashbackMultiplier || 1,
      isActive: campaign?.isActive === undefined ? true : campaign.isActive,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const campaignData: Campaign = {
      id: campaign?.id || crypto.randomUUID(), // Keep existing ID or generate new
      name: values.name,
      startDate: values.startDate.toISOString(),
      endDate: values.endDate.toISOString(),
      cashbackMultiplier: values.cashbackMultiplier,
      isActive: values.isActive,
    };
    onSubmitSuccess(campaignData);
    if (!campaign) form.reset(); // Reset if it was a new campaign form
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Campanha</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Black Friday Dobrada" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>Data de Início</FormLabel>
                <Popover>
                    <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                        variant={"outline"}
                        className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus locale={ptBR} />
                    </PopoverContent>
                </Popover>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>Data de Término</FormLabel>
                <Popover>
                    <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                        variant={"outline"}
                        className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus locale={ptBR} />
                    </PopoverContent>
                </Popover>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
          control={form.control}
          name="cashbackMultiplier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Multiplicador de Cashback</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" placeholder="Ex: 2 (para 2x cashback)" {...field} />
              </FormControl>
              <FormDescription>
                Ex: 1 para normal, 2 para dobrar o cashback padrão, 0.5 para metade.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Campanha Ativa
                </FormLabel>
                <FormDescription>
                  Marque para ativar esta campanha. Desmarque para desativá-la temporariamente.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full md:w-auto">
          {campaign ? "Salvar Alterações da Campanha" : "Criar Campanha"}
        </Button>
      </form>
    </Form>
  );
}

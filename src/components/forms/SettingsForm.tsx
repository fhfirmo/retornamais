
"use client";

import * as React from "react";
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
import { Textarea } from "@/components/ui/textarea";
import type { MerchantSettings } from "@/types";
import { DEFAULT_MINIMUM_REDEMPTION_VALUE } from "@/lib/constants";

const formSchema = z.object({
  cashbackPercentage: z.coerce
    .number()
    .min(0, "Porcentagem não pode ser negativa.")
    .max(100, "Porcentagem não pode ser maior que 100."),
  whatsappTemplate: z.string().min(10, "Template da mensagem é muito curto."),
  minimumRedemptionValue: z.coerce
    .number()
    .min(0, "Valor mínimo para resgate não pode ser negativo.")
    .optional(),
});

type SettingsSubFormValues = Pick<MerchantSettings, 'cashbackPercentage' | 'whatsappTemplate' | 'minimumRedemptionValue'>;

interface SettingsFormProps {
  settings: SettingsSubFormValues;
  onSubmitSuccess?: (values: SettingsSubFormValues) => void;
}

export function SettingsForm({ settings, onSubmitSuccess }: SettingsFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cashbackPercentage: settings.cashbackPercentage,
      whatsappTemplate: settings.whatsappTemplate,
      minimumRedemptionValue: settings.minimumRedemptionValue === undefined ? DEFAULT_MINIMUM_REDEMPTION_VALUE : settings.minimumRedemptionValue,
    },
  });

  React.useEffect(() => {
    form.reset({
      cashbackPercentage: settings.cashbackPercentage,
      whatsappTemplate: settings.whatsappTemplate,
      minimumRedemptionValue: settings.minimumRedemptionValue === undefined ? DEFAULT_MINIMUM_REDEMPTION_VALUE : settings.minimumRedemptionValue,
    });
  }, [settings, form]);


  function onSubmit(values: z.infer<typeof formSchema>) {
    if (onSubmitSuccess) {
      onSubmitSuccess(values);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="cashbackPercentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Porcentagem de Cashback Padrão (%)</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" placeholder="Ex: 5" {...field} />
              </FormControl>
              <FormDescription>
                A porcentagem do valor da compra que será convertida em cashback (pode ser afetada por campanhas).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="minimumRedemptionValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor Mínimo para Resgate de Cashback (R$)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="Ex: 10" {...field} 
                 onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))}
                 value={field.value === undefined ? '' : field.value}
                />
              </FormControl>
              <FormDescription>
                O saldo mínimo de cashback que o cliente precisa ter para poder resgatar. Deixe 0 ou vazio se não houver mínimo.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="whatsappTemplate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Template Padrão para Mensagens WhatsApp</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Seu template aqui..."
                  {...field}
                  rows={8}
                  className="min-h-[150px]"
                />
              </FormControl>
              <FormDescription>
                Use as chaves: {"{{{clientName}}}, {{{purchaseValue}}}, {{{cashbackFromThisPurchase}}}, {{{newCurrentBalance}}}, {{{redemptionInfo}}}."}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Salvar Preferências</Button>
      </form>
    </Form>
  );
}

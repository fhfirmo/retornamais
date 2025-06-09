
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
import { Textarea } from "@/components/ui/textarea";
import type { MerchantSettings } from "@/types"; // Only needs a subset for this form
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  cashbackPercentage: z.coerce
    .number()
    .min(0, "Porcentagem não pode ser negativa.")
    .max(100, "Porcentagem não pode ser maior que 100."),
  whatsappTemplate: z.string().min(10, "Template da mensagem é muito curto."),
});

// This form only handles a part of MerchantSettings
type SettingsSubFormValues = Pick<MerchantSettings, 'cashbackPercentage' | 'whatsappTemplate'>;

interface SettingsFormProps {
  settings: SettingsSubFormValues;
  onSubmitSuccess?: (values: SettingsSubFormValues) => void;
}

export function SettingsForm({ settings, onSubmitSuccess }: SettingsFormProps) {
  const { toast } = useToast(); // Kept for consistency, though parent page handles toast
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cashbackPercentage: settings.cashbackPercentage,
      whatsappTemplate: settings.whatsappTemplate,
    },
  });

  // Watch for external changes to settings props
  React.useEffect(() => {
    form.reset({
      cashbackPercentage: settings.cashbackPercentage,
      whatsappTemplate: settings.whatsappTemplate,
    });
  }, [settings, form]);


  function onSubmit(values: z.infer<typeof formSchema>) {
    // Parent component will handle the actual update and toast
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
                Este template será usado como base para gerar mensagens. Use as chaves:
                {" {{{clientName}}}, {{{purchaseValue}}}, {{{accumulatedCashback}}}, {{{currentBalance}}}."}
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

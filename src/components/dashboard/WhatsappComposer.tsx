
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Copy, Send, SendHorizonal } from "lucide-react";
import { useState, useEffect } from "react";
import type { Client, MerchantSettings } from "@/types";
import { DEFAULT_WHATSAPP_TEMPLATE } from "@/lib/constants";
import { generateWhatsappMessageAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  clientId: z.string().optional(),
  clientName: z.string().min(1, "Nome do cliente é obrigatório."),
  phoneNumber: z.string().min(10, "Número de telefone inválido (ex: 5511999999999).").regex(/^\d+$/, "Telefone deve conter apenas números."),
  purchaseValue: z.coerce.number().positive("Valor da compra deve ser positivo."),
  cashbackFromThisPurchase: z.coerce.number().min(0, "Cashback desta compra não pode ser negativo."),
  newCurrentBalance: z.coerce.number().min(0, "Novo saldo atual não pode ser negativo."),
  minimumRedemptionValue: z.coerce.number().min(0, "Valor mínimo para resgate não pode ser negativo.").optional(),
  template: z.string().min(10, "Template da mensagem é muito curto."),
});

type WhatsappFormValues = z.infer<typeof formSchema>;

interface WhatsappComposerProps {
  clients: Client[];
  merchantSettings: MerchantSettings;
  initialClient?: Client | null;
  initialPurchaseValue?: number;
  initialCashbackFromThisPurchase?: number;
  initialNewCurrentBalance?: number;
}

export function WhatsappComposer({ 
  clients, 
  merchantSettings,
  initialClient, 
  initialPurchaseValue, 
  initialCashbackFromThisPurchase,
  initialNewCurrentBalance 
}: WhatsappComposerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<WhatsappFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: initialClient?.id || "",
      clientName: initialClient?.name || "",
      phoneNumber: initialClient?.phone || "",
      purchaseValue: initialPurchaseValue || 0,
      cashbackFromThisPurchase: initialCashbackFromThisPurchase || 0,
      newCurrentBalance: initialNewCurrentBalance || initialClient?.currentBalance || 0,
      minimumRedemptionValue: merchantSettings.minimumRedemptionValue,
      template: merchantSettings.whatsappTemplate || DEFAULT_WHATSAPP_TEMPLATE,
    },
  });

  useEffect(() => {
    form.reset({
      clientId: initialClient?.id || "",
      clientName: initialClient?.name || "",
      phoneNumber: initialClient?.phone || "",
      purchaseValue: initialPurchaseValue !== undefined ? initialPurchaseValue : (initialClient ? 0 : 0),
      cashbackFromThisPurchase: initialCashbackFromThisPurchase !== undefined ? initialCashbackFromThisPurchase : 0,
      newCurrentBalance: initialNewCurrentBalance !== undefined ? initialNewCurrentBalance : (initialClient?.currentBalance || 0),
      minimumRedemptionValue: merchantSettings.minimumRedemptionValue,
      template: merchantSettings.whatsappTemplate || DEFAULT_WHATSAPP_TEMPLATE,
    });
  }, [initialClient, initialPurchaseValue, initialCashbackFromThisPurchase, initialNewCurrentBalance, merchantSettings, form]);

  const handleClientSelection = (clientId: string) => {
    const selected = clients.find(c => c.id === clientId);
    if (selected) {
      form.setValue("clientId", selected.id); 
      form.setValue("clientName", selected.name);
      form.setValue("phoneNumber", selected.phone);
      // When a client is selected, their currentBalance is their newCurrentBalance *before* any new purchase
      form.setValue("newCurrentBalance", selected.currentBalance); 
      // Reset purchase-specific fields if a client is selected manually,
      // unless they were pre-filled from another page (e.g. sales)
      if(initialPurchaseValue === undefined) form.setValue("purchaseValue", 0); 
      if(initialCashbackFromThisPurchase === undefined) form.setValue("cashbackFromThisPurchase", 0);
    }
  }

  async function onSubmit(values: WhatsappFormValues) {
    setIsLoading(true);
    setGeneratedMessage(null);

    // Ensure minimumRedemptionValue is either a number or undefined (not null)
    const submissionValues = {
      ...values,
      minimumRedemptionValue: values.minimumRedemptionValue === null ? undefined : values.minimumRedemptionValue,
    };

    try {
      const result = await generateWhatsappMessageAction(submissionValues);
      if (result.success && result.message) {
        setGeneratedMessage(result.message);
        toast({ title: "Mensagem Gerada!", description: "Sua mensagem personalizada está pronta." });
      } else {
        toast({ title: "Erro ao Gerar Mensagem", description: result.error || "Tente novamente.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error in WhatsappComposer onSubmit:", error);
      toast({ title: "Erro Inesperado", description: "Ocorreu um problema.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  const copyToClipboard = () => {
    if (generatedMessage) {
      navigator.clipboard.writeText(generatedMessage);
      toast({ title: "Mensagem Copiada!", description: "A mensagem foi copiada para a área de transferência." });
    }
  }
  
  const openWhatsApp = () => {
    if (generatedMessage && form.getValues("phoneNumber")) {
      const phone = form.getValues("phoneNumber").replace(/\D/g, '');
      const text = encodeURIComponent(generatedMessage);
      const whatsappUrl = `https://wa.me/${phone.startsWith("55") ? phone : "55" + phone}?text=${text}`;
      window.open(whatsappUrl, "_blank");
    }
  }

  const sendViaSystem = () => {
    if (generatedMessage && form.getValues("phoneNumber")) {
        toast({
            title: "Simulação de Envio",
            description: `Mensagem para ${form.getValues("clientName")} enviada via sistema (simulação).`,
            className: "bg-blue-100 border-blue-400 text-blue-700"
        });
        console.log("Simulating send via system:", {
            phone: form.getValues("phoneNumber"),
            message: generatedMessage
        });
    } else {
        toast({
            title: "Nada para enviar",
            description: "Gere uma mensagem primeiro.",
            variant: "destructive"
        });
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Gerador de Mensagem WhatsApp</CardTitle>
          <CardDescription>Crie mensagens personalizadas para seus clientes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selecionar Cliente (Opcional)</FormLabel>
                    <Select onValueChange={(value) => { field.onChange(value); handleClientSelection(value); }} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Escolha um cliente para preencher os dados" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="clientName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Cliente</FormLabel>
                      <FormControl><Input placeholder="Nome do Cliente" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone (WhatsApp)</FormLabel>
                      <FormControl><Input placeholder="5511999999999" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid sm:grid-cols-3 gap-4">
                <FormField control={form.control} name="purchaseValue" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor da Compra (R$)</FormLabel>
                      <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField control={form.control} name="cashbackFromThisPurchase" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cashback Desta Compra (R$)</FormLabel>
                      <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField control={form.control} name="newCurrentBalance" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Novo Saldo de Cashback (R$)</FormLabel>
                      <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* minimumRedemptionValue is taken from merchantSettings and passed to the action, not a direct form field for user */}
              <FormField
                control={form.control}
                name="template"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template da Mensagem</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Seu template aqui..." {...field} rows={6} className="min-h-[120px]" />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      Use: {"{{{clientName}}}, {{{purchaseValue}}}, {{{cashbackFromThisPurchase}}}, {{{newCurrentBalance}}}, {{{redemptionInfo}}}"}
                    </p>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Gerar Mensagem com IA
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="shadow-lg sticky top-20">
        <CardHeader>
          <CardTitle className="font-headline">Mensagem Gerada</CardTitle>
          <CardDescription>Revise a mensagem antes de enviar.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {!isLoading && generatedMessage && (
            <div className="space-y-4">
              <Textarea value={generatedMessage} readOnly rows={10} className="bg-muted/30 min-h-[200px]" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Button onClick={copyToClipboard} variant="outline" className="w-full">
                  <Copy className="mr-2 h-4 w-4" /> Copiar
                </Button>
                <Button onClick={openWhatsApp} className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <Send className="mr-2 h-4 w-4" /> Abrir no App
                </Button>
                 <Button onClick={sendViaSystem} variant="default" className="w-full bg-accent hover:bg-accent/90">
                  <SendHorizonal className="mr-2 h-4 w-4" /> Enviar (Sistema)
                </Button>
              </div>
            </div>
          )}
          {!isLoading && !generatedMessage && (
            <p className="text-muted-foreground text-center py-10">
              Preencha o formulário e clique em "Gerar Mensagem" para ver o resultado aqui.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

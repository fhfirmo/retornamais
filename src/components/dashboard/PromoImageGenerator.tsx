
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Image as ImageIcon, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generatePromoImageAction } from '@/lib/actions';
import Image from 'next/image'; // For displaying the generated image

export function PromoImageGenerator() {
  const [prompt, setPrompt] = useState<string>("");
  const [generatedImageUri, setGeneratedImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast({ title: "Prompt Vazio", description: "Por favor, insira uma ideia para a imagem.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImageUri(null);

    try {
      const result = await generatePromoImageAction(prompt);
      if (result.success && result.imageDataUri) {
        setGeneratedImageUri(result.imageDataUri);
        toast({ title: "Imagem Gerada!", description: "Sua imagem promocional está pronta." });
      } else {
        setError(result.error || "Falha ao gerar imagem.");
        toast({ title: "Erro na Geração", description: result.error || "Não foi possível gerar a imagem.", variant: "destructive" });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
      setError(errorMessage);
      toast({ title: "Erro Inesperado", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          <ImageIcon className="mr-2 h-6 w-6 text-primary" />
          Gerador de Imagem Promocional (IA)
        </CardTitle>
        <CardDescription>
          Descreva uma ideia para sua imagem promocional e deixe a IA criar para você! (Experimental)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="promo-prompt" className="block text-sm font-medium text-muted-foreground mb-1">
              Ideia para a imagem:
            </label>
            <Textarea
              id="promo-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Um cliente sorrindo ao receber um cupom de cashback em uma loja moderna."
              rows={3}
              className="min-h-[80px]"
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ImageIcon className="mr-2 h-4 w-4" />
            )}
            Gerar Imagem
          </Button>
        </form>

        {isLoading && (
          <div className="mt-6 flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg min-h-[200px]">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-3" />
            <p className="text-muted-foreground">Gerando sua imagem, aguarde...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="mt-6 p-4 bg-destructive/10 border border-destructive/30 rounded-md text-destructive flex items-center gap-3">
            <AlertTriangle className="h-6 w-6" />
            <div>
                <p className="font-semibold">Erro ao gerar imagem:</p>
                <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {generatedImageUri && !isLoading && !error && (
          <div className="mt-6 space-y-3">
            <h3 className="text-lg font-semibold font-headline">Imagem Gerada:</h3>
            <div className="border rounded-lg overflow-hidden aspect-video relative bg-muted">
              <Image
                src={generatedImageUri}
                alt={`Imagem promocional gerada para: ${prompt}`}
                layout="fill"
                objectFit="contain"
                data-ai-hint="generated promotion"
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">
                Esta é uma imagem gerada por IA e pode não ser perfeita. Use como inspiração.
            </p>
          </div>
        )}
         {!generatedImageUri && !isLoading && !error && (
            <div className="mt-6 flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg min-h-[200px] bg-muted/30">
                <ImageIcon className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
                <p className="text-muted-foreground text-center">Sua imagem aparecerá aqui após a geração.</p>
            </div>
         )}
      </CardContent>
    </Card>
  );
}

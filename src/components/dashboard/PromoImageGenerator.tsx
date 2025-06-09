
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Image as ImageIcon, Loader2, AlertTriangle, Sparkles } from 'lucide-react';
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
          <Sparkles className="mr-2 h-6 w-6 text-primary" /> {/* Changed Icon */}
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
          <Button type="submit" disabled={isLoading || !prompt.trim()} className="w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ImageIcon className="mr-2 h-4 w-4" />
            )}
            Gerar Imagem
          </Button>
        </form>

        <div className="mt-6 border-2 border-dashed rounded-lg min-h-[250px] flex items-center justify-center p-4 bg-muted/20 relative aspect-video">
          {isLoading && (
            <div className="flex flex-col items-center justify-center text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-3" />
              <p className="text-muted-foreground">Gerando sua imagem, aguarde um momento...</p>
              <p className="text-xs text-muted-foreground">(Isso pode levar alguns segundos)</p>
            </div>
          )}

          {error && !isLoading && (
            <div className="text-destructive text-center p-4">
              <AlertTriangle className="h-12 w-12 mx-auto mb-3 opacity-70" />
              <p className="font-semibold">Erro ao gerar imagem:</p>
              <p className="text-sm">{error}</p>
              <p className="text-xs mt-2">Tente refinar seu prompt ou tente novamente mais tarde.</p>
            </div>
          )}

          {generatedImageUri && !isLoading && !error && (
            <>
              <Image
                src={generatedImageUri}
                alt={`Imagem promocional gerada para: ${prompt}`}
                layout="fill"
                objectFit="contain"
                data-ai-hint="generated promotion"
                className="rounded-md"
              />
               <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-background/80 bg-foreground/70 px-2 py-0.5 rounded">
                  Imagem gerada por IA
              </p>
            </>
          )}

          {!isLoading && !error && !generatedImageUri && (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground">
              <ImageIcon className="h-16 w-16 opacity-30 mb-3" />
              <p>Sua imagem promocional aparecerá aqui.</p>
              <p className="text-xs">Digite uma descrição acima e clique em "Gerar Imagem".</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

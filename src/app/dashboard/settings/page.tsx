
"use client";

import React, { useState, useEffect } from "react";
import { SettingsForm } from "@/components/forms/SettingsForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon, UserCog, Gift, CalendarPlus, PlusCircle } from "lucide-react";
import type { MerchantSettings, Campaign, MerchantUser } from "@/types";
import { DEFAULT_CASHBACK_PERCENTAGE, DEFAULT_WHATSAPP_TEMPLATE, DEFAULT_MINIMUM_REDEMPTION_VALUE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { CampaignForm } from "@/components/forms/CampaignForm";
import { CampaignList } from "@/components/lists/CampaignList";
import { useToast } from "@/hooks/use-toast";

const mockMerchantUser: Omit<MerchantUser, 'id' | 'role' | 'email'> = {
  name: "Loja Exemplo Retorna+",
  cnpjCpf: "00.000.000/0001-00",
};

const initialSettings: MerchantSettings = {
  cashbackPercentage: DEFAULT_CASHBACK_PERCENTAGE,
  whatsappTemplate: DEFAULT_WHATSAPP_TEMPLATE,
  minimumRedemptionValue: DEFAULT_MINIMUM_REDEMPTION_VALUE,
  campaigns: [
    { id: "camp1", name: "Natal Premiado", startDate: "2024-12-01", endDate: "2024-12-25", cashbackMultiplier: 2, isActive: true },
    { id: "camp2", name: "Aniversário da Loja", startDate: "2025-03-10", endDate: "2025-03-17", cashbackMultiplier: 1.5, isActive: false },
  ],
};

export default function SettingsPage() {
  const [merchantInfo, setMerchantInfo] = useState(mockMerchantUser);
  const [settings, setSettings] = useState<MerchantSettings>(initialSettings);
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load settings from backend/localStorage in a real app
  }, []);

  const handleSettingsUpdate = (updatedSettings: Pick<MerchantSettings, 'cashbackPercentage' | 'whatsappTemplate' | 'minimumRedemptionValue'>) => {
    setSettings(prev => ({...prev, ...updatedSettings}));
    toast({ title: "Preferências Salvas!", description: "Configurações de cashback, template e mínimo para resgate atualizadas."});
    // Persist to backend
  };

  const handleMerchantInfoUpdate = (updatedInfo: Partial<typeof mockMerchantUser>) => {
    setMerchantInfo(prev => ({...prev, ...updatedInfo}));
    toast({ title: "Informações Atualizadas!", description: "Dados do comerciante salvos."});
     // Persist to backend
  };

  const handleCampaignSubmit = (campaign: Campaign) => {
    setSettings(prev => {
      const campaigns = prev.campaigns ? [...prev.campaigns] : [];
      if (editingCampaign) {
        const index = campaigns.findIndex(c => c.id === campaign.id);
        if (index > -1) campaigns[index] = campaign;
        toast({title: "Campanha Atualizada!", description: `"${campaign.name}" foi atualizada.`});
      } else {
        campaigns.push({ ...campaign, id: crypto.randomUUID() });
        toast({title: "Campanha Adicionada!", description: `"${campaign.name}" foi criada.`});
      }
      return { ...prev, campaigns };
    });
    setShowCampaignForm(false);
    setEditingCampaign(null);
  };
  
  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setShowCampaignForm(true);
  };

  const handleDeleteCampaign = (campaignId: string) => {
    setSettings(prev => ({
        ...prev,
        campaigns: prev.campaigns?.filter(c => c.id !== campaignId)
    }));
    toast({title: "Campanha Removida!", variant: "destructive"});
  }


  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-3xl font-headline font-bold flex items-center">
            <SettingsIcon className="mr-3 h-8 w-8 text-primary" />
            Configurações da Conta
          </h1>
        <p className="text-muted-foreground">Ajuste as preferências da sua plataforma Retorna+.</p>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><UserCog className="mr-2 h-6 w-6 text-secondary"/> Dados do Comerciante</CardTitle>
          <CardDescription>
            Informações do seu estabelecimento. (Campos apenas para visualização no protótipo)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-muted-foreground">Nome do Estabelecimento</label>
                <p className="text-lg font-semibold">{merchantInfo.name}</p>
            </div>
            <div>
                <label className="block text-sm font-medium text-muted-foreground">CNPJ/CPF</label>
                <p className="text-lg font-semibold">{merchantInfo.cnpjCpf}</p>
            </div>
            {/* In a real app, there would be a form here to edit these values */}
            <Button variant="outline" disabled>Editar Dados (Indisponível no Protótipo)</Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><Gift className="mr-2 h-6 w-6 text-secondary"/> Preferências de Cashback e Mensagens</CardTitle>
          <CardDescription>
            Personalize como o sistema de cashback funciona e os modelos de mensagem para WhatsApp.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm 
            settings={{ 
              cashbackPercentage: settings.cashbackPercentage, 
              whatsappTemplate: settings.whatsappTemplate,
              minimumRedemptionValue: settings.minimumRedemptionValue 
            }} 
            onSubmitSuccess={handleSettingsUpdate} 
          />
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-row justify-between items-center">
            <div>
                <CardTitle className="font-headline flex items-center"><CalendarPlus className="mr-2 h-6 w-6 text-secondary"/> Campanhas de Cashback</CardTitle>
                <CardDescription>
                    Crie campanhas para multiplicar o cashback em períodos específicos.
                </CardDescription>
            </div>
            {!showCampaignForm && (
                <Button onClick={() => { setShowCampaignForm(true); setEditingCampaign(null);}}>
                    <PlusCircle className="mr-2 h-5 w-5" /> Nova Campanha
                </Button>
            )}
        </CardHeader>
        <CardContent>
            {showCampaignForm && (
                <div className="mb-6 p-4 border rounded-md bg-muted/20">
                    <h3 className="text-xl font-semibold mb-3">{editingCampaign ? "Editar Campanha" : "Criar Nova Campanha"}</h3>
                    <CampaignForm 
                        campaign={editingCampaign} 
                        onSubmitSuccess={handleCampaignSubmit} 
                    />
                    <Button variant="outline" className="mt-4" onClick={() => {setShowCampaignForm(false); setEditingCampaign(null);}}>Cancelar</Button>
                </div>
            )}
            <CampaignList 
                campaigns={settings.campaigns || []} 
                onEdit={handleEditCampaign} 
                onDelete={handleDeleteCampaign}
            />
        </CardContent>
      </Card>

    </div>
  );
}

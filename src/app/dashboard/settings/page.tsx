"use client";

import React, { useState, useEffect } from "react";
import { SettingsForm } from "@/components/forms/SettingsForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";
import type { MerchantSettings } from "@/types";
import { DEFAULT_CASHBACK_PERCENTAGE, DEFAULT_WHATSAPP_TEMPLATE } from "@/lib/constants";

// Mock settings - In a real app, this would be fetched and persisted
const initialSettings: MerchantSettings = {
  cashbackPercentage: DEFAULT_CASHBACK_PERCENTAGE,
  whatsappTemplate: DEFAULT_WHATSAPP_TEMPLATE,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<MerchantSettings>(initialSettings);

  // Effect to load settings (e.g., from localStorage or API)
  useEffect(() => {
    // const savedSettings = localStorage.getItem("merchantSettings");
    // if (savedSettings) {
    //   setSettings(JSON.parse(savedSettings));
    // }
  }, []);

  const handleSettingsUpdate = (updatedSettings: MerchantSettings) => {
    setSettings(updatedSettings);
    // localStorage.setItem("merchantSettings", JSON.stringify(updatedSettings));
    // Here you would also persist to your backend
  };

  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-headline font-bold flex items-center">
            <SettingsIcon className="mr-3 h-8 w-8 text-primary" />
            Configurações da Conta
          </h1>
        <p className="text-muted-foreground">Ajuste as preferências da sua plataforma Retorna+.</p>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Preferências de Cashback e Mensagens</CardTitle>
          <CardDescription>
            Personalize como o sistema de cashback funciona e os modelos de mensagem para WhatsApp.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm settings={settings} onSubmitSuccess={handleSettingsUpdate} />
        </CardContent>
      </Card>
    </div>
  );
}

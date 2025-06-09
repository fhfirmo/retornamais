
"use client";

import type { Campaign } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, CalendarOff, CalendarCheck2, Power, PowerOff } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Switch } from "@/components/ui/switch"; // Import Switch

interface CampaignListProps {
  campaigns: Campaign[];
  onEdit: (campaign: Campaign) => void;
  onDelete: (campaignId: string) => void;
  onToggleActive: (campaignId: string, currentIsActive: boolean) => void;
}

export function CampaignList({ campaigns, onEdit, onDelete, onToggleActive }: CampaignListProps) {
  if (!campaigns || campaigns.length === 0) {
    return <p className="text-muted-foreground text-center py-6">Nenhuma campanha configurada.</p>;
  }

  const isCampaignCurrentlyRunning = (campaign: Campaign): boolean => {
    if (campaign.isActive === false) return false; // Explicitly check for false, as undefined means active by default
    const today = new Date();
    const startDate = new Date(campaign.startDate);
    const endDate = new Date(campaign.endDate);
    startDate.setHours(0,0,0,0);
    endDate.setHours(23,59,59,999);
    return today >= startDate && today <= endDate;
  }

  return (
    <ul className="space-y-4">
      {campaigns.map((campaign) => {
        const currentlyRunning = isCampaignCurrentlyRunning(campaign);
        const campaignIsActiveFlag = campaign.isActive !== false; // Treat undefined as active

        return (
          <li key={campaign.id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-card">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="flex-grow">
                <h4 className="text-lg font-semibold text-primary">{campaign.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Período: {format(new Date(campaign.startDate), "dd/MM/yyyy", { locale: ptBR })} - {format(new Date(campaign.endDate), "dd/MM/yyyy", { locale: ptBR })}
                </p>
                <p className="text-sm">
                  Multiplicador: <Badge variant="secondary">{campaign.cashbackMultiplier}x</Badge>
                </p>
              </div>
              <div className="mt-3 sm:mt-0 flex flex-col items-end space-y-2">
                {currentlyRunning ? (
                   <Badge className="bg-green-500 hover:bg-green-600 text-white py-1 px-2.5">
                     <CalendarCheck2 className="mr-1.5 h-4 w-4"/> Em Execução
                   </Badge>
                ) : (
                  <Badge variant={campaignIsActiveFlag ? "outline" : "destructive"} className={`${campaignIsActiveFlag ? "border-orange-500 text-orange-600" : ""} py-1 px-2.5`}>
                    {campaignIsActiveFlag ? <CalendarCheck2 className="mr-1.5 h-4 w-4"/> : <CalendarOff className="mr-1.5 h-4 w-4"/>}
                    {campaignIsActiveFlag ? "Agendada/Expirada" : "Desativada Manualmente"}
                  </Badge>
                )}
                 <div className="flex items-center space-x-2">
                    <label htmlFor={`toggle-${campaign.id}`} className="text-xs text-muted-foreground">
                      {campaignIsActiveFlag ? "Ativada" : "Desativada"}
                    </label>
                    <Switch
                        id={`toggle-${campaign.id}`}
                        checked={campaignIsActiveFlag}
                        onCheckedChange={() => onToggleActive(campaign.id, campaignIsActiveFlag)}
                        aria-label={campaignIsActiveFlag ? "Desativar campanha" : "Ativar campanha"}
                    />
                 </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t flex justify-end space-x-2">
              <Button variant="ghost" size="sm" onClick={() => onEdit(campaign)}>
                <Edit className="mr-1 h-4 w-4" /> Editar
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(campaign.id)} className="text-destructive hover:text-destructive/90 hover:bg-destructive/10">
                <Trash2 className="mr-1 h-4 w-4" /> Excluir
              </Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

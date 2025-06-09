
"use client";

import type { Campaign } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, CalendarOff, CalendarCheck2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CampaignListProps {
  campaigns: Campaign[];
  onEdit: (campaign: Campaign) => void;
  onDelete: (campaignId: string) => void;
  // onToggleActive?: (campaignId: string, isActive: boolean) => void; // Optional: for quick toggle
}

export function CampaignList({ campaigns, onEdit, onDelete }: CampaignListProps) {
  if (!campaigns || campaigns.length === 0) {
    return <p className="text-muted-foreground text-center py-6">Nenhuma campanha configurada.</p>;
  }

  const isCampaignCurrentlyActive = (campaign: Campaign): boolean => {
    if (!campaign.isActive) return false;
    const today = new Date();
    const startDate = new Date(campaign.startDate);
    const endDate = new Date(campaign.endDate);
    // Set hours to ensure full day coverage
    startDate.setHours(0,0,0,0);
    endDate.setHours(23,59,59,999);
    return today >= startDate && today <= endDate;
  }

  return (
    <ul className="space-y-4">
      {campaigns.map((campaign) => {
        const currentlyActive = isCampaignCurrentlyActive(campaign);
        return (
          <li key={campaign.id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-card">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h4 className="text-lg font-semibold text-primary">{campaign.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Período: {format(new Date(campaign.startDate), "dd/MM/yyyy", { locale: ptBR })} - {format(new Date(campaign.endDate), "dd/MM/yyyy", { locale: ptBR })}
                </p>
                <p className="text-sm">
                  Multiplicador: <Badge variant="secondary">{campaign.cashbackMultiplier}x</Badge>
                </p>
              </div>
              <div className="mt-3 sm:mt-0 flex items-center space-x-2">
                {currentlyActive ? (
                   <Badge className="bg-green-500 hover:bg-green-600 text-white">
                     <CalendarCheck2 className="mr-1 h-3.5 w-3.5"/> Ativa Agora
                   </Badge>
                ) : (
                  <Badge variant={campaign.isActive ? "outline" : "destructive"} className={campaign.isActive ? "border-orange-500 text-orange-600" : ""}>
                    {campaign.isActive ? <CalendarCheck2 className="mr-1 h-3.5 w-3.5"/> : <CalendarOff className="mr-1 h-3.5 w-3.5"/>}
                    {campaign.isActive ? "Agendada/Passada" : "Desativada"}
                  </Badge>
                )}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t flex justify-end space-x-2">
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

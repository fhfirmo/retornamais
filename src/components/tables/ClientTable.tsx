
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MessageSquare, Eye } from "lucide-react";
import type { Client } from "@/types";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface ClientTableProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (clientId: string) => void;
  onSendMessage: (client: Client) => void;
}

export function ClientTable({ clients, onEdit, onDelete, onSendMessage }: ClientTableProps) {
  if (clients.length === 0) {
    return <p className="text-muted-foreground text-center py-8">Nenhum cliente encontrado.</p>;
  }
  
  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Telefone (WhatsApp)</TableHead>
            <TableHead className="text-right">Saldo Cashback (R$)</TableHead>
            <TableHead className="text-right">Cashback Resgatado (R$)</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">{client.name}</TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell className="text-right">
                <Badge variant="secondary" className="bg-secondary/30 text-secondary-foreground">
                  {client.currentBalance.toFixed(2)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Badge variant="outline" className="text-green-700 border-green-500">
                  {(client.cashbackRedeemed || 0).toFixed(2)}
                </Badge>
              </TableCell>
              <TableCell className="text-center space-x-1 sm:space-x-2">
                <Button variant="ghost" size="icon" asChild title="Ver Detalhes">
                  <Link href={`/dashboard/clients/${client.id}`}>
                    <Eye className="h-4 w-4 text-blue-500" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onSendMessage(client)} title="Enviar WhatsApp">
                  <MessageSquare className="h-4 w-4 text-accent" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onEdit(client)} title="Editar Cliente">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(client.id)} title="Excluir Cliente">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

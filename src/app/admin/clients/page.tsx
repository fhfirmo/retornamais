
"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Briefcase, Search, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Client } from "@/types";
import { initialGlobalClients, merchantNames } from "@/lib/mockData"; // Import from centralized mock data
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>(initialGlobalClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMerchantId, setFilterMerchantId] = useState("");
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const { toast } = useToast();


  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const searchMatch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          client.phone.includes(searchTerm);
      const merchantMatch = filterMerchantId ? client.merchantId === filterMerchantId : true;
      return searchMatch && merchantMatch;
    });
  }, [clients, searchTerm, filterMerchantId]);


  const handleEditClient = (client: Client) => {
    console.log("Edit client (Admin):", client);
    alert(`Editar cliente: ${client.name} (Admin) - Funcionalidade de edição completa a ser implementada.`);
  };

  const handleDeleteRequest = (client: Client) => {
    setClientToDelete(client);
  };

  const handleDeleteConfirm = () => {
    if (clientToDelete) {
      setClients(prevClients => prevClients.filter(c => c.id !== clientToDelete.id));
      // Em um app real, você também faria uma chamada API para atualizar initialGlobalClients ou a base de dados.
      // Por agora, a alteração é apenas no estado local da página.
      // Para simular a persistência no mockData, você precisaria de uma função para atualizar o array exportado.
      // Ex: removeClientFromGlobalMock(clientToDelete.id);
      const index = initialGlobalClients.findIndex(c => c.id === clientToDelete.id);
      if (index > -1) {
        initialGlobalClients.splice(index, 1);
      }

      toast({ title: "Cliente Excluído!", description: `O cliente ${clientToDelete.name} foi excluído globalmente (simulação).` });
      setClientToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold flex items-center">
          <Briefcase className="mr-3 h-8 w-8 text-primary" />
          Gerenciamento de Clientes (Global)
        </h1>
        <p className="text-muted-foreground">Visualize e gerencie todos os clientes da plataforma.</p>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-headline">Lista Global de Clientes</CardTitle>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                type="text"
                placeholder="Buscar por nome ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
                />
            </div>
            <Input
              type="text"
              placeholder="Filtrar por ID do Comerciante (ex: merch1)"
              value={filterMerchantId}
              onChange={(e) => setFilterMerchantId(e.target.value)}
              className="w-full"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredClients.length > 0 ? (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome Cliente</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Comerciante</TableHead>
                    <TableHead className="text-right">Saldo (R$)</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>{client.phone}</TableCell>
                      <TableCell>{client.merchantId ? merchantNames[client.merchantId] || client.merchantId : 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">{client.currentBalance.toFixed(2)}</Badge>
                      </TableCell>
                      <TableCell className="text-center space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditClient(client)} title="Editar Cliente">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteRequest(client)} title="Excluir Cliente">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">Nenhum cliente encontrado com os filtros atuais.</p>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!clientToDelete} onOpenChange={() => setClientToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o cliente "{clientToDelete?.name}" globalmente? Esta ação não pode ser desfeita e removerá o cliente de todos os comerciantes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CardDescription className="text-xs text-muted-foreground">
        Clientes também podem ser cadastrados por Administradores ou Comerciantes em seus respectivos painéis. A exclusão aqui é global.
      </CardDescription>
    </div>
  );
}

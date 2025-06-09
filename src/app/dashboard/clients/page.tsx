
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ClientForm } from "@/components/forms/ClientForm";
import { ClientTable } from "@/components/tables/ClientTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlusCircle, Users, Search } from "lucide-react";
import type { Client } from "@/types";
import { useToast } from "@/hooks/use-toast";
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
import { useRouter } from "next/navigation";
import { mockMerchantClients } from "@/lib/mockData"; // Import from centralized mock data


export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setClients(mockMerchantClients);
  }, []);

  const filteredClients = useMemo(() => {
    if (!searchTerm) return clients;
    return clients.filter(client => 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm)
    );
  }, [clients, searchTerm]);

  const handleFormSubmit = (client: Client) => {
    if (editingClient) {
      setClients(clients.map(c => c.id === client.id ? client : c));
      toast({ title: "Cliente Atualizado", description: `${client.name} foi atualizado.`});
    } else {
      // Simulate adding a new client by generating a new ID
      const newClientWithId = { ...client, id: crypto.randomUUID(), merchantId: "merch_example" };
      setClients([newClientWithId, ...clients]); 
      toast({ title: "Cliente Adicionado", description: `${client.name} foi adicionado.`});
    }
    setShowForm(false);
    setEditingClient(null);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleDeleteRequest = (clientId: string) => {
    setClientToDelete(clientId);
  };

  const handleDeleteConfirm = () => {
    if (clientToDelete) {
      const clientName = clients.find(c => c.id === clientToDelete)?.name || "Cliente";
      setClients(clients.filter(c => c.id !== clientToDelete));
      toast({ title: "Cliente Excluído", description: `${clientName} foi excluído.`});
      setClientToDelete(null);
    }
  };

  const handleSendMessage = (client: Client) => {
    toast({
      title: "Enviar Mensagem",
      description: `Preparando para enviar mensagem para ${client.name}. Redirecionando...`,
    });
    router.push(`/dashboard/whatsapp?clientId=${client.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold flex items-center">
            <Users className="mr-3 h-8 w-8 text-primary" />
            Gerenciamento de Clientes
          </h1>
          <p className="text-muted-foreground">Adicione, edite e visualize seus clientes.</p>
        </div>
        {!showForm && (
          <Button onClick={() => { setShowForm(true); setEditingClient(null); }}>
            <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Novo Cliente
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">{editingClient ? "Editar Cliente" : "Novo Cliente"}</CardTitle>
            <CardDescription>
              {editingClient ? `Modifique os dados de ${editingClient.name}.` : "Preencha os dados para cadastrar um novo cliente."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ClientForm client={editingClient} onSubmitSuccess={handleFormSubmit} />
            <Button variant="outline" className="mt-4" onClick={() => { setShowForm(false); setEditingClient(null); }}>
              Cancelar
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-headline">Lista de Clientes</CardTitle>
          <div className="mt-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="text"
              placeholder="Buscar por nome ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full md:w-1/2 lg:w-1/3"
            />
          </div>
        </CardHeader>
        <CardContent>
          <ClientTable 
            clients={filteredClients} 
            onEdit={handleEdit} 
            onDelete={handleDeleteRequest}
            onSendMessage={handleSendMessage}
          />
        </CardContent>
      </Card>

      <AlertDialog open={!!clientToDelete} onOpenChange={() => setClientToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}


"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlusCircle, Building, Search, Edit, Trash2, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MerchantUser } from "@/types"; // Using a specific MerchantUser type
import Link from "next/link";

// Mock Data
const initialMerchants: MerchantUser[] = [
  { id: "merch1", name: "Loja da Esquina", email: "lojaesquina@email.com", role: "merchant", cnpjCpf: "11.111.111/0001-11" },
  { id: "merch2", name: "Padaria Pão Quente", email: "padaria@email.com", role: "merchant", cnpjCpf: "22.222.222/0001-22" },
  { id: "merch3", name: "Salão Beleza Pura", email: "salao@email.com", role: "merchant", cnpjCpf: "333.333.333-33" },
];

export default function AdminMerchantsPage() {
  const [merchants, setMerchants] = useState<MerchantUser[]>(initialMerchants);
  const [searchTerm, setSearchTerm] = useState("");
  // Add states for form visibility, editing merchant, etc.

  const filteredMerchants = merchants.filter(merchant =>
    merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    merchant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    merchant.cnpjCpf.includes(searchTerm)
  );

  const handleAddMerchant = () => {
    // Logic to show a form/modal for adding a new merchant
    // This could redirect to a version of the main merchant registration page,
    // but with admin privileges (e.g., setting initial password or status).
    console.log("Add new merchant clicked");
    alert("Funcionalidade de adicionar comerciante (Admin) - Placeholder. Redirecionaria para /auth/merchant/register ou um formulário modal.");
    // router.push('/auth/merchant/register?byAdmin=true'); // Example
  };

  const handleEditMerchant = (merchant: MerchantUser) => {
    console.log("Edit merchant:", merchant);
    alert(`Editar comerciante: ${merchant.name} (Admin) - Placeholder`);
  };

  const handleDeleteMerchant = (merchantId: string) => {
    console.log("Delete merchant ID:", merchantId);
     if(confirm("Tem certeza que deseja excluir este comerciante? Todos os seus dados (clientes, vendas) serão afetados.")) {
        setMerchants(merchants.filter(m => m.id !== merchantId));
        alert("Comerciante excluído (simulação).");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold flex items-center">
            <Building className="mr-3 h-8 w-8 text-primary" />
            Gerenciamento de Comerciantes
          </h1>
          <p className="text-muted-foreground">Adicione, edite e visualize os comerciantes da plataforma.</p>
        </div>
        <Button onClick={handleAddMerchant}>
          <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Novo Comerciante
        </Button>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-headline">Lista de Comerciantes</CardTitle>
          <div className="mt-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="text"
              placeholder="Buscar por nome, email ou CNPJ/CPF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full md:w-1/2 lg:w-1/3"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredMerchants.length > 0 ? (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome do Estabelecimento</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>CNPJ/CPF</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMerchants.map((merchant) => (
                    <TableRow key={merchant.id}>
                      <TableCell className="font-medium">{merchant.name}</TableCell>
                      <TableCell>{merchant.email}</TableCell>
                      <TableCell>{merchant.cnpjCpf}</TableCell>
                      <TableCell className="text-center space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditMerchant(merchant)} title="Editar Comerciante">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteMerchant(merchant.id)} title="Excluir Comerciante">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                         <Button variant="ghost" size="icon" asChild title="Ver Painel do Comerciante (simulação)">
                          <Link href={`/dashboard?merchantId=${merchant.id}`}> {/* This link is illustrative */}
                            <Eye className="h-4 w-4 text-blue-500" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
             <p className="text-muted-foreground text-center py-8">Nenhum comerciante encontrado.</p>
          )}
        </CardContent>
      </Card>
      <CardDescription className="text-xs text-muted-foreground">
        Comerciantes também podem se cadastrar pela página inicial ou página de cadastro de comerciante.
      </CardDescription>
    </div>
  );
}


"use client";

import React, { useState, useMemo } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
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
import type { MerchantUser } from "@/types";
import Link from "next/link";
import { initialMerchants } from "@/lib/mockData";
import { MerchantAdminForm } from "@/components/forms/MerchantAdminForm";
import { useToast } from "@/hooks/use-toast";

export default function AdminMerchantsPage() {
  const [merchants, setMerchants] = useState<MerchantUser[]>(initialMerchants);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMerchant, setEditingMerchant] = useState<MerchantUser | null>(null);
  const [merchantToDelete, setMerchantToDelete] = useState<MerchantUser | null>(null);
  const { toast } = useToast();

  const filteredMerchants = useMemo(() => {
    return merchants.filter(merchant =>
      merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.cnpjCpf.includes(searchTerm)
    );
  }, [merchants, searchTerm]);

  const handleOpenForm = (merchant?: MerchantUser) => {
    setEditingMerchant(merchant || null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (values: Omit<MerchantUser, 'id' | 'role'>, merchantId?: string) => {
    if (merchantId) { // Editing existing merchant
      setMerchants(prevMerchants =>
        prevMerchants.map(m =>
          m.id === merchantId ? { ...m, ...values } : m
        )
      );
      toast({ title: "Comerciante Atualizado!", description: `Os dados de ${values.name} foram atualizados.` });
    } else { // Adding new merchant
      const newMerchant: MerchantUser = {
        id: crypto.randomUUID(),
        ...values,
        role: "merchant", // Default role
      };
      setMerchants(prevMerchants => [newMerchant, ...prevMerchants]);
      toast({ title: "Comerciante Adicionado!", description: `${values.name} foi cadastrado com sucesso.` });
    }
    setIsFormOpen(false);
    setEditingMerchant(null);
  };

  const handleDeleteRequest = (merchant: MerchantUser) => {
    setMerchantToDelete(merchant);
  };

  const handleDeleteConfirm = () => {
    if (merchantToDelete) {
      setMerchants(prevMerchants => prevMerchants.filter(m => m.id !== merchantToDelete.id));
      toast({ title: "Comerciante Excluído!", description: `${merchantToDelete.name} foi excluído.` });
      setMerchantToDelete(null);
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
        <Button onClick={() => handleOpenForm()}>
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
                      <TableCell className="text-center space-x-1">
                         <Button variant="ghost" size="icon" asChild title="Ver Detalhes do Comerciante">
                          <Link href={`/admin/merchants/${merchant.id}`}> 
                            <Eye className="h-4 w-4 text-blue-500" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleOpenForm(merchant)} title="Editar Comerciante">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteRequest(merchant)} title="Excluir Comerciante">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
             <p className="text-muted-foreground text-center py-8">Nenhum comerciante encontrado com os filtros atuais.</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-headline text-xl">
              {editingMerchant ? "Editar Comerciante" : "Adicionar Novo Comerciante"}
            </DialogTitle>
            <DialogDescription>
              {editingMerchant ? "Modifique os dados do comerciante abaixo." : "Preencha os dados para cadastrar um novo comerciante."}
            </DialogDescription>
          </DialogHeader>
          <MerchantAdminForm
            merchant={editingMerchant}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            isEditing={!!editingMerchant}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!merchantToDelete} onOpenChange={() => setMerchantToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o comerciante "{merchantToDelete?.name}"? Esta ação não pode ser desfeita e pode afetar dados associados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CardDescription className="text-xs text-muted-foreground">
        Comerciantes também podem se cadastrar pela página inicial ou página de cadastro de comerciante.
      </CardDescription>
    </div>
  );
}

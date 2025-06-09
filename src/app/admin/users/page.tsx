
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlusCircle, Users, Search, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { UserAccount } from "@/types";
import { initialSystemUsers } from "@/lib/mockData"; // Import from centralized mock data

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserAccount[]>(initialSystemUsers);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    console.log("Add new user clicked");
    alert("Funcionalidade de adicionar usuário (Admin) - Placeholder");
  };

  const handleEditUser = (user: UserAccount) => {
    console.log("Edit user:", user);
    alert(`Editar usuário: ${user.name} (Admin) - Placeholder`);
  };

  const handleDeleteUser = (userId: string) => {
    console.log("Delete user ID:", userId);
    if(confirm("Tem certeza que deseja excluir este usuário do sistema?")) {
        setUsers(users.filter(u => u.id !== userId));
        alert("Usuário excluído (simulação).");
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold flex items-center">
            <Users className="mr-3 h-8 w-8 text-primary" />
            Gerenciamento de Usuários do Sistema
          </h1>
          <p className="text-muted-foreground">Adicione, edite e visualize administradores e comerciantes.</p>
        </div>
        <Button onClick={handleAddUser}>
          <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Novo Usuário
        </Button>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-headline">Lista de Usuários</CardTitle>
          <div className="mt-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="text"
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full md:w-1/2 lg:w-1/3"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredUsers.length > 0 ? (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                          {user.role === 'admin' ? 'Administrador' : 'Comerciante'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)} title="Editar Usuário">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)} title="Excluir Usuário">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">Nenhum usuário encontrado com os filtros atuais.</p>
          )}
        </CardContent>
      </Card>
      <CardDescription className="text-xs text-muted-foreground">
        Nota: O primeiro administrador deve ser criado diretamente na base de dados. Este painel permite gerenciar usuários subsequentes.
        Clientes finais dos comerciantes são gerenciados dentro do painel de cada comerciante ou na seção "Clientes Globais".
      </CardDescription>
    </div>
  );
}

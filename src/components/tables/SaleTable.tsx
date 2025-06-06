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
import { Edit, Trash2 } from "lucide-react";
import type { Sale } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

interface SaleTableProps {
  sales: Sale[];
  onEdit: (sale: Sale) => void;
  onDelete: (saleId: string) => void;
}

export function SaleTable({ sales, onEdit, onDelete }: SaleTableProps) {
   if (sales.length === 0) {
    return <p className="text-muted-foreground text-center py-8">Nenhuma venda registrada ainda.</p>;
  }
  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-right">Valor (R$)</TableHead>
            <TableHead className="text-right">Cashback Gerado (R$)</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell className="font-medium">{sale.clientName || 'N/A'}</TableCell>
              <TableCell>{format(new Date(sale.date), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
              <TableCell className="text-right">{sale.value.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <Badge variant="default" className="bg-primary/80">
                  {sale.cashbackGenerated.toFixed(2)}
                </Badge>
              </TableCell>
              <TableCell className="text-center space-x-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(sale)} title="Editar Venda">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(sale.id)} title="Excluir Venda">
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

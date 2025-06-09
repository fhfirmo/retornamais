"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Building,
  ShoppingCart,
  LogOut,
  UserCircle,
  ShieldCheck,
  Briefcase,
  Home, // Added Home icon
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/Logo";
import React from "react";

const navItems = [
  { href: "/admin/dashboard", label: "Painel Admin", icon: ShieldCheck },
  { href: "/admin/users", label: "Usuários", icon: Users },
  { href: "/admin/merchants", label: "Comerciantes", icon: Building },
  { href: "/admin/clients", label: "Clientes Globais", icon: Briefcase }, 
  { href: "/admin/sales", label: "Vendas Globais", icon: ShoppingCart },
  { href: "/dev-index", label: "Páginas Criadas", icon: Home }, // Added link to dev index
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen">
        <Sidebar variant="sidebar" collapsible="icon" className="border-r bg-card">
          <SidebarHeader className="p-4">
            <Link href="/admin/dashboard" aria-label="Ir para o Painel Admin">
              <Logo showText={false} iconSize={28} />
            </Link>
          </SidebarHeader>
          <SidebarContent className="p-2 flex-grow">
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin/dashboard" && item.href !== "/dev-index" ) || (item.href === "/admin/dashboard" && pathname === "/admin") }
                    tooltip={{children: item.label, className: "font-body"}}
                  >
                    <Link href={item.href}>
                      <item.icon className="text-secondary group-data-[active=true]:text-primary-foreground" />
                      <span className="font-body">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-2">
             <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={{children: "Sair (Admin)", className: "font-body"}}>
                    <Link href="/auth/login"> 
                      <LogOut className="text-secondary" />
                      <span className="font-body">Sair</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
             </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1 flex flex-col bg-background">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-card px-4 sm:px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden" />
              <div className="hidden md:block">
                <Link href="/admin/dashboard" aria-label="Ir para o Painel Admin">
                  <Logo iconSize={28} textSize="text-2xl" />
                </Link>
              </div>
               <span className="ml-2 text-sm font-semibold text-destructive">MODO ADMINISTRADOR</span>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="Admin avatar" data-ai-hint="admin avatar" />
                    <AvatarFallback>
                      <UserCircle size={24} />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none font-headline">Administrador</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      admin@retornamais.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                   <Link href="/auth/login" className="flex items-center w-full">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
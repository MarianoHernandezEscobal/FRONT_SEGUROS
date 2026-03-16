"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { Plus, RefreshCw, Loader2, Bell, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InsuranceTable } from "@/components/InsuranceTable";
import { insuranceService } from "@/services/insuranceService";
import type { Insurance } from "@/types/insurance";

export default function DashboardPage() {
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSendingReminders, setIsSendingReminders] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredInsurances = useMemo(() => {
    if (!searchQuery.trim()) return insurances;
    const query = searchQuery.toLowerCase().trim();
    return insurances.filter(
      (insurance) =>
        insurance.name.toLowerCase().includes(query) ||
        insurance.tuition.toLowerCase().includes(query)
    );
  }, [insurances, searchQuery]);

  const fetchInsurances = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await insuranceService.getAll();
      setInsurances(data);
    } catch (err: unknown) {
      console.error("Error fetching insurances:", err);
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Error al cargar los seguros. Por favor, intenta de nuevo.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSendReminders = async () => {
    setIsSendingReminders(true);
    try {
      const response = await insuranceService.sendReminders();
      toast.success(response.message || "Recordatorios enviados");
    } catch (err: unknown) {
      console.error("Error sending reminders:", err);
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Error al enviar recordatorios. Por favor, intenta de nuevo.";
      toast.error(errorMessage);
    } finally {
      setIsSendingReminders(false);
    }
  };

  useEffect(() => {
    fetchInsurances();
  }, [fetchInsurances]);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Seguros</h1>
          <p className="text-muted-foreground">
            Gestiona todos los seguros y sus vencimientos
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchInsurances}
            disabled={isLoading}
          >
            <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSendReminders}
            disabled={isSendingReminders}
          >
            <Bell className={`size-4 ${isSendingReminders ? "animate-pulse" : ""}`} />
            {isSendingReminders ? "Enviando..." : "Enviar recordatorios"}
          </Button>
          <Button asChild>
            <Link href="/dashboard/create-insurance">
              <Plus className="size-4" />
              Crear seguro
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Lista de seguros</CardTitle>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o matricula..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-destructive">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchInsurances}
                className="mt-4"
              >
                Reintentar
              </Button>
            </div>
          ) : (
            <InsuranceTable
              insurances={filteredInsurances}
              onRenewed={fetchInsurances}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

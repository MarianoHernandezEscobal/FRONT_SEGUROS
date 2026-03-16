"use client";

import { useState } from "react";
import Link from "next/link";
import { format, parseISO, isPast, isWithinInterval, addDays, addYears } from "date-fns";
import { es } from "date-fns/locale";
import { Pencil, AlertCircle, CheckCircle2, Clock, RotateCcw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { insuranceService } from "@/services/insuranceService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Insurance } from "@/types/insurance";

interface InsuranceTableProps {
  insurances: Insurance[];
  onRenewed?: () => void;
}

function getExpirationStatus(expirationDate: string) {
  const date = parseISO(expirationDate);
  const today = new Date();
  const thirtyDaysFromNow = addDays(today, 30);

  if (isPast(date)) {
    return { label: "Vencido", variant: "destructive" as const, icon: AlertCircle };
  }
  if (isWithinInterval(date, { start: today, end: thirtyDaysFromNow })) {
    return { label: "Por vencer", variant: "secondary" as const, icon: Clock };
  }
  return { label: "Vigente", variant: "default" as const, icon: CheckCircle2 };
}

export function InsuranceTable({ insurances, onRenewed }: InsuranceTableProps) {
  const [renewingId, setRenewingId] = useState<string | null>(null);

  const handleRenew = async (insurance: Insurance) => {
    setRenewingId(insurance._id);
    try {
      // Renew for one year from today
      const newExpirationDate = format(addYears(new Date(), 1), "yyyy-MM-dd");
      await insuranceService.renew(insurance._id, newExpirationDate);
      toast.success(`Seguro de ${insurance.name} renovado exitosamente`);
      onRenewed?.();
    } catch (err: unknown) {
      console.error("Error renewing insurance:", err);
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Error al renovar el seguro. Por favor, intenta de nuevo.";
      toast.error(errorMessage);
    } finally {
      setRenewingId(null);
    }
  };

  if (insurances.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="size-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No hay seguros registrados</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Crea tu primer seguro para comenzar
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Telefono</TableHead>
          <TableHead>Matricula</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Vencimiento</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Recordatorio</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {insurances.map((insurance) => {
          const status = getExpirationStatus(insurance.expirationDate);
          const StatusIcon = status.icon;
          return (
            <TableRow key={insurance._id}>
              <TableCell className="font-medium">{insurance.name}</TableCell>
              <TableCell>{insurance.phone}</TableCell>
              <TableCell>{insurance.tuition}</TableCell>
              <TableCell className="capitalize">{insurance.type}</TableCell>
              <TableCell>
                {format(parseISO(insurance.expirationDate), "dd MMM yyyy", {
                  locale: es,
                })}
              </TableCell>
              <TableCell>
                <Badge variant={status.variant} className="gap-1">
                  <StatusIcon className="size-3" />
                  {status.label}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={insurance.reminderSent ? "default" : "outline"}
                >
                  {insurance.reminderSent ? "Enviado" : "Pendiente"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleRenew(insurance)}
                    disabled={renewingId === insurance._id}
                    title="Renovar seguro"
                  >
                    {renewingId === insurance._id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <RotateCcw className="size-4" />
                    )}
                    <span className="sr-only">Renovar seguro</span>
                  </Button>
                  <Button variant="ghost" size="icon-sm" asChild>
                    <Link href={`/dashboard/edit/${insurance._id}`}>
                      <Pencil className="size-4" />
                      <span className="sr-only">Editar seguro</span>
                    </Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default InsuranceTable;

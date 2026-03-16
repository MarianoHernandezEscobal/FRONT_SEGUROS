"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InsuranceForm, type InsuranceFormValues } from "@/components/InsuranceForm";
import { insuranceService } from "@/services/insuranceService";
import type { Insurance } from "@/types/insurance";

export default function EditInsurancePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [insurance, setInsurance] = useState<Insurance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsurance = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await insuranceService.getById(id);
      setInsurance(data);
    } catch (err: unknown) {
      console.error("Error fetching insurance:", err);
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Error al cargar el seguro. Por favor, intenta de nuevo.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchInsurance();
    }
  }, [id, fetchInsurance]);

  const handleSubmit = async (data: InsuranceFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await insuranceService.update(id, data);
      toast.success("Seguro actualizado exitosamente");
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("Error updating insurance:", err);
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Error al actualizar el seguro. Por favor, intenta de nuevo.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/dashboard">
          <ArrowLeft className="size-4" />
          Volver al dashboard
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Editar seguro</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : error && !insurance ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-destructive">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchInsurance}
                className="mt-4"
              >
                Reintentar
              </Button>
            </div>
          ) : insurance ? (
            <>
              {error && (
                <div className="mb-6 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              <InsuranceForm
                defaultValues={insurance}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                submitLabel="Guardar cambios"
              />
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

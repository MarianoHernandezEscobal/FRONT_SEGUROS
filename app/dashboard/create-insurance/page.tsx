"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InsuranceForm, type InsuranceFormValues } from "@/components/InsuranceForm";
import { insuranceService } from "@/services/insuranceService";

export default function CreateInsurancePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: InsuranceFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await insuranceService.create(data);
      toast.success("Seguro creado exitosamente");
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("Error creating insurance:", err);
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Error al crear el seguro. Por favor, intenta de nuevo.";
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
          <CardTitle>Crear nuevo seguro</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-6 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <InsuranceForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitLabel="Crear seguro"
          />
        </CardContent>
      </Card>
    </div>
  );
}

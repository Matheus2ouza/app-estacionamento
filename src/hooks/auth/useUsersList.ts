import { AuthApi } from "@/src/api/userService";
import { Employee, roleHierarchy } from "@/src/types/auth";
import { useCallback, useEffect, useState } from "react";

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthApi.listUsers();

      const sortedList = response.list.sort((a, b) => {
        return roleHierarchy[b.role] - roleHierarchy[a.role];
      });

      setEmployees(sortedList);
    } catch (err: any) {
      console.error("[useEmployees] Erro ao buscar funcionários:", err);
      setError("Erro ao buscar funcionários");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return { employees, loading, error, refetch: fetchEmployees };
}

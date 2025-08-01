import { AuthApi } from "@/src/api/userService";
import { useCallback, useEffect, useState } from "react";
import { Employee } from "@/src/types/auth";

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const roleHierarchy = {
    ADMIN: 2,
    NORMAL: 1,
  };

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthApi.userList();

      const sortedList = response.list.sort((a, b) => {
        return roleHierarchy[b.role] - roleHierarchy[a.role];
      });

      setEmployees(sortedList);
      console.log("FETCHED:", sortedList);
    } catch (err: any) {
      console.error("[useEmployees] Erro ao buscar funcionários:", err);
      setError("Erro ao buscar funcionários");
    } finally {
      setLoading(false);
    }
  }, []); // <- só cria uma vez

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return { employees, loading, error, refetch: fetchEmployees };
}

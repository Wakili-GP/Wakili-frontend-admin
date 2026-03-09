import { useQuery } from "@tanstack/react-query";
import AdminServices from "@/services/admins.service";
import { type Admin } from "@/services/admins.service";

export const useAdmins = () => {
  const { data, isLoading, error } = useQuery<Admin[]>({
    queryKey: ["admins"],
    queryFn: AdminServices.getAllAdmins,
  });

  return {
    admins: data ?? [],
    adminsLoading: isLoading,
    adminsError: error,
  };
};

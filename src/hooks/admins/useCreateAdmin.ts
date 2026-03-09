import { useMutation, useQueryClient } from "@tanstack/react-query";
import AdminServices, {
  type CreateAdminInput,
} from "@/services/admins.service";

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAdminInput) => AdminServices.createAdmin(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["Admins"],
      });
    },
  });
};

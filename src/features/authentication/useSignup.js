import { useMutation } from "@tanstack/react-query";
import { signup as signupApi } from "../../services/apiAuth";
import { showToast } from "../../ui/showToast.js";

export function useSignup() {
  const { mutate: signup, isLoading } = useMutation({
    mutationFn: signupApi,
    onSuccess: () => {
      showToast(
        "success",
        "Account successfully created! Please verify the new account from the user's email address."
      );
    },
    onError: (error) => showToast("error", error.message),
  });

  return { signup, isLoading };
}

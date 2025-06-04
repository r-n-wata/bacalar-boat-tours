import { useApi } from "../useApi";
import { OPERATOR_SIGNUP_URL } from "../constants";

export const useOperatorSignup = () => {
  const { fetchAPI, loading } = useApi();

  const signUp = async (operatorData: FormData) => {
    return await fetchAPI({
      url: OPERATOR_SIGNUP_URL,
      method: "POST",
      body: operatorData,
      isFormData: true,
    });
  };

  return { signUp, loading };
};

import { useApi } from "../useApi";
import { OPERATOR_SIGNIN_URL } from "../constants";

export const useOperatorSignin = () => {
  const { fetchAPI, loading } = useApi();

  const signIn = async (operatorData: Record<string, any>) => {
    return await fetchAPI({
      url: OPERATOR_SIGNIN_URL,
      method: "POST",
      body: operatorData,
      isFormData: true,
    });
  };

  return { signIn, loading };
};

import { useApi } from "../useApi";
import { LOGOUT_URL } from "../constants";

export const useOperatorSignin = () => {
  const { fetchAPI, loading } = useApi();

  const signIn = async (operatorData: Record<string, any>) => {
    return await fetchAPI({
      url: LOGOUT_URL,
      method: "POST",
      credentials: "include", // ensures cookies are sent
    });
  };

  return { signIn, loading };
};

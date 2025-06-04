import { useApi } from "../useApi";
import { CLIENT_SIGNUP_URL } from "../constants";

export const useClientSignup = () => {
  const { fetchAPI, loading } = useApi();

  const signUp = async (clientData: Record<string, any>) => {
    return await fetchAPI({
      url: CLIENT_SIGNUP_URL,
      method: "POST",
      body: clientData,
    });
  };

  return { signUp, loading };
};

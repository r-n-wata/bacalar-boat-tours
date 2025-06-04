import { useApi } from "../useApi";
import { CLIENT_SIGNIN_URL } from "../constants";

export const useClientSignin = () => {
  const { fetchAPI, loading } = useApi();

  const signIn = async (clientData: Record<string, any>) => {
    return await fetchAPI({
      url: CLIENT_SIGNIN_URL,
      method: "POST",
      body: clientData,
    });
  };

  return { signIn, loading };
};

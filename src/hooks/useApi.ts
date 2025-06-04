import { useState, useCallback } from "react";
import { handleApiRequest } from "../lib/auth/handleApiRequest";
import { BASE_URL } from "./constants";

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  success: boolean;
}

interface FetchProps {
  url: string;
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: Record<string, any> | FormData;
  isFormData?: boolean;
  credentials?: RequestCredentials;
}

export function useApi<T = any>() {
  const [loading, setLoading] = useState(false);

  const getData = ({
    url,
    body,
    method,
    isFormData,
    credentials,
  }: FetchProps) => {
    const headers = isFormData
      ? undefined // let the browser set the Content-Type
      : { "Content-Type": "application/json" };

    console.log("headers::::", headers);
    console.log(
      " body::::::",
      method === "GET"
        ? undefined
        : isFormData
        ? (body as FormData)
        : JSON.stringify(body)
    );

    console.log("method::::", method);
    console.log("url::::", url);

    return fetch(`${BASE_URL}${url}`, {
      method,
      headers,
      body:
        method === "GET"
          ? undefined
          : isFormData
          ? (body as FormData)
          : JSON.stringify(body),
      credentials: credentials || undefined,
    })
      .then(async (res) => {
        if (!res.ok) {
          let errorText = "Unknown error";

          try {
            const data = await res.json();
            errorText = data.error || JSON.stringify(data);
          } catch (jsonError) {
            const text = await res.text();
            errorText = text || "Failed to parse error response";
          }

          throw new Error(errorText);
        }

        return res.json(); // happy path
      })

      .then((data: any) => {
        setLoading(false);
        return data;
      })
      .catch((error: any) => {
        setLoading(false);
        console.log("API Error in catch block:", error.status);
        throw error;
      });
  };

  const fetchAPI = useCallback((props: FetchProps) => {
    setLoading(true);
    return getData(props);
  }, []);

  return { loading, fetchAPI };
}

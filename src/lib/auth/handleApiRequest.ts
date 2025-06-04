export const handleApiRequest = async <T>(
  requestFn: () => Promise<T>
): Promise<{ data?: T; error?: string }> => {
  try {
    const data = await requestFn();
    return { data };
  } catch (err: any) {
    console.error("API Error:", err);
    return { error: err.message || "Something went wrong" };
  }
};

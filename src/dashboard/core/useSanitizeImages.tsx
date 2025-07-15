import { useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/toast/useToast";

export default function useSanitizeImages() {
  const { showToast } = useToast();

  const sanitizeImages = useCallback(
    async (images: (File | string)[]): Promise<string[] | null> => {
      try {
        const uploadedImageUrls: string[] = [];

        for (const img of images) {
          if (img instanceof File) {
            const fileExt = img.name.split(".").pop();
            const fileName = `${crypto.randomUUID()}.${fileExt}`;
            const filePath = `tours/${fileName}`;

            const { error: uploadError } = await supabase.storage
              .from("images")
              .upload(filePath, img);

            if (uploadError) {
              showToast("Image upload failed", "error");
              console.error("Upload error:", uploadError);

              // Optionally clean up any previously uploaded files (not shown here)
              // for (const url of uploadedImageUrls) { delete logic here if needed }

              // Still return what was successfully uploaded, or null if none
              return uploadedImageUrls.length ? uploadedImageUrls : null;
            }

            const { data: publicUrlData } = supabase.storage
              .from("images")
              .getPublicUrl(filePath);

            if (!publicUrlData?.publicUrl) {
              showToast("Failed to get public URL", "error");
              console.error("Missing public URL for:", filePath);

              return uploadedImageUrls.length ? uploadedImageUrls : null;
            }

            uploadedImageUrls.push(publicUrlData.publicUrl);
          } else if (typeof img === "string") {
            uploadedImageUrls.push(img);
          }
        }

        return uploadedImageUrls;
      } catch (err) {
        console.error("Sanitize images error:", err);
        showToast("Unexpected error during image sanitizing", "error");
        return null;
      }
    },
    [showToast]
  );

  return sanitizeImages;
}

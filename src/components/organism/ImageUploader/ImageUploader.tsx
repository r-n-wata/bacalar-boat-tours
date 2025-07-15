"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ImageUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>("");

  async function handleUpload() {
    if (!file) return;

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error } = await supabase.storage
      .from("images") // bucket name
      .upload(filePath, file);

    if (error) {
      alert("Upload failed");
      console.error(error);
      return;
    }

    const { data } = supabase.storage.from("images").getPublicUrl(filePath);
    setUrl(data.publicUrl); // or store this in your DB
  }

  return (
    <div className="p-4 border rounded max-w-md">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <button
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleUpload}
      >
        Upload
      </button>

      {url && (
        <div className="mt-4">
          <p>Uploaded image:</p>
          <img src={url} alt="Uploaded" className="w-40 mt-2 rounded" />
        </div>
      )}
    </div>
  );
}

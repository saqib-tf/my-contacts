export async function uploadToVercelBlob(file: File) {
  if (!file) throw new Error("No file provided");
  if (!file.type.startsWith("image/")) throw new Error("Only image files are allowed");
  if (file.size > 1024 * 1024) throw new Error("File size must be less than 1 MB");

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data.url;
}

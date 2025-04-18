// src/utils/uploadImageToCloudinary.js
export async function uploadImageToCloudinary(file) {
  const cloudName = "kribji";
  const uploadPreset = "holidaze"; // must match Cloudinary preset exactly

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
    {
      method: "POST",
      body: formData,
      // 🚫 Don't add any headers!
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Image upload failed");
  }

  return data.secure_url;
}

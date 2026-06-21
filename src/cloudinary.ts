export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'efpl-uploads');
  formData.append('cloud_name', 'dbttfhuzr');
  
  const response = await fetch(
    'https://api.cloudinary.com/v1_1/dbttfhuzr/image/upload',
    { method: 'POST', body: formData }
  );
  if (!response.ok) {
     throw new Error('Upload failed');
  }
  const data = await response.json();
  return data.secure_url;
}

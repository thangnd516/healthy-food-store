const cloudinary = require("cloudinary").v2;

const getPublicIdFromUrl = (imageUrl) => {
  if (!imageUrl) return null;
  const match = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  return match ? match[1] : null;
};

const deleteCloudinaryImage = async (imageUrl) => {
  const publicId = getPublicIdFromUrl(imageUrl);
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId).catch(() => {});
};

module.exports = { getPublicIdFromUrl, deleteCloudinaryImage };

import { useEffect, useState } from 'react';

const AvatarPreview = ({ file }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Clean up memory when component unmounts or file changes
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!previewUrl) return null;

  return (
    <div className="flex justify-center mt-2">
      <img
        src={previewUrl}
        alt="Avatar Preview"
        className="h-24 w-24 rounded-full object-cover border-2 border-pink-500 shadow"
      />
    </div>
  );
};

export default AvatarPreview;

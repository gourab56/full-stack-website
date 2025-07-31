const FileUpload = ({ name, label, onChange, required }) => (
  <div>
    {label && (
      <label className="block text-sm font-medium text-pink-700 mb-1">
        {label}
      </label>
    )}
    <input
      type="file"
      name={name}
      onChange={onChange}
      required={required}
      className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-100 file:text-pink-700 hover:file:bg-pink-200"
    />
  </div>
);

export default FileUpload;

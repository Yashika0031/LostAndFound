const FormInput = ({ label, id, error, ...props }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <input
        id={id}
        className={`input-field ${error ? 'border-red-500' : ''}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

const FormSelect = ({ label, id, options, error, ...props }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <select
        id={id}
        className={`input-field ${error ? 'border-red-500' : ''}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

const FormTextArea = ({ label, id, error, ...props }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <textarea
        id={id}
        className={`input-field min-h-[100px] ${error ? 'border-red-500' : ''}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

const FormFileInput = ({ label, id, error, ...props }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <input
        type="file"
        id={id}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden focus:border-transparent ${
          error ? 'border-red-500' : ''
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export { FormInput, FormSelect, FormTextArea, FormFileInput };
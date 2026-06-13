const FormInput = ({ label, icon, error, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={props.id} className="mb-1.5 block text-sm font-medium text-coffee">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-coffee/40">
            {icon}
          </span>
        )}
        <input
          {...props}
          className={`w-full rounded-xl border bg-white/60 px-4 py-3 text-sm text-coffee placeholder:text-coffee/40 backdrop-blur transition focus:bg-white/90 ${
            icon ? 'pl-10' : ''
          } ${error ? 'border-red-400' : 'border-white/60 focus:border-teal'}`}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default FormInput;

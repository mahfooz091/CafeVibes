import { cn } from '../../utils/helpers';

const Input = ({ label, error, className, ...props }) => (
  <div className="space-y-1.5">
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <input className={cn('input-field', error && 'border-red-400 focus:ring-red-300', className)} {...props} />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

export default Input;

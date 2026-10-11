import { cn } from '../../utils/helpers';

const Badge = ({ children, color, className }) => (
  <span
    className={cn('badge', className)}
    style={color ? { backgroundColor: `${color}20`, color } : undefined}
  >
    {children}
  </span>
);

export default Badge;

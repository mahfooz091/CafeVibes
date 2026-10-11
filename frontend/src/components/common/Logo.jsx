import { Link } from 'react-router-dom';

const Logo = ({ size = 'md', showText = true }) => {
  const sizes = {
    sm: { icon: 20, text: 'text-lg', height: 'h-8 w-8' },
    md: { icon: 28, text: 'text-xl', height: 'h-10 w-10' },
    lg: { icon: 36, text: 'text-2xl', height: 'h-12 w-12' },
    xl: { icon: 48, text: 'text-3xl', height: 'h-16 w-16' },
  };

  const s = sizes[size] || sizes.md;

  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <div className={`flex items-center justify-center ${s.height} rounded-xl bg-white shadow-sm border border-gray-100/80 group-hover:shadow-md transition-all overflow-hidden p-0.5`}>
        <img src="/logo.png" alt="CafeVibes Icon" className="w-full h-full object-cover scale-[1.5] -translate-y-[10%]" />
      </div>
      {showText && (
        <span className={`font-display font-bold text-primary ${s.text}`}>
          CafeVibes
        </span>
      )}
    </Link>
  );
};

export default Logo;

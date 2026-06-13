import { FcGoogle } from 'react-icons/fc';

const GoogleButton = ({ label = 'Continue with Google', onClick, disabled }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-coffee/15 bg-white px-4 py-3 text-sm font-medium text-coffee shadow-sm transition hover:bg-cream disabled:opacity-60"
    >
      <FcGoogle className="text-xl" />
      {label}
    </button>
  );
};

export default GoogleButton;

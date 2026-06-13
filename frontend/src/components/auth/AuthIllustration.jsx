import { motion } from 'framer-motion';
import Logo from '../ui/Logo';

const AuthIllustration = ({ title, subtitle }) => {
  return (
    <div className="relative hidden h-full w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-teal via-teal-dark to-coffee p-10 lg:flex">
      {/* Floating shapes */}
      <motion.div
        className="absolute -left-10 top-20 h-40 w-40 rounded-full bg-gold/20 blur-2xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-10 top-1/3 h-24 w-24 rounded-full bg-white/10 blur-xl"
        animate={{ y: [0, 24, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />
      <motion.div
        className="absolute bottom-24 left-1/4 h-32 w-32 rounded-full bg-teal-light/20 blur-2xl"
        animate={{ y: [0, -16, 0], x: [0, 12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <Logo light className="relative z-10" />

      <div className="relative z-10 flex flex-1 items-center justify-center">
        {/* Stylized cafe counter / POS dashboard preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-sm"
        >
          {/* Glow ring */}
          <div className="absolute -inset-6 rounded-3xl bg-teal-light/20 blur-2xl" />

          {/* POS dashboard card */}
          <div className="glass-card relative rounded-2xl border border-white/20 p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
                Today's Sales
              </span>
              <span className="rounded-full bg-gold/30 px-2 py-0.5 text-[10px] font-medium text-white">
                Live
              </span>
            </div>
            <p className="font-display text-3xl font-semibold text-white">$2,486.50</p>
            <div className="mt-5 space-y-2.5">
              {[78, 55, 92].map((width, i) => (
                <motion.div
                  key={i}
                  className="h-2 rounded-full bg-white/20"
                  initial={{ width: 0 }}
                  animate={{ width: `${width}%` }}
                  transition={{ duration: 1, delay: 0.3 + i * 0.15, ease: 'easeOut' }}
                />
              ))}
            </div>
          </div>

          {/* Coffee cup floating accent */}
          <motion.div
            className="absolute -right-8 -top-8 flex h-20 w-20 items-center justify-center rounded-full bg-cream shadow-glass"
            animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="text-3xl" role="img" aria-label="coffee cup">
              ☕
            </span>
          </motion.div>

          {/* Table card accent */}
          <motion.div
            className="glass-card absolute -bottom-10 -left-10 rounded-xl border border-white/20 px-4 py-3"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          >
            <p className="text-[10px] uppercase tracking-wider text-white/70">Table 04</p>
            <p className="mt-0.5 text-sm font-semibold text-white">Occupied · 4 seats</p>
          </motion.div>
        </motion.div>
      </div>

      <div className="relative z-10">
        <h2 className="font-display text-2xl font-semibold text-white">{title}</h2>
        <p className="mt-2 max-w-xs text-sm text-white/70">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthIllustration;

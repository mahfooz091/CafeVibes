import { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiLogIn } from 'react-icons/fi';
import Logo from '../components/ui/Logo';
import StatsRow from '../components/landing/StatsRow';
import CafeScene3D from '../components/landing/CafeScene3D';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

const LandingPage = () => {
  return (
    <div className="min-h-screen w-full overflow-hidden bg-cream">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Left Section */}
        <div className="relative flex w-full flex-col justify-between px-6 py-8 sm:px-10 lg:w-1/2 lg:px-16 lg:py-12">
          {/* Decorative glass blobs */}
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-teal/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-10 left-1/3 h-56 w-56 rounded-full bg-gold/20 blur-3xl" />

          {/* Top nav */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="relative z-10 flex items-center justify-between"
          >
            <Logo />
            <Link
              to="/login"
              className="hidden items-center gap-1.5 rounded-full border border-teal/20 bg-white/60 px-4 py-2 text-sm font-medium text-teal backdrop-blur transition hover:bg-white sm:flex"
            >
              <FiLogIn className="text-base" />
              Log in
            </Link>
          </motion.div>

          {/* Hero content */}
          <div className="relative z-10 my-auto max-w-xl py-12">
            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0.05}
              className="mb-4 inline-flex items-center rounded-full bg-teal/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-teal"
            >
              Restaurant POS &amp; Kitchen Management
            </motion.p>

            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0.15}
              className="font-display text-4xl font-semibold leading-[1.1] text-coffee sm:text-5xl lg:text-6xl"
            >
              CafeVibes
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0.25}
              className="mt-3 font-display text-xl italic text-teal sm:text-2xl"
            >
              The Digital Heartbeat of Your Cafe
            </motion.p>

            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0.35}
              className="mt-6 text-base leading-relaxed text-coffee/70 sm:text-lg"
            >
              CafeVibes is an intelligent Restaurant POS and Kitchen Management
              platform designed to streamline orders, tables, payments, kitchen
              workflows, and analytics from one centralized dashboard.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0.45}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Link
                to="/signup"
                className="group inline-flex items-center gap-2 rounded-full bg-teal px-6 py-3.5 text-sm font-semibold text-white shadow-glass transition hover:bg-teal-dark"
              >
                Get Started
                <FiArrowRight className="transition group-hover:translate-x-1" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full border border-coffee/20 bg-white/50 px-6 py-3.5 text-sm font-semibold text-coffee backdrop-blur transition hover:bg-white"
              >
                Login
              </Link>
              <a
                href="#learn-more"
                className="inline-flex items-center gap-2 px-2 py-3.5 text-sm font-semibold text-teal underline-offset-4 transition hover:underline"
              >
                Learn More
              </a>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0.55}
            className="relative z-10"
          >
            <StatsRow />
          </motion.div>
        </div>

        {/* Right Section - 3D Scene */}
        <div className="relative flex h-[60vh] w-full items-center justify-center bg-gradient-to-br from-teal via-teal-dark to-coffee lg:h-screen lg:w-1/2">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(212,163,115,0.25),transparent_55%)]" />
          <Suspense
            fallback={
              <div className="flex h-full w-full items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white" />
              </div>
            }
          >
            <div className="h-full w-full">
              <CafeScene3D />
            </div>
          </Suspense>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            id="learn-more"
            className="absolute bottom-8 left-1/2 max-w-sm -translate-x-1/2 text-center"
          >
            <p className="glass-card rounded-2xl px-6 py-4 text-sm text-white">
              Orders, tables, kitchen tickets, and payments — synced live across
              every screen in your cafe.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

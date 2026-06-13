import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const AnimatedCounter = ({ to, suffix = '', prefix = '', duration = 1.6 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(Math.floor(eased * to));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [isInView, to, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  );
};

const StatItem = ({ value, suffix, prefix, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
  >
    <p className="font-display text-3xl font-semibold text-teal sm:text-4xl">
      <AnimatedCounter to={value} suffix={suffix} prefix={prefix} />
    </p>
    <p className="mt-1 text-sm text-coffee/70">{label}</p>
  </motion.div>
);

const StatsRow = () => {
  const stats = [
    { value: 48200, suffix: '+', label: 'Orders processed' },
    { value: 182000, prefix: '$', suffix: '+', label: 'Revenue generated' },
    { value: 36, label: 'Active tables' },
    { value: 12500, suffix: '+', label: 'Happy customers' },
  ];

  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
      {stats.map((stat, i) => (
        <StatItem key={stat.label} {...stat} delay={0.15 * i} />
      ))}
    </div>
  );
};

export default StatsRow;

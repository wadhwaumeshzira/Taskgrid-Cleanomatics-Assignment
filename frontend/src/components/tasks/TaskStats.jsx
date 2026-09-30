import { CheckCircle2, Clock, Loader2, ListTodo } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Simple custom hook for count up animation
function useCountUp(endValue, duration = 1000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function: easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeProgress * endValue));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [endValue, duration]);
  return count;
}

function StatCard({ icon: Icon, label, count, color, gradientCls, iconBg, shadowCls, index }) {
  const animatedCount = useCountUp(count ?? 0, 1200);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.25, ease: 'easeOut' } }}
      className="group relative flex flex-col justify-center px-5 py-5 rounded-[16px] border border-gray-200/70 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-none dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all duration-300 cursor-default overflow-hidden"
    >
      {/* Animated gradient top border line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${gradientCls} opacity-40 group-hover:opacity-100 transition-opacity duration-300`} />
      
      {/* Soft background glow on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientCls} opacity-0 group-hover:opacity-[0.03] dark:group-hover:opacity-[0.05] transition-opacity duration-500`} />
      
      <div className="flex items-center gap-4 relative z-10">
        <div className={`flex items-center justify-center w-12 h-12 rounded-[14px] ${iconBg} border border-white/20 dark:border-white/5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${shadowCls}`}>
          <Icon size={22} className={color} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <p className="text-[28px] font-extrabold tracking-tight text-gray-900 dark:text-white leading-none mb-1">
            {animatedCount}
          </p>
          <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function TaskStats({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 my-2">
      <StatCard
        icon={ListTodo}
        label="Total Tasks"
        count={stats.total}
        color="text-indigo-600 dark:text-indigo-400"
        gradientCls="from-indigo-400 to-purple-500"
        iconBg="bg-indigo-50 dark:bg-indigo-500/10"
        shadowCls="group-hover:shadow-[0_0_15px_rgba(79,70,229,0.3)]"
        index={0}
      />
      <StatCard
        icon={Clock}
        label="Pending"
        count={stats.pending}
        color="text-amber-600 dark:text-amber-400"
        gradientCls="from-amber-400 to-orange-500"
        iconBg="bg-amber-50 dark:bg-amber-500/10"
        shadowCls="group-hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]"
        index={1}
      />
      <StatCard
        icon={Loader2}
        label="In Progress"
        count={stats.in_progress}
        color="text-blue-600 dark:text-blue-400"
        gradientCls="from-blue-400 to-indigo-500"
        iconBg="bg-blue-50 dark:bg-blue-500/10"
        shadowCls="group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
        index={2}
      />
      <StatCard
        icon={CheckCircle2}
        label="Completed"
        count={stats.completed}
        color="text-emerald-600 dark:text-emerald-400"
        gradientCls="from-emerald-400 to-teal-500"
        iconBg="bg-emerald-50 dark:bg-emerald-500/10"
        shadowCls="group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]"
        index={3}
      />
    </div>
  );
}

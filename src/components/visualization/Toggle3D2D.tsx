/**
 * 3D/2D View Toggle Component
 */

import { motion } from 'framer-motion';
import { Box, Square } from 'lucide-react';

interface Toggle3D2DProps {
  mode: '2d' | '3d';
  onChange: (mode: '2d' | '3d') => void;
}

export function Toggle3D2D({ mode, onChange }: Toggle3D2DProps) {
  return (
    <div className="inline-flex items-center rounded-lg bg-slate-100 p-1">
      <button
        type="button"
        onClick={() => onChange('2d')}
        className={`relative px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
          mode === '2d'
            ? 'bg-white text-emerald-700 shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        {mode === '2d' && (
          <motion.div
            layoutId="active-tab-indicator"
            className="absolute inset-0 bg-white rounded-md -z-10"
          />
        )}
        <Square size={14} />
        <span>2D</span>
      </button>

      <button
        type="button"
        onClick={() => onChange('3d')}
        className={`relative px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
          mode === '3d'
            ? 'bg-white text-emerald-700 shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        {mode === '3d' && (
          <motion.div
            layoutId="active-tab-indicator"
            className="absolute inset-0 bg-white rounded-md -z-10"
          />
        )}
        <Box size={14} />
        <span>3D</span>
      </button>
    </div>
  );
}

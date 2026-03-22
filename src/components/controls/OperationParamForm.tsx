import { motion } from 'framer-motion';
import { Shuffle, Loader2 } from 'lucide-react';
import { OperationParams, SDSOperation } from '@/types/sds';

export interface ParamSample {
  label: string;
  params: OperationParams;
}

interface OperationParamFormProps {
  operation: SDSOperation;
  params: OperationParams;
  samples: ParamSample[];
  sdsLen: number;
  onApplyParams: (params: OperationParams) => void;
  onChangeParam: (key: keyof OperationParams, value: string | number | boolean | undefined) => void;
  onRandom: () => void;
  onExecute: () => void;
  executing: boolean;
}

function toNumber(raw: string, fallback = 0): number {
  const value = Number(raw);
  return Number.isFinite(value) ? value : fallback;
}

export function OperationParamForm({
  operation,
  params,
  samples,
  sdsLen,
  onApplyParams,
  onChangeParam,
  onRandom,
  onExecute,
  executing,
}: OperationParamFormProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        {samples.map((sample) => (
          <motion.button
            key={sample.label}
            type="button"
            onClick={() => onApplyParams(sample.params)}
            whileHover={{ scale: 1.05, backgroundColor: '#e2e8f0' }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            {sample.label}
          </motion.button>
        ))}
        <motion.button
          type="button"
          onClick={onRandom}
          whileHover={{ scale: 1.05, backgroundColor: '#d1fae5' }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className="text-xs px-2 py-1 rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200 inline-flex items-center gap-1"
        >
          <Shuffle size={12} /> 随机合法数据
        </motion.button>
      </div>

      {operation === 'sdsnew' && (
        <input
          type="text"
          value={params.inputString || ''}
          onChange={(event) => onChangeParam('inputString', event.target.value)}
          placeholder="输入初始字符串"
          className="w-full px-3 py-2 rounded border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      )}

      {operation === 'sdscat' && (
        <input
          type="text"
          value={params.concatString || ''}
          onChange={(event) => onChangeParam('concatString', event.target.value)}
          placeholder="输入追加字符串"
          className="w-full px-3 py-2 rounded border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      )}

      {operation === 'sdscpy' && (
        <input
          type="text"
          value={params.copyString || ''}
          onChange={(event) => onChangeParam('copyString', event.target.value)}
          placeholder="输入覆盖字符串"
          className="w-full px-3 py-2 rounded border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      )}

      {operation === 'sdsrange' && (
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min={0}
            max={Math.max(0, sdsLen - 1)}
            value={params.startIndex ?? 0}
            onChange={(event) => onChangeParam('startIndex', toNumber(event.target.value))}
            className="w-full px-3 py-2 rounded border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
          <input
            type="number"
            min={params.startIndex ?? 0}
            max={Math.max(0, sdsLen - 1)}
            value={params.endIndex ?? 0}
            onChange={(event) => onChangeParam('endIndex', toNumber(event.target.value))}
            className="w-full px-3 py-2 rounded border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      )}

      {operation === 'sdstrim' && (
        <input
          type="text"
          value={params.trimChars || ''}
          onChange={(event) => onChangeParam('trimChars', event.target.value)}
          placeholder="输入两端要删除的字符集合"
          className="w-full px-3 py-2 rounded border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      )}

      {operation === 'sdsMakeRoomFor' && (
        <input
          type="number"
          min={1}
          value={params.extraBytes ?? ''}
          onChange={(event) => onChangeParam('extraBytes', toNumber(event.target.value))}
          placeholder="额外字节数"
          className="w-full px-3 py-2 rounded border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      )}

      <motion.button
        type="button"
        onClick={onExecute}
        disabled={executing}
        whileHover={executing ? {} : { scale: 1.02, backgroundColor: '#059669' }}
        whileTap={executing ? {} : { scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {executing ? (
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 size={16} />
          </motion.span>
        ) : null}
        <span>{executing ? '执行中...' : '执行操作'}</span>
      </motion.button>
    </div>
  );
}

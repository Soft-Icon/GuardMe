import React from 'react';
import { GuardMEResponse } from '../types';
import { ShieldCheck, ShieldAlert, AlertTriangle, Info, Lock } from 'lucide-react';

interface AnalysisResultProps {
  result: GuardMEResponse;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result }) => {
  const isSafe = result.safe;
  const isBlock = result.action === 'BLOCK';
  const isWarn = result.action === 'WARN';

  let borderColor = "border-green-200";
  let bgColor = "bg-green-50";
  let textColor = "text-green-800";
  let Icon = ShieldCheck;

  if (isBlock) {
    borderColor = "border-red-200";
    bgColor = "bg-red-50";
    textColor = "text-red-800";
    Icon = ShieldAlert;
  } else if (isWarn) {
    borderColor = "border-amber-200";
    bgColor = "bg-amber-50";
    textColor = "text-amber-800";
    Icon = AlertTriangle;
  }

  return (
    <div className={`w-full p-6 rounded-xl border-2 ${borderColor} ${bgColor} transition-all duration-300 shadow-sm animate-fade-in`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-full ${isSafe ? 'bg-green-200' : isBlock ? 'bg-red-200' : 'bg-amber-200'}`}>
            <Icon className={`w-8 h-8 ${isSafe ? 'text-green-700' : isBlock ? 'text-red-700' : 'text-amber-700'}`} />
          </div>
          <div>
            <h3 className={`text-xl font-bold ${textColor}`}>
              {result.action}ED
            </h3>
            <p className={`text-sm font-medium ${textColor} opacity-80`}>
              Risk Score: {result.risk_score}/10
            </p>
          </div>
        </div>
        {!isSafe && (
          <div className="px-3 py-1 rounded-full bg-white/50 border border-white/20 text-xs font-bold uppercase tracking-wide">
            {result.primary_category}
          </div>
        )}
      </div>

      <div className="bg-white/60 rounded-lg p-4 backdrop-blur-sm">
        <h4 className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
          <Info className="w-4 h-4" /> Reasoning
        </h4>
        <p className="text-gray-800 leading-relaxed">
          {result.reasoning}
        </p>
      </div>

      <div className="mt-4 flex gap-2">
         {isBlock && (
             <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded">
                <Lock className="w-3 h-3" /> Content Blocked
             </span>
         )}
      </div>
    </div>
  );
};

export default AnalysisResult;
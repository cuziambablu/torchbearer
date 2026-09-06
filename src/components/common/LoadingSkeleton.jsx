import React from 'react';

export function OpportunityCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-card animate-pulse flex flex-col justify-between h-[340px]">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 w-24 bg-slate-200 rounded-md"></div>
          <div className="h-5 w-16 bg-slate-200 rounded-md"></div>
        </div>
        <div className="h-6 w-3/4 bg-slate-200 rounded-md mb-2"></div>
        <div className="h-4 w-1/2 bg-slate-200 rounded-md mb-4"></div>
        <div className="space-y-2 mb-4">
          <div className="h-3 w-full bg-slate-100 rounded"></div>
          <div className="h-3 w-5/6 bg-slate-100 rounded"></div>
        </div>
      </div>
      <div>
        <div className="flex gap-1.5 mb-4">
          <div className="h-5 w-14 bg-slate-100 rounded-md"></div>
          <div className="h-5 w-16 bg-slate-100 rounded-md"></div>
          <div className="h-5 w-12 bg-slate-100 rounded-md"></div>
        </div>
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="h-4 w-28 bg-slate-200 rounded"></div>
          <div className="h-8 w-24 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-subtle animate-pulse">
      <div className="h-12 bg-slate-50 border-b border-slate-200"></div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="p-4 flex items-center justify-between gap-4">
            <div className="h-5 w-1/3 bg-slate-200 rounded"></div>
            <div className="h-5 w-1/6 bg-slate-100 rounded"></div>
            <div className="h-5 w-1/6 bg-slate-100 rounded"></div>
            <div className="h-8 w-20 bg-slate-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LoadingSkeleton({ type = 'card', count = 6 }) {
  if (type === 'table') {
    return <TableSkeleton rows={count} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <OpportunityCardSkeleton key={idx} />
      ))}
    </div>
  );
}

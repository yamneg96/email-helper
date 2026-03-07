import React from "react";

export interface EmptyStateCardProps {
  title: string;
  description: string;
}

export default function EmptyStateCard({ title, description }: EmptyStateCardProps): React.ReactElement {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </div>
  );
}
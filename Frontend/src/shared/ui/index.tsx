import React from "react";

export type SectionHeadingProps = {
  title: string;
  subtitle?: string;
};

export default function SectionHeading({ title, subtitle }: SectionHeadingProps): React.ReactElement {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold tracking-tight text-white">{title}</h2>
      {subtitle ? <p className="mt-2 text-sm text-slate-400">{subtitle}</p> : null}
    </div>
  );
}
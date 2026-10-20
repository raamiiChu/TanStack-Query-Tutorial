import type { QueryKey } from "@tanstack/react-query";

import { cn } from "@/lib/utils";

type QueryKeyDisplayProps = {
  label: string;
  queryKey: QueryKey;
  /** Index of the segment that comes from a variable, highlighted to show it changing. */
  variableIndex?: number;
};

const QueryKeyDisplay = ({
  label,
  queryKey,
  variableIndex,
}: QueryKeyDisplayProps) => (
  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg bg-slate-900 px-4 py-3 font-mono text-sm text-zinc-300">
    <span className="text-zinc-500">{label}</span>
    <span>
      <span className="text-sky-300">queryKey</span>: [
      {queryKey.map((segment, index) => (
        <span key={index}>
          {index > 0 && ", "}
          <span
            // Re-keying replays the highlight animation whenever the value changes.
            key={JSON.stringify(segment)}
            className={cn(
              "text-emerald-300",
              index === variableIndex &&
                "animate-in zoom-in-150 rounded bg-amber-400/20 px-1 font-bold text-amber-300 duration-300"
            )}
          >
            {JSON.stringify(segment)}
          </span>
        </span>
      ))}
      ]
    </span>
  </div>
);

export default QueryKeyDisplay;

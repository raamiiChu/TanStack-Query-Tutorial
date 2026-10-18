import PreviewSections, { type Section } from "@/components/preview-sections";
import { H1, H2, InlineCode, List, P } from "@/components/ui/typography";
import { readSource } from "@/lib/source";

import DedupDemo from "./_components/dedup-demo";
import LifecycleDemo from "./_components/lifecycle-demo";

const LIFECYCLE_STEPS = [
  ["fetching", "No data yet, or a refetch is in flight."],
  ["fresh", "Data is younger than staleTime. Served from cache, no request."],
  [
    "stale",
    "Data is older than staleTime. Served from cache AND refetched on the next trigger.",
  ],
  [
    "inactive",
    "No component uses the query anymore. The gcTime countdown starts.",
  ],
  ["garbage collected", "gcTime elapsed. The entry is removed from the cache."],
];

const sections: Section[] = [
  {
    name: "Query lifecycle",
    Example: LifecycleDemo,
    files: [
      readSource("src/app/basics/mental-model/_components/lifecycle-demo.tsx"),
      readSource("src/features/todos/queries.ts"),
    ],
    Description: () => (
      <>
        <H1>Mental Model</H1>
        <P>
          TanStack Query is an <b>async state manager</b>: a cache of server
          state, keyed by <InlineCode>queryKey</InlineCode>, with
          stale-while-revalidate semantics. Every cached query moves through the
          same lifecycle:
        </P>
        <ol className="my-6 grid gap-2 md:grid-cols-5">
          {LIFECYCLE_STEPS.map(([title, description], index) => (
            <li key={title} className="bg-secondary rounded-lg p-3 text-sm">
              <p className="font-mono font-semibold">
                {index + 1}. {title}
              </p>
              <p className="text-muted-foreground mt-1">{description}</p>
            </li>
          ))}
        </ol>
        <H2>staleTime vs gcTime</H2>
        <List>
          <li>
            <InlineCode>staleTime</InlineCode> (default{" "}
            <InlineCode>0</InlineCode>
            ): how long data counts as fresh. Fresh data never triggers a
            request.
          </li>
          <li>
            <InlineCode>gcTime</InlineCode> (default 5 minutes, called{" "}
            <InlineCode>cacheTime</InlineCode> in v4): how long an{" "}
            <b>inactive</b> query stays in memory.
          </li>
        </List>
        <P>
          Try it: unmount the list, mount it again and watch the request log.
          With <InlineCode>staleTime: 0</InlineCode> you get cached data
          instantly <b>and</b> a background refetch. With{" "}
          <InlineCode>gcTime: 5s</InlineCode>, wait 5 seconds before remounting
          and the entry is gone.
        </P>
      </>
    ),
  },
  {
    name: "Request deduplication",
    Example: DedupDemo,
    files: [
      readSource("src/app/basics/mental-model/_components/dedup-demo.tsx"),
    ],
    Description: () => (
      <>
        <H2>Request deduplication</H2>
        <P>
          Components using the same <InlineCode>queryKey</InlineCode> share one
          cache entry and one in-flight request. No prop drilling and no global
          store needed: just call the hook where you need the data.
        </P>
        <P>
          Stale queries also refetch automatically on{" "}
          <InlineCode>mount</InlineCode>, <InlineCode>window focus</InlineCode>{" "}
          and <InlineCode>reconnect</InlineCode>. Switch to another browser tab
          and back to see the extra request.
        </P>
      </>
    ),
  },
];

const MentalModel = () => <PreviewSections sections={sections} />;

export default MentalModel;

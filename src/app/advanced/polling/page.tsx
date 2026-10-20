import PreviewSections, { type Section } from "@/components/preview-sections";
import { H1, InlineCode, List, P } from "@/components/ui/typography";
import { readSource } from "@/lib/source";

import PollingDemo from "./_components/polling-demo";

const sections: Section[] = [
  {
    name: "Polling a long-running job",
    Example: PollingDemo,
    files: [
      readSource("src/features/jobs/queries.ts", [
        { from: "refetchInterval: (query) =>", to: "? false : 1000" },
      ]),
      readSource("src/app/advanced/polling/_components/polling-demo.tsx", [
        "useQuery(jobQueries.detail(jobId))",
        "onSuccess: (job) => setJobId(job.id)",
      ]),
      readSource("src/app/api/jobs/[id]/route.ts", [
        { from: "const progress", to: "status: progress >= 100" },
      ]),
    ],
    Description: () => (
      <>
        <H1>Polling</H1>
        <P>
          Exports, imports and other background jobs usually report progress
          through a status endpoint. <InlineCode>refetchInterval</InlineCode>{" "}
          turns any query into a poller.
        </P>
        <List>
          <li>
            Pass a <b>function</b> to stop polling based on the data:{" "}
            <InlineCode>
              {"(query) => query.state.data?.status === 'done' ? false : 1000"}
            </InlineCode>
          </li>
          <li>
            Polling pauses when the tab is hidden. Opt out with{" "}
            <InlineCode>refetchIntervalInBackground: true</InlineCode>.
          </li>
          <li>
            Polling stops automatically when the component unmounts, so there is
            no <InlineCode>clearInterval</InlineCode> to forget.
          </li>
        </List>
      </>
    ),
  },
];

const PollingPage = () => <PreviewSections sections={sections} />;

export default PollingPage;

import PreviewSections, { type Section } from "@/components/preview-sections";
import { H1, H2, InlineCode, List, P } from "@/components/ui/typography";
import { readSource } from "@/lib/source";

import DependentDemo from "./_components/dependent-demo";
import ParallelDemo from "./_components/parallel-demo";

const sections: Section[] = [
  {
    name: "Dependent queries",
    Example: DependentDemo,
    files: [
      readSource(
        "src/app/advanced/dependent-and-parallel/_components/dependent-demo.tsx"
      ),
    ],
    Description: () => (
      <>
        <H1>Dependent & Parallel Queries</H1>
        <H2>Dependent queries</H2>
        <P>
          When query B needs the result of query A, disable B until the input
          exists:
        </P>
        <List>
          <li>
            <InlineCode>enabled: !!id</InlineCode>: classic approach
          </li>
          <li>
            <InlineCode>queryFn: id ? fn : skipToken</InlineCode>: type-safe in
            v5, no non-null assertion needed
          </li>
        </List>
        <P>
          A disabled query has <InlineCode>status: pending</InlineCode> but{" "}
          <InlineCode>fetchStatus: idle</InlineCode>. Dependent queries are a
          waterfall by definition, so check whether the API could return both in
          one request.
        </P>
      </>
    ),
  },
  {
    name: "Parallel queries with useQueries",
    Example: ParallelDemo,
    files: [
      readSource(
        "src/app/advanced/dependent-and-parallel/_components/parallel-demo.tsx"
      ),
    ],
    Description: () => (
      <>
        <H2>Parallel queries</H2>
        <P>
          Multiple <InlineCode>useQuery</InlineCode> calls already run in
          parallel. Use <InlineCode>useQueries</InlineCode> when the{" "}
          <b>number</b> of queries is dynamic, and{" "}
          <InlineCode>combine</InlineCode> to merge the results into one stable
          value.
        </P>
      </>
    ),
  },
];

const DependentAndParallelPage = () => <PreviewSections sections={sections} />;

export default DependentAndParallelPage;

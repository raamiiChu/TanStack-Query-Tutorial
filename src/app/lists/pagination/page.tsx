import PreviewSections, { type Section } from "@/components/preview-sections";
import { H1, InlineCode, List, P } from "@/components/ui/typography";
import { readSource } from "@/lib/source";

import PaginationDemo from "./_components/pagination-demo";

const sections: Section[] = [
  {
    name: "Paginated queries",
    Example: PaginationDemo,
    files: [
      readSource("src/app/lists/pagination/_components/pagination-demo.tsx"),
      readSource("src/app/api/todos/paginated/route.ts"),
    ],
    Description: () => (
      <>
        <H1>Pagination</H1>
        <P>
          Every page is its own cache entry (
          <InlineCode>[&quot;todos&quot;, &quot;page&quot;, 2]</InlineCode>
          ), so changing the page switches to a brand-new query and normally
          shows a loading state.
        </P>
        <List>
          <li>
            <InlineCode>placeholderData: keepPreviousData</InlineCode> keeps
            showing the previous page while the next one loads.{" "}
            <InlineCode>isPlaceholderData</InlineCode> tells you when that
            happens. (In v4 this was{" "}
            <InlineCode>keepPreviousData: true</InlineCode>.)
          </li>
          <li>
            <InlineCode>prefetchQuery</InlineCode> for the next page makes
            clicking &quot;next&quot; instant.
          </li>
        </List>
        <P>
          Try it: set latency to 1500ms, turn{" "}
          <InlineCode>keepPrevious</InlineCode> off and on, then turn on{" "}
          <InlineCode>prefetchNext</InlineCode>.
        </P>
      </>
    ),
  },
];

const PaginationPage = () => <PreviewSections sections={sections} />;

export default PaginationPage;

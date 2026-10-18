import PreviewSections, { type Section } from "@/components/preview-sections";
import { H1, InlineCode, List, P } from "@/components/ui/typography";
import { readSource } from "@/lib/source";

import PrefetchDemo from "./_components/prefetch-demo";

const sections: Section[] = [
  {
    name: "Prefetch on hover",
    Example: PrefetchDemo,
    files: [
      readSource("src/app/advanced/prefetching/_components/prefetch-demo.tsx"),
    ],
    Description: () => (
      <>
        <H1>Prefetching</H1>
        <P>
          Users hover before they click, which buys a few hundred ms.{" "}
          <InlineCode>queryClient.prefetchQuery</InlineCode> fills the cache
          ahead of time with the <b>same</b> query options the detail view uses.
        </P>
        <List>
          <li>Prefetch on hover / focus for links and list items</li>
          <li>Prefetch the next page in paginated lists</li>
          <li>
            Prefetch in a router loader or Server Component (with{" "}
            <InlineCode>HydrationBoundary</InlineCode>)
          </li>
        </List>
        <P>
          Try it: set latency to 1500ms and compare clicking with{" "}
          <InlineCode>onHover</InlineCode> on vs off.
        </P>
      </>
    ),
  },
];

const PrefetchingPage = () => <PreviewSections sections={sections} />;

export default PrefetchingPage;

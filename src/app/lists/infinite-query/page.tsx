import PreviewSections, { type Section } from "@/components/preview-sections";
import { H1, H2, InlineCode, List, P } from "@/components/ui/typography";
import { readSource } from "@/lib/source";

import InfiniteDemo from "./_components/infinite-demo";

const sections: Section[] = [
  {
    name: "useInfiniteQuery + Prisma cursor",
    Example: InfiniteDemo,
    files: [
      readSource("src/app/lists/infinite-query/_components/infinite-demo.tsx"),
      readSource("src/features/todos/queries.ts"),
      readSource("src/app/api/todos/infinite/route.ts"),
    ],
    Description: () => (
      <>
        <H1>Infinite Query</H1>
        <P>
          <InlineCode>useInfiniteQuery</InlineCode> stores all loaded pages in
          <b> one</b> cache entry as{" "}
          <InlineCode>{"{ pages, pageParams }"}</InlineCode>. You tell it how to
          get the next page with <InlineCode>getNextPageParam</InlineCode>.
        </P>
        <H2>Frontend ↔ backend contract</H2>
        <List>
          <li>
            Frontend: <InlineCode>initialPageParam</InlineCode> +{" "}
            <InlineCode>
              getNextPageParam: (lastPage) =&gt; lastPage.nextCursor
            </InlineCode>
          </li>
          <li>
            Backend (Prisma):{" "}
            <InlineCode>
              {"findMany({ take: limit + 1, cursor: { id }, skip: 1 })"}
            </InlineCode>{" "}
            and return <InlineCode>nextCursor</InlineCode> (or{" "}
            <InlineCode>null</InlineCode> when done)
          </li>
          <li>
            Cursor pagination stays correct when rows are inserted or deleted
            while the user scrolls. Offset pagination would skip or duplicate
            rows.
          </li>
        </List>
        <P>
          Good to know: a refetch re-fetches <b>every</b> loaded page in order,
          so consistent cursors matter. Use <InlineCode>maxPages</InlineCode> to
          cap memory for very long lists.
        </P>
      </>
    ),
  },
];

const InfiniteQueryPage = () => <PreviewSections sections={sections} />;

export default InfiniteQueryPage;

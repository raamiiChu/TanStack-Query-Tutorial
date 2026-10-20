import PreviewSections, { type Section } from "@/components/preview-sections";
import { CodeBlock } from "@/components/ui/code-block";
import { H1, H2, InlineCode, List, P } from "@/components/ui/typography";
import { readSource } from "@/lib/source";

import KeyFactoryDemo from "./_components/key-factory-demo";
import SelectDemo from "./_components/select-demo";

const keyHierarchy = `todoKeys.all            // ["todos"]
todoKeys.lists()        // ["todos", "list"]
todoKeys.list(5)        // ["todos", "list", { limit: 5 }]
todoKeys.details()      // ["todos", "detail"]
todoKeys.detail(1)      // ["todos", "detail", 1]

// Invalidation matches by prefix:
queryClient.invalidateQueries({ queryKey: todoKeys.details() })
// -> every ["todos", "detail", *] query, nothing else`;

const sections: Section[] = [
  {
    name: "Query key factory",
    Example: KeyFactoryDemo,
    files: [
      readSource("src/features/todos/queries.ts", [
        { from: "export const todoKeys = {", to: "};" },
        {
          from: "queryKey: todoKeys.detail(id)",
          to: "queryFn: ({ signal }) => fetchTodo(id, signal)",
        },
      ]),
      readSource(
        "src/app/basics/query-options/_components/key-factory-demo.tsx",
        [
          "todoQueries.detail(todoId)",
          "invalidateQueries({ queryKey: todoKeys.details() })",
          "removeQueries({ queryKey: todoKeys.all })",
        ]
      ),
    ],
    Description: () => (
      <>
        <H1>Query Keys & Options</H1>
        <P>
          The query key is the identity of a cache entry. Treat it like a
          dependency array:{" "}
          <b>every variable the queryFn uses belongs in the key</b>. Keeping
          keys in one factory avoids typos and makes hierarchical invalidation
          easy.
        </P>
        <CodeBlock language="ts" filename="query keys" code={keyHierarchy} />
        <H2 className="mt-8">queryOptions()</H2>
        <P>
          <InlineCode>queryOptions</InlineCode> bundles{" "}
          <InlineCode>queryKey</InlineCode> + <InlineCode>queryFn</InlineCode>{" "}
          (+ defaults) into one typed object you can pass to{" "}
          <InlineCode>useQuery</InlineCode>,{" "}
          <InlineCode>useSuspenseQuery</InlineCode>,{" "}
          <InlineCode>prefetchQuery</InlineCode> or{" "}
          <InlineCode>getQueryData</InlineCode>, and the data type flows through
          all of them.
        </P>
        <P>
          Try it: switch between todos. Each id is its own cache entry, so going
          back to a visited id renders instantly.
        </P>
      </>
    ),
  },
  {
    name: "Transform with select",
    Example: SelectDemo,
    files: [
      readSource("src/app/basics/query-options/_components/select-demo.tsx", [
        { from: "const selectCompletedCount", to: "const selectTitles" },
        "select: selectCompletedCount",
        "select: selectTitles",
      ]),
    ],
    Description: () => (
      <>
        <H2>Transform with select</H2>
        <List>
          <li>
            Derive data per component while sharing <b>one</b> request and one
            cache entry.
          </li>
          <li>
            A component re-renders only when <b>its selected value</b> changes,
            not whenever the cached data changes.
          </li>
          <li>
            Define <InlineCode>select</InlineCode> outside the component (or
            wrap it in <InlineCode>useCallback</InlineCode>) so it isn&apos;t
            re-run on every render.
          </li>
        </List>
        <P>
          Try it: all three components read the same query. Click{" "}
          <b>Toggle completed</b>, then <b>Rename</b>, and watch which{" "}
          <InlineCode>renders</InlineCode> counters go up.
        </P>
      </>
    ),
  },
];

const QueryOptionsPage = () => <PreviewSections sections={sections} />;

export default QueryOptionsPage;

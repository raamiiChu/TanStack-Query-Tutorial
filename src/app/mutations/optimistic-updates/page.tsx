import PreviewSections, { type Section } from "@/components/preview-sections";
import { H1, H2, InlineCode, List, P } from "@/components/ui/typography";
import { readSource } from "@/lib/source";

import OptimisticCacheDemo from "./_components/optimistic-cache-demo";
import OptimisticUiDemo from "./_components/optimistic-ui-demo";

const sections: Section[] = [
  {
    name: "Optimistic update via the cache",
    Example: OptimisticCacheDemo,
    files: [
      readSource(
        "src/app/mutations/optimistic-updates/_components/optimistic-cache-demo.tsx",
        [{ from: "onMutate: async (variables) => {", to: "onSettled:" }]
      ),
    ],
    Description: () => (
      <>
        <H1>Optimistic Updates</H1>
        <P>
          Update the UI before the server responds, and roll back if it fails.
          TanStack Query supports two approaches.
        </P>
        <H2>1. Via the cache</H2>
        <List>
          <li>
            <InlineCode>onMutate</InlineCode>:{" "}
            <InlineCode>cancelQueries</InlineCode> → snapshot →{" "}
            <InlineCode>setQueryData</InlineCode> → return the snapshot
          </li>
          <li>
            <InlineCode>onError</InlineCode>: restore the snapshot
          </li>
          <li>
            <InlineCode>onSettled</InlineCode>: invalidate to sync with the
            server
          </li>
        </List>
        <P>
          Every component reading this query sees the optimistic value. Try it:
          set the <b>error rate to 50%</b> in the sidebar and toggle a few todos
          quickly.
        </P>
      </>
    ),
  },
  {
    name: "Optimistic update via the UI",
    Example: OptimisticUiDemo,
    files: [
      readSource(
        "src/app/mutations/optimistic-updates/_components/optimistic-ui-demo.tsx",
        [
          "onSettled: () =>",
          { from: "{addTodo.isPending && (", to: 'className="opacity-50"' },
          "onClick={() => addTodo.mutate(addTodo.variables)}",
        ]
      ),
    ],
    Description: () => (
      <>
        <H2>2. Via the UI</H2>
        <P>
          Render <InlineCode>mutation.variables</InlineCode> while{" "}
          <InlineCode>isPending</InlineCode>. No cache writes, no rollback code:
          on failure the pending item simply turns into an error state with a
          retry button.
        </P>
        <P>
          Use this when only one place shows the optimistic value. Use{" "}
          <InlineCode>useMutationState</InlineCode> if another component needs
          to see pending mutations too.
        </P>
      </>
    ),
  },
];

const OptimisticUpdatesPage = () => <PreviewSections sections={sections} />;

export default OptimisticUpdatesPage;

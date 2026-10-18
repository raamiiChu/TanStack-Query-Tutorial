import PreviewSections, { type Section } from "@/components/preview-sections";
import { H1, InlineCode, List, P } from "@/components/ui/typography";
import { readSource } from "@/lib/source";

import SuspenseDemo from "./_components/suspense-demo";

const sections: Section[] = [
  {
    name: "useSuspenseQuery",
    Example: SuspenseDemo,
    files: [
      readSource("src/app/advanced/suspense/_components/suspense-demo.tsx"),
    ],
    Description: () => (
      <>
        <H1>Suspense</H1>
        <P>
          <InlineCode>useSuspenseQuery</InlineCode> moves loading and error
          handling out of the component and into the nearest{" "}
          <InlineCode>{"<Suspense>"}</InlineCode> and Error Boundary. In return,{" "}
          <InlineCode>data</InlineCode> is never{" "}
          <InlineCode>undefined</InlineCode>.
        </P>
        <List>
          <li>
            Background refetches do <b>not</b> show the fallback again. Use{" "}
            <InlineCode>isFetching</InlineCode> for that.
          </li>
          <li>
            Wrap with <InlineCode>QueryErrorResetBoundary</InlineCode> so
            &quot;Try again&quot; actually refetches instead of re-throwing the
            cached error.
          </li>
          <li>
            Several <InlineCode>useSuspenseQuery</InlineCode> calls in one
            component run <b>sequentially</b> (waterfall). Use{" "}
            <InlineCode>useSuspenseQueries</InlineCode> or sibling components.
          </li>
          <li>
            <InlineCode>enabled</InlineCode> and{" "}
            <InlineCode>placeholderData</InlineCode> are not available. Render
            the component conditionally instead.
          </li>
        </List>
        <P>
          Try it: set the <b>error rate to 100%</b>, mount the list, then set it
          back to 0% and click &quot;Try again&quot;.
        </P>
      </>
    ),
  },
];

const SuspensePage = () => <PreviewSections sections={sections} />;

export default SuspensePage;

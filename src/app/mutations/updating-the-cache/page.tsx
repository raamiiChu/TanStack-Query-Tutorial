import PreviewSections, { type Section } from "@/components/preview-sections";
import {
  H1,
  H2,
  InlineCode,
  P,
  TBody,
  TD,
  TH,
  THead,
  TR,
  Table,
} from "@/components/ui/typography";
import { readSource } from "@/lib/source";

import CacheUpdateDemo from "./_components/cache-update-demo";

const sections: Section[] = [
  {
    name: "invalidateQueries vs setQueryData",
    Example: CacheUpdateDemo,
    files: [
      readSource(
        "src/app/mutations/updating-the-cache/_components/cache-update-demo.tsx",
        [{ from: "onSuccess: (newTodo) => {", to: "[newTodo, ...old]" }]
      ),
      readSource("src/app/api/todos/route.ts", [
        {
          from: "const todo = await prisma.todo.create",
          to: "return Response.json(todo, { status: 201 })",
        },
      ]),
    ],
    Description: () => (
      <>
        <H1>Updating the Cache</H1>
        <P>
          After a mutation succeeds, the cached server state is outdated. There
          are two ways to fix it:
        </P>
        <Table>
          <THead>
            <TR>
              <TH />
              <TH>invalidateQueries</TH>
              <TH>setQueryData</TH>
            </TR>
          </THead>
          <TBody>
            <TR>
              <TD>How</TD>
              <TD>Mark matching queries stale and refetch the active ones</TD>
              <TD>Write the mutation response into the cache</TD>
            </TR>
            <TR>
              <TD>Extra request</TD>
              <TD>Yes</TD>
              <TD>No</TD>
            </TR>
            <TR>
              <TD>Correctness</TD>
              <TD>Always matches the server (sorting, filters, counts…)</TD>
              <TD>You re-implement server logic on the client</TD>
            </TR>
            <TR>
              <TD>Use when</TD>
              <TD>Default choice, many queries affected</TD>
              <TD>Response contains everything needed, e.g. detail views</TD>
            </TR>
          </TBody>
        </Table>
        <H2>Try it</H2>
        <P>
          Add a todo with each strategy and compare the request log. Note that
          returning the promise from <InlineCode>onSuccess</InlineCode> keeps{" "}
          <InlineCode>isPending</InlineCode> true until the refetch finishes.
        </P>
      </>
    ),
  },
];

const UpdatingTheCachePage = () => <PreviewSections sections={sections} />;

export default UpdatingTheCachePage;

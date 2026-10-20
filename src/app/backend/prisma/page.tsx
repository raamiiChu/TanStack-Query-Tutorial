import { CodeBlock } from "@/components/ui/code-block";
import {
  H1,
  H2,
  InlineCode,
  List,
  P,
  TBody,
  TD,
  TH,
  THead,
  TR,
  Table,
} from "@/components/ui/typography";
import { readSource } from "@/lib/source";

const files = {
  schema: readSource("prisma/schema.prisma", [
    { from: "model Todo {", to: "updatedAt" },
  ]),
  db: readSource("src/server/db.ts", [
    "adapter: new PrismaBetterSqlite3({",
    "export const prisma =",
  ]),
  api: readSource("src/server/api.ts", [
    { from: "if (delay > 0)", to: "Simulated server error" },
    "if (error instanceof z.ZodError)",
    "if (error instanceof HttpError)",
  ]),
  todos: readSource("src/app/api/todos/route.ts", [
    { from: "prisma.todo.findMany", to: "take: limit" },
    { from: "const todo = await prisma.todo.create", to: "status: 201" },
  ]),
  todo: readSource("src/app/api/todos/[id]/route.ts", [
    "if (!todo) throw new HttpError(404",
    "prisma.todo.update",
  ]),
  infinite: readSource("src/app/api/todos/infinite/route.ts", [
    { from: "take: limit + 1", to: "cursor: { id: cursor }" },
    { from: "const hasMore", to: "nextCursor: hasMore" },
  ]),
};

const ENDPOINTS = [
  ["GET", "/api/todos?limit=5", "Latest todos", "useQuery"],
  ["POST", "/api/todos", "Create, returns the new todo (201)", "useMutation"],
  ["GET", "/api/todos/:id", "Todo detail, 404 when missing", "useQuery"],
  [
    "PATCH",
    "/api/todos/:id",
    "Update, returns the updated todo",
    "useMutation",
  ],
  ["DELETE", "/api/todos/:id", "Delete (204)", "useMutation"],
  [
    "GET",
    "/api/todos/paginated?page=1",
    "Offset pagination",
    "useQuery + keepPreviousData",
  ],
  [
    "GET",
    "/api/todos/infinite?cursor=10",
    "Cursor pagination",
    "useInfiniteQuery",
  ],
  ["POST", "/api/jobs", "Start a fake background job", "useMutation"],
  ["GET", "/api/jobs/:id", "Job progress", "useQuery + refetchInterval"],
];

const PrismaPage = () => (
  <div className="space-y-12">
    <section>
      <H1>Prisma & Route Handlers</H1>
      <P>
        The demo backend lives in the same Next.js app: <b>Route Handlers</b> (
        <InlineCode>src/app/api/**/route.ts</InlineCode>) + <b>Prisma ORM</b> on
        SQLite. Every endpoint accepts <InlineCode>?delay=ms</InlineCode> and{" "}
        <InlineCode>?fail=0..1</InlineCode> so the sidebar can simulate a slow
        or flaky network.
      </P>
      <Table>
        <THead>
          <TR>
            <TH>Method</TH>
            <TH>Path</TH>
            <TH>Description</TH>
            <TH>Used with</TH>
          </TR>
        </THead>
        <TBody>
          {ENDPOINTS.map(([method, path, description, usedWith]) => (
            <TR key={`${method} ${path}`}>
              <TD className="font-mono">{method}</TD>
              <TD className="font-mono">{path}</TD>
              <TD>{description}</TD>
              <TD>
                <InlineCode>{usedWith}</InlineCode>
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </section>

    <section>
      <H2>Schema & client</H2>
      <CodeBlock
        language="tsx"
        filename="Prisma"
        tabs={[files.schema, files.db]}
      />
    </section>

    <section>
      <H2>Route Handlers</H2>
      <CodeBlock
        language="tsx"
        filename="Route Handlers"
        tabs={[files.todos, files.todo, files.infinite, files.api]}
      />
    </section>

    <section>
      <H2>API design tips that make caching easier</H2>
      <List>
        <li>
          <b>Return the entity from mutations.</b> Prisma&apos;s{" "}
          <InlineCode>create</InlineCode> / <InlineCode>update</InlineCode>{" "}
          already do, and the client can then use{" "}
          <InlineCode>setQueryData</InlineCode> instead of refetching.
        </li>
        <li>
          <b>Use meaningful status codes.</b> 4xx means &quot;don&apos;t
          retry&quot;, 5xx means &quot;maybe try again&quot;.
        </li>
        <li>
          <b>Prefer cursor pagination for feeds.</b>{" "}
          <InlineCode>take: limit + 1</InlineCode> tells you if there&apos;s a
          next page without a <InlineCode>count()</InlineCode>.
        </li>
        <li>
          <b>Make mutations idempotent where possible.</b> Retries and
          double-clicks happen.
        </li>
        <li>
          <b>Stable ordering.</b> Always <InlineCode>orderBy</InlineCode> a
          unique column, otherwise pages can overlap.
        </li>
      </List>
    </section>
  </div>
);

export default PrismaPage;

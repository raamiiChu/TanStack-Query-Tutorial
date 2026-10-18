import Link from "next/link";

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

const beforeCode = `const [todos, setTodos] = useState<Todo[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<Error | null>(null);

useEffect(() => {
  let ignore = false; // race conditions
  setIsLoading(true);
  fetch(\`/api/todos?limit=\${limit}\`)
    .then((res) => res.json())
    .then((data) => !ignore && setTodos(data))
    .catch((err) => !ignore && setError(err))
    .finally(() => !ignore && setIsLoading(false));
  return () => { ignore = true };
}, [limit]);

// ❌ no caching, no dedup, no retry, no refetch on focus,
//    no invalidation after mutations...`;

const afterCode = `const { data: todos, isPending, error } = useQuery({
  queryKey: ["todos", "list", { limit }],
  queryFn: ({ signal }) => fetchTodos(limit, signal),
});

// ✅ cached, deduplicated, retried, refetched when stale,
//    cancelled on unmount, shared across components`;

const STATE_COMPARISON = [
  ["Owner", "The browser", "A remote server"],
  [
    "Examples",
    "Modal open, form input, theme",
    "Todos, users, segments, reports",
  ],
  ["Can be outdated?", "No", "Yes, someone else can change it"],
  [
    "Needs",
    "useState / Context / Zustand",
    "Caching, dedup, refetching, invalidation",
  ],
];

const AGENDA = [
  ["Mental Model", "/basics/mental-model"],
  ["Query Keys & Options", "/basics/query-options"],
  ["Mutations & Optimistic Updates", "/mutations/updating-the-cache"],
  ["Pagination & Infinite Query", "/lists/pagination"],
  ["Advanced Patterns", "/advanced/prefetching"],
  ["Backend: Prisma & Route Handlers", "/backend/prisma"],
  ["Common Pitfalls", "/wrap-up/pitfalls"],
];

export default function Home() {
  return (
    <div className="space-y-12">
      <section>
        <H1>TanStack Query — Beyond the Basics</H1>
        <P>
          TanStack Query (formerly React Query) is often described as a
          &quot;data fetching library&quot;. It doesn&apos;t actually fetch
          anything: <b>you</b> bring the fetch function. What it gives you is an{" "}
          <b>async state manager</b>, a cache for server state.
        </P>
      </section>

      <section>
        <H2>Client state vs server state</H2>
        <Table>
          <THead>
            <TR>
              <TH />
              <TH>Client state</TH>
              <TH>Server state</TH>
            </TR>
          </THead>
          <TBody>
            {STATE_COMPARISON.map(([label, client, server]) => (
              <TR key={label}>
                <TD className="font-semibold">{label}</TD>
                <TD>{client}</TD>
                <TD>{server}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </section>

      <section>
        <H2>useEffect vs useQuery</H2>
        <CodeBlock
          language="tsx"
          filename="fetching todos"
          tabs={[
            { name: "useEffect", code: beforeCode },
            { name: "useQuery", code: afterCode },
          ]}
        />
      </section>

      <section>
        <H2>How to use this site</H2>
        <List>
          <li>
            Each demo has a <b>Preview</b> and a <b>Code</b> tab. The code tab
            shows the actual source file.
          </li>
          <li>
            The <b>network simulator</b> in the sidebar adds latency and random
            500 errors to every API call.
          </li>
          <li>
            The <b>request log</b> under each demo shows what actually hits the
            server. Open the TanStack Query Devtools (bottom right) to inspect
            the cache.
          </li>
          <li>
            The reset button reseeds the SQLite database and clears the cache.
          </li>
        </List>
      </section>

      <section>
        <H2>Agenda</H2>
        <ol className="list-decimal space-y-2 pl-6">
          {AGENDA.map(([title, href]) => (
            <li key={href}>
              <Link href={href} className="underline underline-offset-4">
                {title}
              </Link>
            </li>
          ))}
        </ol>
        <P className="text-muted-foreground mt-6">
          Examples use TanStack Query v5, Next.js App Router and Prisma with
          SQLite.{" "}
          <InlineCode>pnpm install && pnpm db:setup && pnpm dev</InlineCode> to
          run it locally.
        </P>
      </section>
    </div>
  );
}

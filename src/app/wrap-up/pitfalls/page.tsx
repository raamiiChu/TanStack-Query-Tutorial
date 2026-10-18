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

const PITFALLS = [
  {
    title: "Copying query data into useState",
    bad: `const { data } = useQuery(todoQueries.list());
const [todos, setTodos] = useState(data ?? []);
// todos never updates after a refetch`,
    good: `const { data: todos = [] } = useQuery(todoQueries.list());
// derive, don't copy. Use select for transformations`,
  },
  {
    title: "Missing variables in the query key",
    bad: `useQuery({
  queryKey: ["todos"],
  queryFn: () => fetchTodos(limit), // limit changes, key doesn't
});`,
    good: `useQuery({
  queryKey: ["todos", "list", { limit }],
  queryFn: () => fetchTodos(limit),
});
// @tanstack/eslint-plugin-query: exhaustive-deps catches this`,
  },
  {
    title: "Using TanStack Query for client state",
    bad: `useQuery({
  queryKey: ["sidebar-open"],
  queryFn: () => false,
});`,
    good: `const [isOpen, setIsOpen] = useState(false);
// or Zustand / Context for shared client state`,
  },
  {
    title: "queryFn that doesn't throw",
    bad: `queryFn: async () => {
  const res = await fetch("/api/todos");
  return res.json(); // 500 becomes "success" with an error body
}`,
    good: `queryFn: async () => {
  const res = await fetch("/api/todos");
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}`,
  },
  {
    title: "Creating the QueryClient inside a component",
    bad: `function App() {
  const queryClient = new QueryClient(); // new cache every render
  return <QueryClientProvider client={queryClient}>…`,
    good: `const queryClient = new QueryClient();
function App() {
  return <QueryClientProvider client={queryClient}>…
// or useState(() => new QueryClient())`,
  },
];

const V5_CHANGES = [
  ["cacheTime", "gcTime"],
  ["isLoading (no data yet)", "isPending"],
  ["keepPreviousData: true", "placeholderData: keepPreviousData"],
  ["useErrorBoundary", "throwOnError"],
  [
    "onSuccess / onError / onSettled on useQuery",
    "removed: use QueryCache callbacks or effects",
  ],
  [
    "useQuery(key, fn, options)",
    "useQuery({ queryKey, queryFn, ...options }) only",
  ],
  ["suspense: true", "useSuspenseQuery"],
  ["enabled: false for conditional queries", "still works, plus skipToken"],
];

const PitfallsPage = () => (
  <div className="space-y-12">
    <section>
      <H1>Common Pitfalls</H1>
      {PITFALLS.map(({ title, bad, good }) => (
        <div key={title} className="mb-10">
          <H2>{title}</H2>
          <CodeBlock
            language="tsx"
            filename={title}
            tabs={[
              { name: "❌ Don't", code: bad },
              { name: "✅ Do", code: good },
            ]}
          />
        </div>
      ))}
    </section>

    <section>
      <H2>Migrating from v4 to v5</H2>
      <P>
        Our product still runs v4. The concepts carry over, but these names
        changed:
      </P>
      <Table>
        <THead>
          <TR>
            <TH>v4</TH>
            <TH>v5</TH>
          </TR>
        </THead>
        <TBody>
          {V5_CHANGES.map(([before, after]) => (
            <TR key={before}>
              <TD>
                <InlineCode>{before}</InlineCode>
              </TD>
              <TD>
                <InlineCode>{after}</InlineCode>
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
      <P>
        v5 requires React 18+. The official codemod handles most of the renames.
      </P>
    </section>

    <section>
      <H2>Key takeaways</H2>
      <List>
        <li>TanStack Query is a server-state cache, not a fetching library.</li>
        <li>
          Query keys are dependencies: put every variable in them, and keep them
          in a factory.
        </li>
        <li>
          Tune staleTime per query. The default of 0 is the safest starting
          point, not the best one.
        </li>
        <li>
          After a mutation, invalidate by default and use setQueryData when the
          response is enough.
        </li>
        <li>
          Meaningful HTTP status codes and cursor pagination on the backend make
          the frontend simpler.
        </li>
      </List>
    </section>
  </div>
);

export default PitfallsPage;

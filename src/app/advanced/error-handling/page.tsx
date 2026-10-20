import PreviewSections, { type Section } from "@/components/preview-sections";
import { H1, H2, InlineCode, List, P } from "@/components/ui/typography";
import { readSource } from "@/lib/source";

import GlobalErrorDemo from "./_components/global-error-demo";
import RetryDemo from "./_components/retry-demo";

const sections: Section[] = [
  {
    name: "Retry strategy",
    Example: RetryDemo,
    files: [
      readSource("src/app/advanced/error-handling/_components/retry-demo.tsx", [
        "const { status, fetchStatus, failureCount, error } = useQuery({",
      ]),
      readSource("src/components/providers/query-provider.tsx", [
        {
          from: "retry: (failureCount, error) => {",
          to: "return failureCount < MAX_RETRIES",
        },
      ]),
    ],
    Description: () => (
      <>
        <H1>Error Handling</H1>
        <H2>Retry strategy</H2>
        <P>
          Queries retry <b>3 times</b> with exponential backoff by default
          (mutations don&apos;t retry). Retrying a 404 or 403 only delays the
          error, so the provider skips retries for 4xx responses:
        </P>
        <List>
          <li>
            The <InlineCode>queryFn</InlineCode> must <b>throw</b> on non-2xx.{" "}
            <InlineCode>fetch</InlineCode> doesn&apos;t, which is why we wrap it
            in <InlineCode>apiFetch</InlineCode>.
          </li>
          <li>
            <InlineCode>retry: (failureCount, error) =&gt; …</InlineCode>{" "}
            decides per error type.
          </li>
          <li>
            <b>For backend folks</b>: correct status codes directly change
            frontend behaviour. A validation error returned as 500 gets retried
            3 times.
          </li>
        </List>
      </>
    ),
  },
  {
    name: "Global error toasts with meta",
    Example: GlobalErrorDemo,
    files: [
      readSource(
        "src/app/advanced/error-handling/_components/global-error-demo.tsx",
        [
          'meta: { errorMessage: "Could not archive todo" }',
          'meta: { errorMessage: "Could not load report" }',
        ]
      ),
      readSource("src/components/providers/query-provider.tsx", [
        { from: "declare module", to: "mutationMeta" },
        { from: "queryCache: new QueryCache({", to: "defaultOptions" },
      ]),
    ],
    Description: () => (
      <>
        <H2>Global error handling</H2>
        <P>
          <InlineCode>onError</InlineCode> on <InlineCode>useQuery</InlineCode>{" "}
          was removed in v5 because it ran once <b>per component</b>. Handle
          errors once per query on the <InlineCode>QueryCache</InlineCode>{" "}
          instead, and use <InlineCode>meta</InlineCode> to opt in per query.
        </P>
        <List>
          <li>
            Toast in <InlineCode>QueryCache.onError</InlineCode> /{" "}
            <InlineCode>MutationCache.onError</InlineCode>
          </li>
          <li>
            Inline error UI with <InlineCode>error</InlineCode> /{" "}
            <InlineCode>isError</InlineCode>
          </li>
          <li>
            Error Boundary with <InlineCode>throwOnError: true</InlineCode> (or{" "}
            <InlineCode>useSuspenseQuery</InlineCode>)
          </li>
        </List>
      </>
    ),
  },
];

const ErrorHandlingPage = () => <PreviewSections sections={sections} />;

export default ErrorHandlingPage;

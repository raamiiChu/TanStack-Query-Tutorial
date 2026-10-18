import {
  AlertTriangle,
  ArrowDownToLine,
  BookOpenCheck,
  Database,
  GitFork,
  Home,
  KeyRound,
  Layers,
  ListOrdered,
  MousePointerClick,
  RefreshCw,
  Repeat,
  ShieldAlert,
  Timer,
  Zap,
} from "lucide-react";

type MenuItem = {
  title: string;
  url: string;
  Icon: React.ComponentType<{ className?: string }>;
  isBlank?: boolean;
};

type SideBarGroup = {
  groupLabel: string;
  menuItems: MenuItem[];
};

export const sideBarGroups: SideBarGroup[] = [
  {
    groupLabel: "Introduction",
    menuItems: [{ title: "What is TanStack Query?", url: "/", Icon: Home }],
  },
  {
    groupLabel: "Basics",
    menuItems: [
      { title: "Mental Model", url: "/basics/mental-model", Icon: Layers },
      {
        title: "Query Keys & Options",
        url: "/basics/query-options",
        Icon: KeyRound,
      },
    ],
  },
  {
    groupLabel: "Mutations",
    menuItems: [
      {
        title: "Updating the Cache",
        url: "/mutations/updating-the-cache",
        Icon: RefreshCw,
      },
      {
        title: "Optimistic Updates",
        url: "/mutations/optimistic-updates",
        Icon: Zap,
      },
    ],
  },
  {
    groupLabel: "Lists",
    menuItems: [
      { title: "Pagination", url: "/lists/pagination", Icon: ListOrdered },
      {
        title: "Infinite Query",
        url: "/lists/infinite-query",
        Icon: ArrowDownToLine,
      },
    ],
  },
  {
    groupLabel: "Advanced",
    menuItems: [
      {
        title: "Prefetching",
        url: "/advanced/prefetching",
        Icon: MousePointerClick,
      },
      {
        title: "Dependent & Parallel",
        url: "/advanced/dependent-and-parallel",
        Icon: GitFork,
      },
      { title: "Polling", url: "/advanced/polling", Icon: Timer },
      { title: "Suspense", url: "/advanced/suspense", Icon: Repeat },
      {
        title: "Error Handling",
        url: "/advanced/error-handling",
        Icon: ShieldAlert,
      },
    ],
  },
  {
    groupLabel: "Backend",
    menuItems: [
      {
        title: "Prisma & Route Handlers",
        url: "/backend/prisma",
        Icon: Database,
      },
    ],
  },
  {
    groupLabel: "Wrap-up",
    menuItems: [
      {
        title: "Common Pitfalls",
        url: "/wrap-up/pitfalls",
        Icon: AlertTriangle,
      },
      {
        title: "Resources",
        url: "https://tanstack.com/query/latest/docs/framework/react/overview",
        Icon: BookOpenCheck,
        isBlank: true,
      },
    ],
  },
];

"use client";

import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { clearRequestLog } from "@/lib/network-simulator";
import type { SourceFile } from "@/lib/source";

type PreviewTabWithCodeProps = {
  children: React.ReactNode;
  files: SourceFile[];
  name: string;
};

const PreviewTabWithCode = ({
  children,
  files,
  name,
}: PreviewTabWithCodeProps) => {
  const queryClient = useQueryClient();
  const [childKey, setChildKey] = useState(0);
  const [isResetting, setIsResetting] = useState(false);

  const resetDemo = async () => {
    setIsResetting(true);
    await fetch("/api/reset", { method: "POST" });
    queryClient.clear();
    clearRequestLog();
    setChildKey((prev) => prev + 1);
    setIsResetting(false);
  };

  return (
    <Tabs defaultValue="preview" className="mx-auto my-12 w-full md:w-[720px]">
      <TabsList className="mb-2 grid h-10 w-full grid-cols-2">
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>

      <TabsContent value="preview">
        <Card>
          <CardHeader className="flex items-center">
            <CardTitle>{name}</CardTitle>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={resetDemo}
                    disabled={isResetting}
                    className="ml-auto"
                  >
                    <RotateCcw className={isResetting ? "animate-spin" : ""} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset database, cache and request log</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardHeader>

          <CardContent
            key={childKey}
            className="relative h-[60dvh] w-full space-y-4 overflow-auto"
          >
            {children}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="code">
        {files.length === 1 ? (
          <CodeBlock
            language="tsx"
            filename={files[0].name}
            code={files[0].code}
            highlightLines={files[0].highlightLines}
          />
        ) : (
          <CodeBlock language="tsx" filename={name} tabs={files} />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default PreviewTabWithCode;

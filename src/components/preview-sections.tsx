import PreviewTabWithCode from "@/components/component/preview-tab-with-code";
import type { SourceFile } from "@/lib/source";

export type Section = {
  name: string;
  files: SourceFile[];
  Example: () => React.JSX.Element;
  Description: () => React.JSX.Element;
};

const PreviewSections = ({ sections }: { sections: Section[] }) => {
  return (
    <>
      {sections.map(({ name, files, Example, Description }) => (
        <section key={name}>
          <Description />
          <PreviewTabWithCode name={name} files={files}>
            <Example />
          </PreviewTabWithCode>
        </section>
      ))}
    </>
  );
};

export default PreviewSections;

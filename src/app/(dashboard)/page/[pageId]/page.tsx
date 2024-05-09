import { Editor } from "@/modules/editor";

interface PageProps {
  params: {
    pageId: string;
  };
}

const editorPage: React.FC<PageProps> = ({ params }) => {
  const { pageId } = params;
  return <Editor pageId={pageId} />;
};
export default editorPage;
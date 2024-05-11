import QuickNote from "@/modules/note/quickNote/QuickNote";

interface PageProps {
  params: {
    quickNoteId : string;
  };
}

const quickNotePage: React.FC<PageProps> = ({ params }) => {
  const { quickNoteId } = params;
  console.log("pageId", quickNoteId);
  return <QuickNote quickNoteId={quickNoteId} />;
};
export default quickNotePage;

import MainLayout from "@/app/(dashboard)/layout";
import QuickNote from "@/modules/note/quickNote/QuickNote";
import React from "react";

function QuickNotePage() {
  return (
    <>
      <div className="w-full h-full fixed">
        <QuickNote />
      </div>
    </>
  );
}
export default QuickNotePage;

import MainLayout from "@/app/(dashboard)/layout";
import { QuickNote } from "@/modules/note";
import React from "react";

function QuickNotePage() {
  return (
    <MainLayout>
      <QuickNote />
    </MainLayout>
  );
}
export default QuickNotePage;

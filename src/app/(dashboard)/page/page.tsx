"use client";

import { Button } from "@/components/ui/button";
import { useCreatePage } from "@/modules/editor/hooks/useCreatePage";
import { useCurrentUser } from "@/modules/hooks";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Image from "next/image";
import { useRouter } from "next/navigation";

const page = () => {
  const { user } = useCurrentUser();

  const router = useRouter();

  const { handleCreatePage } = useCreatePage();

  const handleClick = async () => {
    await handleCreatePage(
      {
        name: "Untitled",
        document: "",
      },
      (createdPage: any) =>
        createdPage?.data && router.push(`/page/${createdPage?.data?._id}`)
    );
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-full">
        <Image
          src="/empty.png"
          height="300"
          width="300"
          alt="Empty"
          className="dark:hidden"
        />
        <Image
          src="/empty-dark.png"
          height="300"
          width="300"
          alt="Empty"
          className="hidden dark:block"
        />
        <h2 className="text-lg font-medium">
          Welcome to {user?.username}&apos;s JetBrain
        </h2>
        <Button
          className="mt-2 "
          variant="default"
          tabIndex={-1}
          onClick={handleClick}
        >
          <AddCircleOutlineIcon className="mr-2" /> Create Note
        </Button>
      </div>
    </>
  );
};

export default page;

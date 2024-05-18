"use client";

import { useSharePage } from "@/modules/editor";
import { useState } from "react";
import AsyncSelect from "react-select/async";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { useOrigin } from "@/hooks/use-origin";

const SharePage: React.FC<{ id: string; onClose: Function }> = ({
  id,
  onClose,
}) => {
  const {
    defaultOptions,
    initialValues,
    loadOptions,
    handleSharePage,
    isLoading,
  } = useSharePage(id);

  const [selectedUser, setSelectedUser] = useState(initialValues[0] || null);
  const origin = useOrigin();
  const url = `${origin}/previewNotification/${id}`;



  const handleOnSelect = (input: any) => {
    setSelectedUser(input);
  };

  const handleOnSubmit = () => {
    if (selectedUser) {
      handleSharePage(selectedUser.value, url);
    }
  };

  return (
    <div className="w-96 flex flex-col gap-4 justify-center">
      <Label>Share Page</Label>
      <AsyncSelect
        cacheOptions
        defaultValue={selectedUser}
        onChange={handleOnSelect}
        defaultOptions={defaultOptions}
        loadOptions={loadOptions}
      />
      <Button
        onClick={handleOnSubmit}
        className="dark:bg-black dark:text-white"
        disabled={isLoading}
      >
        Share
      </Button>
    </div>
  );
};

export default SharePage;

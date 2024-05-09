import { useSharePage } from "@/modules/editor";
import { useState } from "react";
import AsyncSelect from "react-select/async";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

const SharePage: React.FC<{ id: string, onClose: Function }> = ({id, onClose}) => {
  const {
    defaultOptions,
    initialValues,
    loadOptions,
    handleSharePage,
    isLoading,
  } = useSharePage(id);

  const [selectedUsers, setSelectedUsers] = useState(initialValues);

  const handleOnSelect = (inputs: any) => {
    setSelectedUsers(inputs);
  };

  const handleOnSubmit = () => {
    handleSharePage(selectedUsers.map((d) => d.value), onClose);
  };

  return (
    <div className="w-96 flex flex-col gap-4 justify-center">
      <Label>Share Page</Label>
      <AsyncSelect
        isMulti
        cacheOptions
        defaultValue={selectedUsers}
        onChange={handleOnSelect}
        defaultOptions={defaultOptions}
        loadOptions={loadOptions}
      />
      <Button onClick={handleOnSubmit} disabled={isLoading}>
        Share
      </Button>
    </div>
  );
};

export default SharePage;

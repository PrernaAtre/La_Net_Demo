import AsyncSelect from "react-select/async";
import { useUsers } from "../user/hooks/useUsers";

const SharePage = () => {
  const { users, loadUserOptions } = useUsers();

  const filterUsers = (inputValue: string) => {
    return (users || [])
      .filter((user: any) => user.username != inputValue)
      .map((user: any) => ({
        value: user._id,
        label: `${user.username} (${user.email})`,
      }));
  };

  const promiseOptions = (inputValue: string) => {
    return new Promise<any[]>((resolve) => {
      setTimeout(() => {
        resolve(filterUsers(inputValue));
      }, 1000);
    });
  };

  return (
    <div className="w-96">
      <AsyncSelect
        isMulti
        cacheOptions
        defaultOptions
        loadOptions={promiseOptions}
      />
    </div>
  );
};

export default SharePage;

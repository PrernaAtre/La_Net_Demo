import AuthToken from "@/lib/AuthToken";

export const useLogout = () => {
  const logout = async () => {
    AuthToken.remove();

    // TODO: Redirect to home page

    // TODO: Reset redux store if needed
  };

  return {
    logout,
  };
};

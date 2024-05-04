import { useSelector } from "react-redux"

export const useAuthenticated = () => {
    const isAuthenticated = useSelector(
        (state: any) => state.auth.isAuthenticated
      );
  return {
    isAuthenticated
  }
}
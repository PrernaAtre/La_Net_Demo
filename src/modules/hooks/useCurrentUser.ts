import { useSelector } from "react-redux"

export const useCurrentUser = () => {
  const user = useSelector((state: any) => state.auth.currentUser)

  return {
    user: user
  }
}
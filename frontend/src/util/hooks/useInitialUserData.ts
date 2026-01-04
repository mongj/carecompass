import { useAuthStore } from "@/stores/auth";
import { UserData } from "@/types/user";
import { useEffect, useState } from "react";

type UserDataSelector<T> = (userData: UserData) => T;

function useInitialUserData<T>(selector: UserDataSelector<T>) {
  const userData = useAuthStore((state) => state.userData);
  const [data, setData] = useState<T>();

  useEffect(() => {
    if (userData) {
      setData(selector(userData));
    }
  }, [userData]);

  return [data, setData] as const;
}

export default useInitialUserData;

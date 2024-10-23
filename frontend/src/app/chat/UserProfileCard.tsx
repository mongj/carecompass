import { useAuthStore } from "@/stores/auth";
import { UserButton } from "@clerk/nextjs";

export default function UserProfileCard() {
  const user = useAuthStore(state => state.currentUser);
  return <div className="flex gap-4 place-items-center">
    <UserButton />
    <div>
      {user.fullName}
    </div>
  </div>
}
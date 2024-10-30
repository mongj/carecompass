import { useAuthStore } from "@/stores/auth";
import { UserButton } from "@clerk/nextjs";

export default function UserProfileCard() {
  const user = useAuthStore((state) => state.currentUser);
  return (
    <div className="flex place-items-center gap-4">
      <UserButton />
      <div>{user.fullName}</div>
    </div>
  );
}

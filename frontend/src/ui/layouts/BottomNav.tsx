import { usePathname, useRouter } from "next/navigation";

import { UserCircleIcon, HomeIcon, MessageCircleIcon } from "lucide-react";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <section className="relative grid h-16 max-h-16 min-h-16 w-full grid-cols-3 place-content-center place-items-center border-t border-gray-200 shadow-[0px_0px_4px_-1px_rgba(0,0,0,0.1)]">
      <button
        aria-label="Home"
        className="mx-2 flex flex-col place-content-center place-items-center"
        onClick={() => router.push("/home")}
      >
        <HomeIcon
          className={`${pathname.includes("/home") ? "text-brand-primary-500" : ""}`}
        />
        <span
          className={`text-xs font-semibold ${pathname.includes("/home") ? "text-brand-primary-500" : ""}`}
        >
          Home
        </span>
      </button>
      <div className="self-end text-xs font-semibold">Ask Anything</div>
      <button
        aria-label="Profile"
        className="mx-2 flex flex-col place-content-center place-items-center"
        onClick={() => router.push("/profile")}
      >
        <UserCircleIcon
          className={`${pathname.includes("/profile") ? "text-brand-primary-500" : ""}`}
        />
        <span
          className={`text-xs font-semibold ${pathname.includes("/profile") ? "text-brand-primary-500" : ""}`}
        >
          Profile
        </span>
      </button>
      <div className="absolute bottom-7 flex h-20 w-20 place-content-center place-items-center rounded-full border border-gray-200 bg-white shadow-[0px_-4px_12px_0px_rgba(0,0,0,0.1)]">
        <button className="flex h-16 w-16 place-content-center place-items-center rounded-full bg-brand-primary-500">
          <MessageCircleIcon color="white" size={32} />
        </button>
      </div>
    </section>
  );
}

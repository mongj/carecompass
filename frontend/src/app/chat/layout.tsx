"use client";

import Image from "next/image";
import { AddIcon } from "@chakra-ui/icons";
import Search from "@/ui/Search";
import { redirect, useParams, useRouter } from "next/navigation";
import { ChatContext } from "./context";
import { useLayoutEffect, useRef, useState } from "react";
import ChatHistory from "@/ui/ChatHistory";
import { Thread } from "@/types/chat";
import { useDisclosure, Drawer, DrawerOverlay, DrawerContent, Divider } from "@chakra-ui/react";

import { Button, IconButton } from "@opengovsg/design-system-react";
import { ArrowRight, LogOutIcon, MenuIcon, SquarePenIcon } from "lucide-react";
import { SignOutButton, useAuth, useUser } from "@clerk/nextjs";
import UserProfileCard from "./UserProfileCard";
import LoadingSpinner from "@/ui/loading";
import { useAuthStore } from "@/stores/auth";

export default function ChatLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  const auth = useAuth();
  const { user } = useUser()
  const router = useRouter();
  const params = useParams<{ chatId: string }>();
  const [chats, setChats] = useState<Thread[]>([]);

  // useLayoutEffect(() => {
  //   if(!auth.isSignedIn){
  //     redirect("/")
  //   }
  // }, [auth.isSignedIn])

  useLayoutEffect(() => {
    const userId = typeof window !== "undefined" ? window.localStorage.getItem('cc-userId') : null;
    if(!userId){
      redirect("/")
    }
  }, [])
  
  function handleNewThread() {
    router.replace(`/chat`);
  }

  // if (!user) {
  //   return (
  //     <main className="flex w-full h-full place-content-center place-items-center">
  //       <LoadingSpinner />
  //     </main>
  //   );
  // }

  // useAuthStore.setState((state) => {
  //   return {
  //     ...state,
  //     currentUser: user,
  //   };
  // })

  return (
    <ChatContext.Provider value={{ chats, setChats }}>
      <div className="flex flex-col md:flex-row h-dvh max-h-dvh">
        <section className="hidden md:block w-64 min-w-64 bg-white bg-cover px-4 py-8 shadow-md">
          <div className="flex flex-col place-items-center gap-8">
            <Image src="/img/logo.svg" alt="Logo" width={64} height={64} />
            <button className="flex place-items-center gap-2 rounded-full border border-gray-100 bg-white px-4 py-2 text-black duration-200 ease-in-out hover:bg-gray-200" onClick={handleNewThread}>
              <AddIcon />
              <span>New thread</span>
            </button>
            <ChatHistory router={router} />
          </div>
        </section>
        <header className="md:hidden flex place-content-between place-items-center px-4 w-full h-16 bg-brand-primary-500 text-white">
          <LeftDrawer />
          <Button
            colorScheme="white"
            variant="clear"
            aria-label="Support Dashboard"
            rightIcon={<ArrowRight size={16} />}
            size="sm"
            className="font-semibold"
            onClick={() => {
              router.push(`/dashboard`);
            }}>
              My support dashboard
            </Button>
          <IconButton colorScheme="white" variant="clear" aria-label="New thread button" icon={<SquarePenIcon />} size="sm" onClick={handleNewThread} />
        </header>
        <main className="h-full overflow-hidden flex w-full flex-col place-content-between px-6 md:p-8 bg-gray-100">
          <section className="flex h-full w-full place-content-center place-items-center">
            {children}
          </section>
          <section className="w-full">
            <Search currentChatId={params.chatId} />
          </section>
        </main>
      </div>
    </ChatContext.Provider>
  );
}

function LeftDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef(null)
  const router = useRouter();

  return (
    <>
      <IconButton ref={btnRef} colorScheme="white" variant="clear" onClick={onOpen} aria-label="Menu button" icon={<MenuIcon />}>
        Open
      </IconButton>
      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent className="flex flex-col p-6 gap-4">
          <UserProfileCard />
          <Divider />
          <ChatHistory router={router} onClose={onClose} />
          <Divider />
          <Button className="w-full" variant="solid" rightIcon={<LogOutIcon />} onClick={() => {
            window.localStorage.removeItem('cc-userId');
            router.push("/");
          }}>Log out</Button>
          {/* <SignOutButton>
            <Button className="w-full" variant="solid" rightIcon={<LogOutIcon />}>Log out</Button>
          </SignOutButton> */}
        </DrawerContent>
      </Drawer>
    </>
  )
}
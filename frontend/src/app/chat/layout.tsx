/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Image from "next/image";
import { AddIcon } from "@chakra-ui/icons";
import Search from "@/ui/Search";
import { redirect, useParams, useRouter } from "next/navigation";
import { ChatContext } from "./context";
import { useLayoutEffect, useRef, useState } from "react";
import ChatHistory from "@/ui/ChatHistory";
import { Thread } from "@/types/chat";
import {
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  Divider,
} from "@chakra-ui/react";

import { Button, IconButton } from "@opengovsg/design-system-react";
import { ArrowRight, LogOutIcon, MenuIcon, SquarePenIcon } from "lucide-react";
import UserProfileCard from "./UserProfileCard";
import getUserId from "@/util/getUserId";
import { SignInButton, SignOutButton, useAuth } from "@clerk/nextjs";
import LoadingSpinner from "@/ui/loading";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const params = useParams<{ chatId: string }>();
  const [chats, setChats] = useState<Thread[]>([]);

  const userId = getUserId();

  useLayoutEffect(() => {
    if (!userId) {
      redirect("/");
    }
  }, [userId]);

  function handleNewThread() {
    router.replace(`/chat`);
  }

  if (!userId) {
    return (
      <main className="flex h-full w-full place-content-center place-items-center">
        <LoadingSpinner />
      </main>
    );
  }

  return (
    <ChatContext.Provider value={{ chats, setChats }}>
      <div className="flex h-dvh max-h-dvh flex-col md:flex-row">
        {/* <section className="hidden w-64 min-w-64 bg-white bg-cover px-4 py-8 shadow-md md:block">
          <div className="flex flex-col place-items-center gap-8">
            <Image src="/img/logo.svg" alt="Logo" width={64} height={64} />
            <button
              className="flex place-items-center gap-2 rounded-full border border-gray-100 bg-white px-4 py-2 text-black duration-200 ease-in-out hover:bg-gray-200"
              onClick={handleNewThread}
            >
              <AddIcon />
              <span>New thread</span>
            </button>
            <ChatHistory router={router} />
          </div>
        </section>
        <header className="flex h-16 w-full place-content-between place-items-center bg-brand-primary-500 px-4 text-white md:hidden">
          <LeftDrawer />
          <Button
            colorScheme="white"
            variant="clear"
            aria-label="Support Dashboard"
            rightIcon={<ArrowRight size={16} />}
            className="font-semibold"
            onClick={() => {
              router.push(`/dashboard`);
            }}
          >
            My support dashboard
          </Button>
          <IconButton
            colorScheme="white"
            variant="clear"
            aria-label="New thread button"
            icon={<SquarePenIcon />}
            size="sm"
            onClick={handleNewThread}
          />
        </header> */}
        <main className="flex h-full w-full flex-col place-content-between overflow-hidden bg-gray-100 px-6 md:p-8">
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);
  const router = useRouter();
  const auth = useAuth();

  return (
    <>
      <IconButton
        ref={btnRef}
        colorScheme="white"
        variant="clear"
        onClick={onOpen}
        aria-label="Menu button"
        icon={<MenuIcon />}
      >
        Open
      </IconButton>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent className="flex flex-col gap-4 p-6">
          {auth.isSignedIn && (
            <>
              <UserProfileCard />
              <Divider />
            </>
          )}
          <ChatHistory router={router} onClose={onClose} />
          <Divider />
          {auth.isSignedIn ? (
            <SignOutButton>
              <Button
                className="w-full"
                variant="solid"
                rightIcon={<LogOutIcon />}
              >
                Log out
              </Button>
            </SignOutButton>
          ) : (
            <SignInButton>
              <Button
                className="w-full"
                onClick={() => {
                  window.localStorage.removeItem("cc-userId");
                }}
              >
                Sign In
              </Button>
            </SignInButton>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}

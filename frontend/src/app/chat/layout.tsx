"use client";

import Image from "next/image";
import { AddIcon } from "@chakra-ui/icons";
import Search from "@/ui/Search";
import { redirect, useParams, useRouter } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import ChatHistory from "@/ui/ChatHistory";
import {
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
} from "@chakra-ui/react";

import { Button, IconButton } from "@opengovsg/design-system-react";
import { MenuIcon, SquarePenIcon } from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import LoadingSpinner from "@/ui/loading";
import BottomNav from "@/ui/layouts/BottomNav";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const params = useParams<{ chatId: string }>();

  const userId = useAuthStore((s) => s.userId);

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
    <div className="flex h-dvh max-h-dvh flex-col md:flex-row">
      <section className="hidden w-64 min-w-64 bg-white bg-cover px-4 py-8 shadow-md md:block">
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
          rightIcon={<SquarePenIcon />}
          size="sm"
          onClick={handleNewThread}
        >
          New Chat
        </Button>
      </header>
      <main className="flex h-full w-full flex-col place-content-between overflow-hidden bg-gray-100 px-6 pt-6 md:p-8">
        <section className="flex h-full w-full place-content-center place-items-center">
          {children}
        </section>
        <section className="w-full">
          <Search currentChatId={params.chatId} />
        </section>
      </main>
      <BottomNav />
    </div>
  );
}

function LeftDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);
  const router = useRouter();

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
          <ChatHistory router={router} onClose={onClose} />
        </DrawerContent>
      </Drawer>
    </>
  );
}

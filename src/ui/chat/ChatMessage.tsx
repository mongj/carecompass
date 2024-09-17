import { Message } from "@/types/chat";
import { Avatar } from "@chakra-ui/react";

export default function ChatMessage({ message }: { message: Message }) {
  return (
    <div className="flex place-items-center gap-4">
      <Avatar name={message.role} />
      <div className="w-full flex flex-col gap-2 bg-white p-4 border rounded-lg">
        <div>{message.content}</div>
      </div>
    </div>
  );
}
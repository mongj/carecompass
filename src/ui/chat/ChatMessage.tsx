import { BotResponse, Message } from "@/types/chat";
import { Avatar, Button, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { Modal } from "@chakra-ui/react";

export default function ChatMessage({ message }: { message: Message }) {
  return (
    <div className="flex place-items-start gap-4">
      {
        message.role === "bot" ? 
          <Avatar className="mt-2" src="/img/logo.svg" /> : 
          <Avatar className="mt-2" colorScheme="sub" />
      }
      <div className="w-[calc(100%-56px)] flex flex-col bg-white p-4 border rounded-lg">
        {typeof message.content === 'string' ? 
          <span>{message.content}</span>
          : <ResponseMessage res={message.content} />
        }
      </div>
    </div>
  );
}

function ResponseMessage({ res }: { res: BotResponse }) {
  return (
    <div className="flex flex-col gap-4">
      {res.content && res.content.map((block) => {
        if (!block.content) {
          return null;
        }
        if (block.type === "text") {
          return <span>{block.content}</span>
        } else {
          return (
            <div className="flex gap-2 overflow-auto">
              {block.content.map((uiBlock) => (
                <ClickableCard header={uiBlock.header} content={uiBlock.content} />
              ))}
            </div>);
        }
      })}
    </div>
  )
}

function ClickableCard({ header, content }: { header: string, content?: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <div onClick={onOpen} className="flex flex-col gap-2 bg-white border rounded-md p-4 max-h-80 min-w-72 shadow-sm cursor-pointer hover:bg-gray-100 ease-in duration-100">
        <h3 className="font-semibold text-lg leading-tight">{header}</h3>
        <span className="text-gray-600 text-sm overflow-hidden text-ellipsis">{content}</span>
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent className="flex flex-col gap-4 p-8">
          <h3 className="font-semibold text-2xl leading-tight">{header}</h3>
          <span className="text-gray-600 text-sm overflow-hidden text-ellipsis">{content}</span>
          <div className="flex place-content-end">
            <Button colorScheme='blue' onClick={onClose}>
              Close
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </>
  )
}
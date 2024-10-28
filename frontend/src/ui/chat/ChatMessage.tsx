import { BotResponse, BotResponseComponentID, BotResponseType, Message, MessageRole } from "@/types/chat";
import { Avatar } from "@chakra-ui/react";
import { Button, BxRightArrowAlt } from "@opengovsg/design-system-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { parse } from "partial-json";
import { Drawer } from 'vaul';
import CareServiceRecommender from "../drawer/careservice";
import { usePathname, useRouter } from "next/navigation";

export default function ChatMessage({ message }: { message: Message }) {
  return (
    <div className="flex place-items-start gap-2 md:gap-4">
      {
        message.role === MessageRole.User ? 
          <Avatar className="mt-2 sticky" colorScheme="sub" size="xs" /> :
          <Avatar className="mt-2 sticky" src="/img/logo.svg" size="xs" />
      }
      <div className="w-[calc(100%-40px)] md:w-[calc(100%-48px)] flex flex-col bg-white p-4 border rounded-lg">
        {message.role === MessageRole.User ? 
          <UserMessage content={message.content} /> :
          <AssistantMessage content={message.content} />
        }
      </div>
    </div>
  );
}

function UserMessage({ content }: { content: string }) {
  return (
    <div className="flex flex-col gap-0 p-0 m-0">
      <Markdown remarkPlugins={[remarkGfm]} className="prose prose-sm leading-tight">{content}</Markdown>
    </div>
  );
}

function AssistantMessage({ content }: { content: string }) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Parse the JSON string into a BotResponse object
  content = content.replaceAll(/\\"/g, '\"');
  const parsedContent: BotResponse = parse(content);

  if (!parsedContent.output) {
    return <></>;
  }
  
  return (
    <div className="flex flex-col gap-4 p-0 m-0">
      {parsedContent.output.map((response, index) => {
        if (!response.content) {
          return <></>;
        }

        response.content = response.content.replaceAll(/\\n/g, '\n');

        if (response.type === BotResponseType.Markdown) {
          return <Markdown key={index} remarkPlugins={[remarkGfm]} className="prose prose-sm leading-tight">{response.content}</Markdown>
        } else if (response.type === BotResponseType.Button) {
          if (response.id === BotResponseComponentID.CareserviceRecommender) {
            return <WorkflowTrigger key={index} WorkflowComponent={CareServiceRecommender} triggerText={response.content} />
          } else if (response.id === BotResponseComponentID.DaycareRecommender) {
            router.push(`${pathname}?step=1`);
            return <WorkflowTrigger key={index} WorkflowComponent={CareServiceRecommender} triggerText={response.content} />;
          } else if (response.id === BotResponseComponentID.SchemesRecommender) {
            return (
              <Button
                key={index}
                size="sm"
                rightIcon={<BxRightArrowAlt />}
                variant="outline"
                paddingY={6}
                onClick={() => router.push('/dashboard')}
              >
                {response.content}
              </Button>);
          } else {
            return <></>;
          }
        }
      })}
    </div>
  )
}

function WorkflowTrigger({ WorkflowComponent, triggerText }: { WorkflowComponent: React.ComponentType, triggerText: string }) {
  return (
    <Drawer.Root shouldScaleBackground>
    <Drawer.Trigger asChild>
    <Button
      size="sm"
      rightIcon={<BxRightArrowAlt />}
      variant="outline"
      paddingY={6}
    >
      {triggerText}
    </Button>
    </Drawer.Trigger>
    <Drawer.Overlay className="fixed inset-0 bg-black/40" />
    <Drawer.Portal>
      <Drawer.Content className="fixed flex flex-col bg-white border border-gray-200 border-b-none rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-[100dvh] mx-[-1px]">
        <Drawer.Handle className='my-4'/>
        <WorkflowComponent/>
      </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>
  );
}


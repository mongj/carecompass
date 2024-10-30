import { useChatQuery } from "@/util/hooks/useChatQuery";
import { SearchIcon } from "@chakra-ui/icons";
import { IconButton, Input } from "@opengovsg/design-system-react";

export default function Search({ currentChatId }: { currentChatId?: string }) {
  const { prompt, isSending, handleInput, handleSubmitPrompt } =
    useChatQuery(currentChatId);

  return (
    <form className="my-6 flex w-full gap-2" onSubmit={handleSubmitPrompt}>
      <Input
        placeholder="Message"
        value={prompt}
        onChange={handleInput}
        disabled={isSending}
      />
      <IconButton
        icon={<SearchIcon />}
        aria-label={"Search"}
        type="submit"
        isLoading={isSending}
        isDisabled={prompt.trim().length === 0}
      />
    </form>
  );
}

import { SearchIcon } from "@chakra-ui/icons";
import { IconButton, Input } from "@opengovsg/design-system-react";

export default function Search() {
  return (
    <form className="flex gap-4">
      <Input placeholder="Ask me something" />
      <IconButton icon={<SearchIcon />} aria-label={"Search"} />
    </form>
  );
}

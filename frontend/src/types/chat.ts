export interface Thread {
  id: string;
  title: string;
  messages: Message[];
}

export interface Message {
  id: string;
  role: "user" | "bot";
  content: string | BotResponse;
}

export type BotResponse = {
  content: (BotResponseText | BotResponseUI)[],
}

export type BotResponseText = {
  type: "text",
  content: string,
}

export type BotResponseUI = {
  type: "ui",
  content: {
    header: string,
    content?: string,
  }[]
}
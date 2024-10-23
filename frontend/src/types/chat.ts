export type GetUserThreadResponse = {
  thread_id: string;
  title: string;
}

export type Thread = {
  id: string;
  title?: string;
  messages: Message[];
}

export type Message = {
  id: string;
  role: "user" | "assistant";
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

export type CreateThreadResponse = {
  thread_id: string
}
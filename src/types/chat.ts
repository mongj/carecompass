export interface Thread {
  id: string;
  title: string;
  messages: Message[];
}

export interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
}
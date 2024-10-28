export type GetUserThreadResponse = {
  thread_id: string;
  title: string;
}

export type Thread = {
  id: string;
  title?: string;
  messages: Message[];
}

export enum MessageRole {
  User = "user",
  Assistant = "assistant",
}

export type Message = {
  id: string;
  role: MessageRole;
  content: string;
}

export type BotResponse = {
  output: (BotResponseMarkdown | BotResponseUI)[],
}

export enum BotResponseType {
  Markdown = "markdown",
  Button = "button",
}

export type BotResponseMarkdown = {
  type: BotResponseType.Markdown,
  content: string,
}

export enum BotResponseComponentID {
  CareserviceRecommender = "careservice-recommender",
  DaycareRecommender = "daycare-recommender",
  SchemesRecommender = "schemes-recommender",
}

export type BotResponseUI = {
  type: BotResponseType.Button,
  id: BotResponseComponentID,
  content: string,
}


export type CreateThreadResponse = {
  thread_id: string
}
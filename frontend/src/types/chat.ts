export type GetUserThreadResponse = {
  thread_id: string;
  title: string;
};

export type Thread = {
  id: string;
  title?: string;
  messages: Message[];
};

export enum MessageRole {
  User = "user",
  Assistant = "assistant",
}

export type Message = {
  id: string;
  role: MessageRole;
  content: string;
};

export type BotResponse = {
  output: (
    | BotResponseMarkdown
    | BotResponsePromptUI
    | BotResponseButtonUI
    | BotResponseCardUI
  )[];
};

export enum BotResponseType {
  Markdown = "markdown",
  Prompt = "prompt",
  Button = "button",
  Card = "card",
}

export type BotResponseMarkdown = {
  type: BotResponseType.Markdown;
  content: string;
};

export type BotResponsePromptUI = {
  type: BotResponseType.Prompt;
  content: string;
};

export enum BotResponseComponentID {
  CareserviceRecommender = "careservice-recommender",
  DaycareRecommender = "daycare-recommender",
  SchemesRecommender = "schemes-recommender",
  TrainingRecommender = "training-recommender",
}

export type BotResponseButtonUI = {
  type: BotResponseType.Button;
  id: BotResponseComponentID;
  content: string;
};

export enum BotResponseCardAction {
  Link = "link",
  Web = "web",
  Phone = "phone",
}

export type BotResponseCardUI = {
  type: BotResponseType.Card;
  header: string;
  content: string;
  action: string;
};

export type CreateThreadResponse = {
  thread_id: string;
};

// SignalR wire contract for the `ReceiveMessage` hub event.
// Kept here (not imported from domain/) so core/ stays dependency-free per the
// layer rules. It mirrors the backend payload shape and is structurally
// compatible with domain/message/message.model.ts, which lets the feature
// store route hub messages into the shared MessageStore without a cross-layer
// import.
export interface ChatHubMessage {
  id: string;
  chatId: string;
  text: string;
  senderId: string;
  createdAtUtc: string;
}
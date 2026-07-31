/**
 * Structured hub-failure payload emitted on `ChatHubService.errors$` so the
 * feature layer can surface failures to the UI instead of dropping them.
 * `operation` identifies which hub action failed; `chatId` is set when the
 * action was chat-scoped (join/leave/sendMessage).
 */
export type HubOperation =
  | 'start'
  | 'stop'
  | 'join'
  | 'leave'
  | 'sendMessage'
  | 'reconnect';

export interface HubError {
  operation: HubOperation;
  message: string;
  error?: Error;
  chatId?: string;
  timestamp: number;
}
import { Component, output } from '@angular/core';
import { NewChat } from '../../features/new-chat/new-chat';
import { ChatList } from '../../features/chat-list/chat-list';

@Component({
  selector: 'app-left-sidebar',
  imports: [NewChat, ChatList],
  templateUrl: './left-sidebar.html',
  host: { class: 'block w-[260px] border-r border-gray-300 box-border' },
})
export class LeftSidebar {
  readonly createChat = output<string>();
}
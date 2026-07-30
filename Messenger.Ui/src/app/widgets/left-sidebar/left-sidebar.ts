import { Component } from '@angular/core';
import { NewChat } from '../../features/new-chat/new-chat';
import { ContactList } from '../../features/contact-list/contact-list';

@Component({
  selector: 'app-left-sidebar',
  imports: [NewChat, ContactList],
  templateUrl: './left-sidebar.html',
  host: { class: 'block w-[260px] border-r border-gray-300 box-border' },
})
export class LeftSidebar {}
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LeftSidebar } from '../../widgets/left-sidebar/left-sidebar';

@Component({
  selector: 'app-chat-page',
  imports: [RouterOutlet, LeftSidebar],
  templateUrl: './chat-page.html',
  host: { class: 'block h-full' },
})
export class ChatPage {}
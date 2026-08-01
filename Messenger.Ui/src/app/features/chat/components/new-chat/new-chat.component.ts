import { Component, output } from '@angular/core';

@Component({
  selector: 'app-new-chat',
  templateUrl: './new-chat.component.html',
})
export class NewChatComponent {
  readonly navigate = output<void>();

  onNavigate(): void {
    this.navigate.emit();
  }
}
import { Component, output } from '@angular/core';

@Component({
  selector: 'app-new-chat',
  templateUrl: './new-chat.html',
})
export class NewChat {
  readonly create = output<string>();

  onCreate(): void {
    const name = window.prompt('Enter chat name');
    if (name?.trim()) {
      this.create.emit(name.trim());
    }
  }
}
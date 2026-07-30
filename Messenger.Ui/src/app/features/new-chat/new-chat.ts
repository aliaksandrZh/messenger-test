import { Component, output } from '@angular/core';

@Component({
  selector: 'app-new-chat',
  templateUrl: './new-chat.html',
})
export class NewChat {
  readonly create = output<void>();
}
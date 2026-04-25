import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  private readonly messageService = inject(MessageService);

  success(message: string) {
    this.messageService.add({
      summary: 'FreshCart',
      severity: 'success',
      detail: message,
      life: 5000,
    });
  }
  error(message: string) {
    this.messageService.add({
      summary: 'FreshCart',
      severity: 'error',
      detail: message,
      life: 5000,
    });
  }
  warning(message: string) {
    this.messageService.add({
      summary: 'FreshCart',
      severity: 'warn',
      detail: message,
      life: 5000,
    });
  }
}

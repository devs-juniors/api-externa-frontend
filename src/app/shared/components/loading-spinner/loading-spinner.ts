import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="spinner-container" role="status" aria-label="Carregando...">
      <div class="spinner"></div>
    </div>
  `,
  styleUrl: './loading-spinner.css',
})
export class LoadingSpinnerComponent {}

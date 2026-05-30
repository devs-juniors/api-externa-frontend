import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

@Component({
  selector: 'app-breadcrumb',
  imports: [RouterLink],
  template: `
    <nav class="breadcrumb" aria-label="Caminho de navegação">
      @for (item of items(); track item.label; let last = $last) {
        @if (item.url && !last) {
          <a class="breadcrumb-link" [routerLink]="item.url">{{ item.label }}</a>
        } @else {
          <span class="breadcrumb-current">{{ item.label }}</span>
        }
        @if (!last) {
          <span class="breadcrumb-sep" aria-hidden="true">/</span>
        }
      }
    </nav>
  `,
  styleUrl: './breadcrumb.css',
})
export class BreadcrumbComponent {
  items = input<BreadcrumbItem[]>([]);
}

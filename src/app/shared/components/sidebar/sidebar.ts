import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  icon: string;
  label: string;
  route: string;
  exact?: boolean;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {
  readonly navItems: NavItem[] = [
    { icon: '🏠', label: 'Início', route: '/dashboard', exact: true },
    { icon: '🏢', label: 'Corretoras', route: '/corretoras' },
    { icon: '📈', label: 'Ações', route: '/acoes' },
    { icon: '💼', label: 'Carteiras', route: '/carteiras' },
    { icon: '📋', label: 'Operações', route: '/operacoes' },
  ];
}

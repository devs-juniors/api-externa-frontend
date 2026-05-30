import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  // Dashboard
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then((m) => m.DashboardComponent),
  },

  // Corretoras
  {
    path: 'corretoras',
    loadComponent: () =>
      import('./pages/corretoras/corretora-list/corretora-list').then(
        (m) => m.CorretoraListComponent,
      ),
  },
  {
    path: 'corretoras/nova',
    loadComponent: () =>
      import('./pages/corretoras/corretora-form/corretora-form').then(
        (m) => m.CorretoraFormComponent,
      ),
  },
  {
    path: 'corretoras/:id',
    loadComponent: () =>
      import('./pages/corretoras/corretora-detail/corretora-detail').then(
        (m) => m.CorretoraDetailComponent,
      ),
  },

  // Ações
  {
    path: 'acoes',
    loadComponent: () =>
      import('./pages/acoes/acao-list/acao-list').then((m) => m.AcaoListComponent),
  },
  {
    path: 'acoes/nova',
    loadComponent: () =>
      import('./pages/acoes/acao-form/acao-form').then((m) => m.AcaoFormComponent),
  },

  // Carteiras
  {
    path: 'carteiras',
    loadComponent: () =>
      import('./pages/carteiras/carteira-list/carteira-list').then(
        (m) => m.CarteiraListComponent,
      ),
  },
  {
    path: 'carteiras/nova',
    loadComponent: () =>
      import('./pages/carteiras/carteira-form/carteira-form').then(
        (m) => m.CarteiraFormComponent,
      ),
  },
  {
    path: 'carteiras/:id',
    loadComponent: () =>
      import('./pages/carteiras/carteira-detail/carteira-detail').then(
        (m) => m.CarteiraDetailComponent,
      ),
  },

  // Operações
  {
    path: 'operacoes',
    loadComponent: () =>
      import('./pages/operacoes/operacao-list/operacao-list').then(
        (m) => m.OperacaoListComponent,
      ),
  },

  { path: '**', redirectTo: '/dashboard' },
];

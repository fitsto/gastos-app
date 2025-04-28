import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage),
    canActivate: [authGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage),
    canActivate: [noAuthGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage),
    canActivate: [noAuthGuard]
  },
  {
    path: 'history',
    loadComponent: () => import('./pages/history/history.page').then(m => m.HistoryPage),
    canActivate: [authGuard]
  },
  {
    path: 'categories',
    loadComponent: () => import('./pages/categories/categories.page').then(m => m.CategoriesPage),
    canActivate: [authGuard]
  },
  {
    path: 'edit-expense/:id',
    loadComponent: () => import('./pages/edit-expense/edit-expense.page').then(m => m.EditExpensePage),
    canActivate: [authGuard]
  },
  {
    path: 'add-transaction',
    loadComponent: () => import('./pages/add-transaction/add-transaction.page').then(m => m.AddTransactionPage),
    canActivate: [authGuard]
  },
  {
    path: 'edit-transaction/:id',
    loadComponent: () => import('./pages/edit-transaction/edit-transaction.page').then(m => m.EditTransactionPage),
    canActivate: [authGuard]
  }
];

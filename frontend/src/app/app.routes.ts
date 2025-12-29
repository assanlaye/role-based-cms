import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/auth/register/register').then(m => m.Register)
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'articles',
        loadComponent: () => import('./components/articles/article-list/article-list').then(m => m.ArticleList)
      },
      {
        path: 'articles/create',
        loadComponent: () => import('./components/articles/article-form/article-form').then(m => m.ArticleForm)
      },
      {
        path: 'articles/:id',
        loadComponent: () => import('./components/articles/article-list/article-list').then(m => m.ArticleList)
      },
      {
        path: 'articles/:id/edit',
        loadComponent: () => import('./components/articles/article-form/article-form').then(m => m.ArticleForm)
      },
      {
        path: 'library',
        loadComponent: () => import('./components/articles/article-list/article-list').then(m => m.ArticleList)
      },
      {
        path: 'users',
        loadComponent: () => import('./components/users/user-management/user-management').then(m => m.UserManagement)
      },
      {
        path: 'roles',
        loadComponent: () => import('./components/roles/role-management/role-management').then(m => m.RoleManagement)
      },
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

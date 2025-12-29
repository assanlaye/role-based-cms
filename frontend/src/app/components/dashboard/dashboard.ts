import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Sidebar } from '../shared/sidebar/sidebar';
import { Navbar } from '../shared/navbar/navbar';
import { ArticleService } from '../../services/article.service';
import { UserService } from '../../services/user';
import { AuthService } from '../../services/auth.service';
import { SidebarService } from '../../services/sidebar.service';
import { Article } from '../../models/article';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, Sidebar, Navbar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  totalArticles = 0;
  publishedArticles: Article[] = [];
  publishedArticlesCount = 0;
  totalUsers = 0;
  currentUser: any = null;
  sidebarOpen = true;

  // Viewer interface properties
  activeTab: 'home' | 'library' = 'home';
  subTab: 'for-you' | 'featured' = 'for-you';
  librarySubTab: 'saved' | 'history' = 'saved';
  allArticles: Article[] = [];
  menuOpenArticleId: string | null = null;

  constructor(
    private articleService: ArticleService,
    private userService: UserService,
    private authService: AuthService,
    private sidebarService: SidebarService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.sidebarService.sidebarOpen$.subscribe(open => {
      this.sidebarOpen = open;
    });

    // Handle query parameters for tab switching
    this.route.queryParams.subscribe(params => {
      if (params['tab'] === 'library') {
        this.activeTab = 'library';
      } else {
        this.activeTab = 'home';
      }
    });

    this.loadStats();
  }

  loadStats() {
    // Only load articles - this doesn't require special permissions
    this.articleService.getAllArticles().subscribe({
      next: (articles) => {
        this.allArticles = articles;
        this.totalArticles = articles.length;
        this.publishedArticles = articles.filter(a => a.isPublished);
        this.publishedArticlesCount = this.publishedArticles.length;
      },
      error: (err: any) => {
        console.error('Error loading articles:', err);
      }
    });

    // Only load users if current user has view permission
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.role && currentUser.role.permissions && currentUser.role.permissions.view) {
      this.userService.getAllUsers().subscribe({
        next: (users: any[]) => {
          this.totalUsers = users.length;
        },
        error: (err: any) => {
          console.error('Error loading users:', err);
          // Don't fail the whole dashboard if users can't be loaded
          this.totalUsers = 0;
        }
      });
    }
  }

  setActiveTab(tab: 'home' | 'library') {
    this.activeTab = tab;
  }

  setSubTab(tab: 'for-you' | 'featured') {
    this.subTab = tab;
  }

  setLibrarySubTab(tab: 'saved' | 'history') {
    this.librarySubTab = tab;
  }

  toggleArticleMenu(event: Event, article: Article) {
    event.stopPropagation();
    // Toggle menu for this article
    if (this.menuOpenArticleId === article._id) {
      this.menuOpenArticleId = null;
    } else {
      this.menuOpenArticleId = article._id;
    }
  }

  viewArticle(article: Article) {
    this.router.navigate(['/articles', article._id]);
  }

  saveArticle(article: Article) {
    // For now, just hide the menu and show a success message
    this.menuOpenArticleId = null;
    // TODO: Implement actual save functionality
    alert('Article saved! (This is a placeholder)');
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}

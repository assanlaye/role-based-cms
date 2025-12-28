import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { Navbar } from '../../shared/navbar/navbar';
import { ArticleService } from '../../../services/article.service';
import { AuthService } from '../../../services/auth.service';
import { SidebarService } from '../../../services/sidebar.service';
import { Article } from '../../../models/article';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Navbar],
  templateUrl: './article-list.html',
  styleUrl: './article-list.css',
})
export class ArticleList implements OnInit {
  articles: Article[] = [];
  filteredArticles: Article[] = [];
  selectedArticle: Article | null = null;
  currentTab: 'all' | 'published' | 'draft' | 'trash' = 'all';
  searchQuery = '';
  selectedAuthor = '';
  selectedDate = '';
  authors: string[] = [];
  currentUser: any = null;
  loading = false;
  sidebarOpen = true;

  constructor(
    private articleService: ArticleService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private sidebarService: SidebarService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.sidebarService.sidebarOpen$.subscribe(open => {
      this.sidebarOpen = open;
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadArticle(params['id']);
      } else {
        this.selectedArticle = null;
        this.loadArticles();
      }
    });

    this.loadArticles();
  }

  loadArticles() {
    this.loading = true;
    this.articleService.getAllArticles().subscribe({
      next: (articles) => {
        this.articles = articles;
        this.extractAuthors();
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading articles:', err);
        this.loading = false;
      }
    });
  }

  loadArticle(id: string) {
    this.articleService.getArticleById(id).subscribe({
      next: (article) => {
        this.selectedArticle = article;
      },
      error: (err) => {
        console.error('Error loading article:', err);
      }
    });
  }

  extractAuthors() {
    const authorSet = new Set<string>();
    this.articles.forEach(article => {
      if (article.author && article.author.fullName) {
        authorSet.add(article.author.fullName);
      }
    });
    this.authors = Array.from(authorSet);
  }

  applyFilters() {
    let filtered = [...this.articles];

    // Tab filter
    if (this.currentTab === 'published') {
      filtered = filtered.filter(a => a.isPublished);
    } else if (this.currentTab === 'draft') {
      filtered = filtered.filter(a => !a.isPublished);
    } else if (this.currentTab === 'trash') {
      // For now, trash is empty - you can implement soft delete later
      filtered = [];
    }

    // Search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(query) ||
        a.body.toLowerCase().includes(query)
      );
    }

    // Author filter
    if (this.selectedAuthor) {
      filtered = filtered.filter(a => 
        a.author.fullName === this.selectedAuthor
      );
    }

    // Date filter
    if (this.selectedDate) {
      const filterDate = new Date(this.selectedDate);
      filtered = filtered.filter(a => {
        const articleDate = new Date(a.createdAt);
        return articleDate.toDateString() === filterDate.toDateString();
      });
    }

    this.filteredArticles = filtered;
  }

  onTabChange(tab: 'all' | 'published' | 'draft' | 'trash') {
    this.currentTab = tab;
    this.applyFilters();
  }

  onSearchChange() {
    this.applyFilters();
  }

  onAuthorChange() {
    this.applyFilters();
  }

  onDateChange() {
    this.applyFilters();
  }

  viewArticle(article: Article) {
    this.router.navigate(['/articles', article._id]);
  }

  editArticle(article: Article) {
    this.router.navigate(['/articles', article._id, 'edit']);
  }

  deleteArticle(article: Article) {
    if (confirm('Are you sure you want to delete this article?')) {
      this.articleService.deleteArticle(article._id).subscribe({
        next: () => {
          this.loadArticles();
          if (this.selectedArticle?._id === article._id) {
            this.router.navigate(['/articles']);
          }
        },
        error: (err) => {
          console.error('Error deleting article:', err);
          alert('Failed to delete article');
        }
      });
    }
  }

  togglePublish(article: Article) {
    this.articleService.togglePublish(article._id).subscribe({
      next: () => {
        this.loadArticles();
      },
      error: (err) => {
        console.error('Error toggling publish:', err);
        alert('Failed to update article status');
      }
    });
  }

  createArticle() {
    this.router.navigate(['/articles/create']);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  hasPermission(permission: string): boolean {
    return this.authService.hasPermission(permission);
  }

  closeArticleView() {
    this.router.navigate(['/articles']);
  }
}

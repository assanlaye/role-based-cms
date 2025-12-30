import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article, CreateArticleRequest, UpdateArticleRequest } from '../models/article';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/articles`);
  }

  getArticleById(id: string): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/articles/${id}`);
  }

  createArticle(article: CreateArticleRequest): Observable<any> {
    const formData = new FormData();
    formData.append('title', article.title);
    formData.append('body', article.body);
    if (article.image) {
      formData.append('image', article.image);
    }

    return this.http.post(`${this.apiUrl}/articles`, formData);
  }

  updateArticle(id: string, article: UpdateArticleRequest): Observable<any> {
    const formData = new FormData();
    if (article.title) formData.append('title', article.title);
    if (article.body) formData.append('body', article.body);
    if (article.image) {
      formData.append('image', article.image);
    }

    return this.http.put(`${this.apiUrl}/articles/${id}`, formData);
  }

  deleteArticle(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/articles/${id}`);
  }

  togglePublish(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/articles/${id}/publish`, {});
  }
}


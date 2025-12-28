import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { Navbar } from '../../shared/navbar/navbar';
import { ArticleService } from '../../../services/article.service';
import { Article } from '../../../models/article';

@Component({
  selector: 'app-article-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Sidebar, Navbar],
  templateUrl: './article-form.html',
  styleUrl: './article-form.css',
})
export class ArticleForm implements OnInit {
  articleForm: FormGroup;
  isEditMode = false;
  articleId: string | null = null;
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  fileName = 'No file chosen';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.articleForm = this.fb.group({
      title: ['', [Validators.required]],
      body: ['', [Validators.required]],
      publish: [false]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.articleId = params['id'];
        this.loadArticle(params['id']);
      }
    });
  }

  loadArticle(id: string) {
    this.articleService.getArticleById(id).subscribe({
      next: (article) => {
        this.articleForm.patchValue({
          title: article.title,
          body: article.body,
          publish: article.isPublished
        });
        if (article.image) {
          this.imagePreview = article.image;
          this.fileName = 'Current image';
        }
      },
      error: (err) => {
        console.error('Error loading article:', err);
        alert('Failed to load article');
        this.router.navigate(['/articles']);
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.fileName = file.name;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.articleForm.invalid) {
      return;
    }

    this.loading = true;
    const formValue = this.articleForm.value;

    if (this.isEditMode && this.articleId) {
      // Update article
      const updateData: any = {
        title: formValue.title,
        body: formValue.body
      };
      if (this.selectedFile) {
        updateData.image = this.selectedFile;
      }

      this.articleService.updateArticle(this.articleId, updateData).subscribe({
        next: () => {
          // Toggle publish status if changed
          this.articleService.getArticleById(this.articleId!).subscribe({
            next: (article) => {
              if (article.isPublished !== formValue.publish) {
                this.articleService.togglePublish(this.articleId!).subscribe({
                  next: () => {
                    this.router.navigate(['/articles']);
                  },
                  error: (err) => {
                    console.error('Error toggling publish:', err);
                    this.router.navigate(['/articles']);
                  }
                });
              } else {
                this.router.navigate(['/articles']);
              }
            }
          });
        },
        error: (err) => {
          console.error('Error updating article:', err);
          alert('Failed to update article');
          this.loading = false;
        }
      });
    } else {
      // Create article
      const articleData = {
        title: formValue.title,
        body: formValue.body,
        image: this.selectedFile || undefined
      };

      this.articleService.createArticle(articleData).subscribe({
        next: (response: any) => {
          // If publish is checked, toggle publish status
          if (formValue.publish && response.article?._id) {
            this.articleService.togglePublish(response.article._id).subscribe({
              next: () => {
                this.router.navigate(['/articles']);
              },
              error: (err) => {
                console.error('Error publishing article:', err);
                this.router.navigate(['/articles']);
              }
            });
          } else {
            this.router.navigate(['/articles']);
          }
        },
        error: (err) => {
          console.error('Error creating article:', err);
          alert('Failed to create article');
          this.loading = false;
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/articles']);
  }
}

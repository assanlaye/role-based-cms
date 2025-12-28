import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleForm } from './article-form';

describe('ArticleForm', () => {
  let component: ArticleForm;
  let fixture: ComponentFixture<ArticleForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

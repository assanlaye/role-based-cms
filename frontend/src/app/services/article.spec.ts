import { TestBed } from '@angular/core/testing';

import { Article } from './article';

describe('Article', () => {
  let service: Article;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Article);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

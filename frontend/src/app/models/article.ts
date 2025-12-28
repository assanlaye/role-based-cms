export interface Article {
  _id: string;
  title: string;
  body: string;
  image?: string;
  author: {
    _id: string;
    fullName: string;
    email: string;
  };
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateArticleRequest {
  title: string;
  body: string;
  image?: File;
}

export interface UpdateArticleRequest {
  title?: string;
  body?: string;
  image?: File;
}

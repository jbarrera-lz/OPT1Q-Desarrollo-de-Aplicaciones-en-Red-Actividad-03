import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogArticleBrief } from '../blog-article-brief/blog-article-brief';
import { Post } from '../blog-entry';
import { BloggingService } from '../blogging';

@Component({
  selector: 'app-home',
  imports: [CommonModule, BlogArticleBrief],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  public posts: Post[] = [];
  public bloggingService: BloggingService = inject(BloggingService);

  constructor() {
    this.posts = this.bloggingService.getAllPosts();
  };
}

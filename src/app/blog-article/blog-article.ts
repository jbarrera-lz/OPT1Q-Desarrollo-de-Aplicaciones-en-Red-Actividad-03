import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { BloggingService } from '../blogging';
import { Post } from '../blog-entry';

import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-blog-article',
  imports: [ 
    CommonModule,
    MarkdownComponent
 ],
  templateUrl: './blog-article.html',
  styleUrl: './blog-article.css',
})
export class BlogArticle {
  route: ActivatedRoute = inject(ActivatedRoute);
  bloggingService = inject(BloggingService);
  post: Post | undefined;

  constructor() {
    const postID = Number(this.route.snapshot.params['id']);
    this.post = this.bloggingService.getPostById(postID);
  }
}

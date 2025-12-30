import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../blog-entry';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-blog-article-brief',
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-article-brief.html',
  styleUrl: './blog-article-brief.css',
})
export class BlogArticleBrief {
  @Input() post!: Post | undefined;
}


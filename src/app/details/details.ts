import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BloggingService } from '../blogging';
import { Post } from '../blog-entry';

@Component({
  selector: 'app-details',
  imports: [CommonModule],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {
  route: ActivatedRoute = inject(ActivatedRoute);
  bloggingService = inject(BloggingService);
  post: Post | undefined;

  constructor(){
    const postId = Number(this.route.snapshot.params['id']);
    this.post = this.bloggingService.getPostById(postId);
  }
}

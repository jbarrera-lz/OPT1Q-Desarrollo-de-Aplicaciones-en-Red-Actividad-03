import { Injectable } from '@angular/core';
import { BlogEntry, Post } from './blog-entry';

// Definition of Blog Posts availables
// Modify this array with another method to load the data
// In our case, just defined for development purposes
let blogEntriesList : BlogEntry[] =  [
    {
      id: 0,
      name: "Introduccion a Angular",
      author: "J Bar.",
      description: "Breve Introducción a este turorial",
      photo_description: "Antwerpen graffiti",
      date: "2025 November 24th",
    },
    {
      id: 1,
      name: "Preparando un setup para Angular con DevContainers",
      author: "J Bar.",
      description: "Cómo prepar tu setup con VSCode y DevContainers",
      photo_description: "Antwerpen Ferris wheel",
      date: "2025 November 24th",
    },
    {
      id: 2,
      name: "Angular: Connectividad con Backend (Parte 01)",
      author: "J Bar.",
      description: "Conectividad entrGeolocatione Mongodb y Angular",
      photo_description: "Antwerpen Diamand district at night",
      date: "2025 November 24th",
    }
  ];

@Injectable({providedIn: 'root'})
export class BloggingService {
  protected posts : Post[] = [];

  constructor(){
    for (var entry of blogEntriesList) {
      let p : Post = new Post(
        entry.id,
        entry.name,
        entry.author,
        entry.description,
        entry.photo_description,
        entry.date
      );

      this.posts.push(p)
    }
   }

  getAllPosts() : Post[] {
    return this.posts;
  }
  getPostById(id: Number) : Post | undefined {
    return this.posts.find(Post => Post.id === id);
  }
}

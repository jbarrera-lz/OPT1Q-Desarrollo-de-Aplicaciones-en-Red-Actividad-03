import { Component, signal, OnInit } from '@angular/core';
import { RouterModule, Router, ResolveStart, ResolveEnd } from '@angular/router';
import { AsyncPipe } from '@angular/common';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { map, Observable, filter, merge} from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    RouterModule, MatProgressBarModule, 
    MatToolbarModule, AsyncPipe
  ],
  template: `
  <header>
  </header>
  <main>
    @if (isLoading$ | async; as loading) {
      <mat-progress-bar mode="indeterminate" color="accent" style="position: absolute;">
      </mat-progress-bar>
    }
    <section>
      <router-outlet></router-outlet>
    </section>
  </main>
  `,
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('Desarrollo de Aplicaciones en Red, Actividad 03.');
  
  public isLoading$!: Observable<boolean>;
  private _showLoaderEvents$!: Observable<boolean>;
  private _hideLoaderEvents$!: Observable<boolean>;
  
  constructor(private router: Router) { }

  ngOnInit(): void {
    this._showLoaderEvents$ = this.router.events.pipe(
      filter(event => event instanceof ResolveStart), map(() => true)
    );

    this._hideLoaderEvents$ = this.router.events.pipe(
      filter(event => event instanceof ResolveEnd), map(() => false)
    );

    this.isLoading$ = merge(this._showLoaderEvents$, this._hideLoaderEvents$);
  }

}

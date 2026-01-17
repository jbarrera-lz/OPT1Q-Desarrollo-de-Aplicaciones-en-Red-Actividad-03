import { Component, signal, OnInit } from '@angular/core';
import { RouterModule, Router, ResolveStart, ResolveEnd } from '@angular/router';
import { AsyncPipe } from '@angular/common';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { map, Observable, filter, merge } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    MatProgressBarModule,
    MatToolbarModule,
    AsyncPipe
  ],
  template: `
    <header class="app-header">
      <mat-toolbar class="app-toolbar">
        <div class="toolbar-left">
          <div class="logo-circle">
            <span class="logo-icon">⛽</span>
          </div>
          <div class="title-block">
            <div class="main-title">
              Gasolineras cerca de ti
            </div>
            <div class="subtitle">
              Encuentra la gasolinera más cercana y barata en tu área
            </div>
          </div>
        </div>
      </mat-toolbar>
    </header>

    <main class="app-main">
      @if (isLoading$ | async) {
        <mat-progress-bar
          mode="indeterminate"
          color="accent"
          class="app-progress"
        ></mat-progress-bar>
      }
      <section class="app-content">
        <router-outlet></router-outlet>
      </section>
    </main>
  `,
  styleUrl: './app.css',
})
export class App implements OnInit {

  protected readonly title = signal('Gasolineras cerca de ti');

  public isLoading$!: Observable<boolean>;
  private _showLoaderEvents$!: Observable<boolean>;
  private _hideLoaderEvents$!: Observable<boolean>;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this._showLoaderEvents$ = this.router.events.pipe(
      filter(event => event instanceof ResolveStart),
      map(() => true)
    );

    this._hideLoaderEvents$ = this.router.events.pipe(
      filter(event => event instanceof ResolveEnd),
      map(() => false)
    );

    this.isLoading$ = merge(
      this._showLoaderEvents$,
      this._hideLoaderEvents$
    );
  }
}

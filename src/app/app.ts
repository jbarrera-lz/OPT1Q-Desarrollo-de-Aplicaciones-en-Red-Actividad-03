import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterModule],
  template: `
  <main>
    <header class="header-custom">
      <div>
        <a [routerLink]="['/']" class="home-logo">
          <img src="src/assets/athaka.svg" alt="Home" aria-hidden="true">
        </a>

        <div class="header-grid">        
          <a class="github-logo" href="https://github.com/jbarrera-lz">
            <img src="src/assets/github.svg" alt="GitHub" aria-hidden="true">
          </a>
          <a class="linkedin-logo" href="https://linkedin.com/in/josue-b-3662451b3">
            <img src="src/assets/linkedin.png" alt="LinkedIn" aria-hidden="true">
          </a>
        </div>

      </div>
    </header>
    <section class="content">
      <router-outlet></router-outlet>
    </section>
  </main>
  `,
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Desarrollo de Aplicaciones en Red, Actividad 03.');
}

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `
      <main>
      <header>
      <h1 class="text-3xl text-blue-500 font-bold underline">
  Hello world!
</h1>
      </header>
      <section>
        <router-outlet></router-outlet>
      </section>
    </main>
`,
  styleUrls: ['./app.component.css'],
  imports: [RouterModule],
})
export class AppComponent {
  title = 'homes';
}

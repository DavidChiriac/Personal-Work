import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { ProjectsComponent } from './projects/projects.component';
import { ContactComponent } from './contact/contact.component';
import { ProjectPresentationComponent } from './projects/project-presentation/project-presentation.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent, pathMatch: 'full' },
  {
    path: 'projects',
    component: ProjectsComponent,
    children: [{ path: ':id', component: ProjectPresentationComponent }],
  },
  { path: 'contact', component: ContactComponent },
];

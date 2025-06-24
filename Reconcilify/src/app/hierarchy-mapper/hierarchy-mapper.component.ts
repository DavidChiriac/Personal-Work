import { Component } from '@angular/core';
import { AppModulesEnum } from '../shared/utils/app-modules';

@Component({
  selector: 'app-hierarchy-mapper',
  templateUrl: './hierarchy-mapper.component.html',
  styleUrl: './hierarchy-mapper.component.scss',
  standalone: false
})
export class HierarchyMapperComponent {
  moduleName = AppModulesEnum.FNB;
}

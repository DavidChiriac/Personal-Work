import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BadgeModule } from 'primeng/badge';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { InputMaskModule } from 'primeng/inputmask';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ListboxModule } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { ScrollerModule } from 'primeng/scroller';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { PanelModule } from 'primeng/panel';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { PopoverModule } from 'primeng/popover';
import { DrawerModule } from 'primeng/drawer';
import { TooltipModule } from 'primeng/tooltip';
import { FileUploadModule } from 'primeng/fileupload';
import { MenuModule } from 'primeng/menu';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ChartModule } from 'primeng/chart';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { StyleClassModule } from 'primeng/styleclass';
import { KnobModule } from 'primeng/knob';

import { FooterComponent } from './components/footer/footer.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ModalComponent } from './components/modal/modal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EnvBannerComponent } from './components/env-banner/env-banner.component';
import { ClipboardModule } from 'ngx-clipboard';
import { CopyCellComponent } from './components/copy-cell/copy-cell.component';
import { NameCodePipe } from './pipes/name-code.pipe';
import { MessageService } from 'primeng/api';
import { ShortenNumberPipe } from './pipes/shorten-number.pipe';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { TableHeaderCellComponent } from './components/table-header-cell/table-header-cell.component';
import { DateFilteringComponent } from './components/date-filtering/date-filtering.component';
import { TableCaptionComponent } from './components/table-caption/table-caption.component';
import { TableCellComponent } from './components/table-cell/table-cell.component';
import { VerticalNavbarComponent } from './components/vertical-navbar/vertical-navbar.component';
import { WeekPipe } from './pipes/week.pipe';
import { TableMassFiltersComponent } from './components/table-mass-filters/table-mass-filters.component';
import { ModalsComponent } from './components/modals-component/modals-component.component';
import { ExportDropdownComponent } from './components/export-dropdown/export-dropdown.component';
import { CalendarModeToggleDirective } from './directives/calendar-mode-toggle.directive';
import { DynamicSelectionDateFilteringComponent } from './components/dynamic-selection-date-filtering/dynamic-selection-date-filtering.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

const primeng = [
  ButtonModule,
  MenubarModule,
  TagModule,
  ProgressSpinnerModule,
  BadgeModule,
  DatePickerModule,
  CheckboxModule,
  SelectModule,
  InputMaskModule,
  ToggleSwitchModule,
  InputTextModule,
  TextareaModule,
  InputNumberModule,
  ListboxModule,
  MultiSelectModule,
  RadioButtonModule,
  SelectButtonModule,
  ToggleButtonModule,
  SplitButtonModule,
  ButtonGroupModule,
  PaginatorModule,
  TableModule,
  ScrollerModule,
  CardModule,
  DividerModule,
  FieldsetModule,
  PanelModule,
  ToolbarModule,
  ConfirmDialogModule,
  ConfirmPopupModule,
  DialogModule,
  DynamicDialogModule,
  PopoverModule,
  DrawerModule,
  TooltipModule,
  FileUploadModule,
  MenuModule,
  BreadcrumbModule,
  MessageModule,
  ToastModule,
  StyleClassModule,
  DialogModule,
  BreadcrumbModule,
  ChartModule,
  KnobModule
];

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    NotFoundComponent,
    ModalComponent,
    EnvBannerComponent,
    CopyCellComponent,
    NameCodePipe,
    ShortenNumberPipe,
    ClickOutsideDirective,
    TableHeaderCellComponent,
    DateFilteringComponent,
    TableCaptionComponent,
    TableCellComponent,
    VerticalNavbarComponent,
    WeekPipe,
    TableMassFiltersComponent,
    ModalsComponent,
    ExportDropdownComponent,
    CalendarModeToggleDirective,
    DynamicSelectionDateFilteringComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    ClipboardModule,
    FormsModule,
    RouterModule,
    [...primeng]
  ],
  exports: [
    [...primeng],
    ClipboardModule,
    FontAwesomeModule,
    NavbarComponent,
    FooterComponent,
    ModalComponent,
    EnvBannerComponent,
    CopyCellComponent,
    NameCodePipe,
    ShortenNumberPipe,
    ClickOutsideDirective,
    TableHeaderCellComponent,
    DateFilteringComponent,
    TableCaptionComponent,
    TableCellComponent,
    VerticalNavbarComponent,
    WeekPipe,
    TableMassFiltersComponent,
    ModalsComponent,
    ExportDropdownComponent,
    CalendarModeToggleDirective,
    DynamicSelectionDateFilteringComponent
  ],
  providers: [MessageService, DatePipe]
})
export class SharedModule { }

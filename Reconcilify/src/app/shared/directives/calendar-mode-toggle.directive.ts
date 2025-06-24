import { Directive, EventEmitter, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { Calendar } from 'primeng/calendar';

export type SelectionMode = 'single' | 'range';
const primeNgButtonClasses = 'p-button-text p-ripple p-button p-component';
const selectedClass = 'selected';

@Directive({
  selector: '[calendarModeToggle]',
  standalone: false
})
export class CalendarModeToggleDirective implements OnInit, OnDestroy {
  @Output() mode = new EventEmitter<SelectionMode>();

  stopListening: any;
  toggleWrapper!: HTMLDivElement | null;
  buttons: HTMLButtonElement[] = [];

  constructor(
    readonly calendar: Calendar,
    private readonly rn: Renderer2
  ) { }

  ngOnInit(): void {
    this.calendar.onShow.subscribe(() => {
      this.addToggleButtonToButtonBar();
    });

    this.calendar.onTodayClick.subscribe(() => {
      this.handleTodayClick();
    });
  }

  ngOnDestroy(): void {
    if (this.stopListening) {
      this.stopListening.forEach((fn: any) => fn());
    }

    this.toggleWrapper = null;
    this.buttons = [];
  }

  handleTodayClick(): void {
    if (this.calendar.selectionMode === 'single') {
      return;
    }

    this.calendar.hideOverlay();

    setTimeout(() => {
      this.setMode('single', this.buttons[0]);
      this.calendar.writeValue(this.calendar.value[0]);
    }, 50);
  }

  setMode(selectedMode: SelectionMode, clickedButton: HTMLButtonElement, { clearSelection = false } = {}): void {
    this.mode.emit(selectedMode);

    if (this.calendar.selectionMode === selectedMode) {
      return;
    }

    this.calendar.selectionMode = selectedMode;
    this.deselectButtons();
    clickedButton.classList.add(selectedClass);

    if (clearSelection) {
      this.clearDateSelection();
    }
  }

  clearDateSelection(): void {
    const selectedMonth = this.calendar.currentMonth;
    const selectedYear = this.calendar.currentYear;

    this.calendar.writeValue(null);

    let didRestoreSelection = false;

    if (this.calendar.currentMonth !== selectedMonth) {
      this.calendar.currentMonth = selectedMonth;
      didRestoreSelection = true;
    }

    if (this.calendar.currentYear !== selectedYear) {
      this.calendar.currentYear = selectedYear;
      didRestoreSelection = true;
    }

    if (didRestoreSelection) {
      // prevent jump to current month when clearing selection
      this.calendar.createMonths(this.calendar.currentMonth, this.calendar.currentYear);
    }
  }

  deselectButtons(): void {
    this.buttons.forEach(button => button.classList.remove(selectedClass));
  }

  addToggleButtonToButtonBar(): void {
    if (!this.toggleWrapper) {
      const toggleWrapper = this.rn.createElement('div');    
      const dateButton = this.rn.createElement('button');
      const dateRangeButton = this.rn.createElement('button');
      const buttonSeparator = this.rn.createElement('span');
      const styleEl = this.rn.createElement('style');
  
      this.rn.appendChild(dateButton, this.rn.createText('Date'));
      this.rn.appendChild(dateRangeButton, this.rn.createText('Date Range'));
      this.rn.appendChild(buttonSeparator, this.rn.createText('|'));
      this.rn.appendChild(toggleWrapper, styleEl);
      this.rn.appendChild(toggleWrapper, dateButton);    
      this.rn.appendChild(toggleWrapper, buttonSeparator);
      this.rn.appendChild(toggleWrapper, dateRangeButton);
  
      this.rn.addClass(toggleWrapper, 'toggle-wrapper');
      this.rn.setAttribute(dateButton, 'class', primeNgButtonClasses);
      this.rn.setAttribute(dateRangeButton, 'class', primeNgButtonClasses);
      this.rn.setAttribute(buttonSeparator, 'class', 'p-button p-button-text');

      this.toggleWrapper = toggleWrapper;
      this.buttons = [dateButton, dateRangeButton];
      this.stopListening = [
        this.rn.listen(dateButton, 'click', () => this.setMode('single', dateButton, { clearSelection: true })),
        this.rn.listen(dateRangeButton, 'click', () => this.setMode('range', dateRangeButton, { clearSelection: true }))
      ];

      this.calendar.selectionMode = undefined;

      if(Array.isArray(this.calendar.value)){
        this.setMode('range', dateRangeButton);
      } else {
        this.setMode('single', dateButton);
      }
    }

    const buttonBar = document.querySelector('.p-datepicker-buttonbar');
    if (!buttonBar) {
      return;
    }
    const lastButton = buttonBar.children[1];
    this.rn.insertBefore(buttonBar, this.toggleWrapper, lastButton);
  }
}

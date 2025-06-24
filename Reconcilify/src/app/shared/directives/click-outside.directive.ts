import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
  standalone: false
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<Event>();
  private isInsideClick = false;

  constructor(private readonly elementRef: ElementRef) {}

  @HostListener('click')
  onInsideClick(): void {
    this.isInsideClick = true;
    setTimeout(() => this.isInsideClick = false, 0); // Small delay
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    if (!this.isInsideClick && !this.elementRef.nativeElement.contains(event.target)) {
      this.clickOutside.emit(event);
    }
  }
}

import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ClickOutsideDirective } from './click-outside.directive';

@Component({
  template: `<div appClickOutside (clickOutside)="onOutsideClick($event)">Content</div>`,
  standalone: false
})
class TestComponent {
  wasOutsideClicked = false;
  onOutsideClick(): void {
    this.wasOutsideClicked = true;
  }
}

describe('ClickOutsideDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let debugElement: DebugElement;
  let component: TestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, ClickOutsideDirective]
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement.query(By.directive(ClickOutsideDirective));
    fixture.detectChanges();
  });

  it('should emit clickOutside when a click occurs outside the element', () => {
    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);

    const outsideClickEvent = new MouseEvent('click', { bubbles: true });
    outsideElement.dispatchEvent(outsideClickEvent);

    fixture.detectChanges();

    expect(component.wasOutsideClicked).toBe(true);

    document.body.removeChild(outsideElement);
  });

  it('should not emit clickOutside when a click occurs inside the element', () => {
    component.wasOutsideClicked = false;

    const insideClickEvent = new MouseEvent('click', { bubbles: true });
    debugElement.nativeElement.dispatchEvent(insideClickEvent);

    fixture.detectChanges();

    expect(component.wasOutsideClicked).toBe(false);
  });
});

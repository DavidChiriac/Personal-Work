import { CalendarModeToggleDirective } from './calendar-mode-toggle.directive';
import { Renderer2 } from '@angular/core';

describe('CalendarModeToggleDirective', () => {
  let directive: CalendarModeToggleDirective;
  let mockRenderer: Renderer2;
  let mockCalendar: any;

  beforeEach(() => {
    mockRenderer = {
      createElement: jest.fn(tag => document.createElement(tag)),
      createText: jest.fn(text => document.createTextNode(text)),
      appendChild: jest.fn((parent, child) => parent.appendChild(child)),
      addClass: jest.fn((el, className) => el.classList.add(className)),
      setAttribute: jest.fn((el, attr, value) => el.setAttribute(attr, value)),
      insertBefore: jest.fn(),
      listen: jest.fn(() => jest.fn()), // returns an unsubscribe function
    } as unknown as Renderer2;

    mockCalendar = {
      selectionMode: 'single',
      value: null,
      currentMonth: 5,
      currentYear: 2025,
      onShow: { subscribe: jest.fn() },
      onTodayClick: { subscribe: jest.fn() },
      hideOverlay: jest.fn(),
      writeValue: jest.fn(),
      createMonths: jest.fn()
    };

    directive = new CalendarModeToggleDirective(mockCalendar, mockRenderer);
  });

  it('should subscribe to onShow and onTodayClick on init', () => {
    directive.ngOnInit();
    expect(mockCalendar.onShow.subscribe).toHaveBeenCalled();
    expect(mockCalendar.onTodayClick.subscribe).toHaveBeenCalled();
  });

  it('should emit mode and update calendar on setMode()', () => {
    const emitSpy = jest.spyOn(directive.mode, 'emit');
    const button = document.createElement('button');

    directive.calendar.selectionMode = 'range';
    directive.buttons = [button];
    directive.setMode('single', button, { clearSelection: true });

    expect(emitSpy).toHaveBeenCalledWith('single');
    expect(directive.calendar.selectionMode).toBe('single');
    expect(button.classList.contains('selected')).toBe(true);
  });

  it('should clear selection and restore calendar state', () => {
    directive.calendar.currentMonth = 5;
    directive.calendar.currentYear = 2025;

    directive.clearDateSelection();

    expect(mockCalendar.writeValue).toHaveBeenCalledWith(null);
    expect(mockCalendar.createMonths).not.toHaveBeenCalled(); // because values are unchanged
  });

  it('should call unsubscribe functions on destroy', () => {
    const unsub1 = jest.fn();
    const unsub2 = jest.fn();
    directive.stopListening = [unsub1, unsub2];
    directive.ngOnDestroy();
    expect(unsub1).toHaveBeenCalled();
    expect(unsub2).toHaveBeenCalled();
  });

  it('should add toggle buttons when calendar is shown', () => {
    // Set up DOM
    const buttonBar = document.createElement('div');
    buttonBar.classList.add('p-datepicker-buttonbar');
    const existingButton1 = document.createElement('button');
    const existingButton2 = document.createElement('button');
    buttonBar.appendChild(existingButton1);
    buttonBar.appendChild(existingButton2);
    document.body.appendChild(buttonBar);

    // Mock insertBefore to actually insert in the DOM
    mockRenderer.insertBefore = (parent, newNode, referenceNode): any => {
      parent.insertBefore(newNode, referenceNode);
      return newNode;
    };

    directive.addToggleButtonToButtonBar();

    const insertedWrapper = document.querySelector('.toggle-wrapper');

    expect(insertedWrapper).toBeTruthy();
    expect(directive.buttons.length).toBe(2);
    expect(buttonBar.contains(insertedWrapper!)).toBe(true);

    // Clean up
    document.body.removeChild(buttonBar);
  });


  it('should switch to single mode on today click if selectionMode is range', () => {
    directive.calendar.selectionMode = 'range';
    directive.calendar.value = ['2025-06-04', '2025-06-10'];
    directive.buttons = [document.createElement('button')];

    jest.useFakeTimers();
    directive.handleTodayClick();

    jest.runAllTimers();

    expect(directive.calendar.selectionMode).toBe('single');
    expect(directive.calendar.writeValue).toHaveBeenCalledWith('2025-06-04');
  });
});

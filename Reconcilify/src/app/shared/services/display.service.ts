import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DisplayService {
  private contentHeight = new BehaviorSubject<number>(0);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  contentHeight$ = this.contentHeight.asObservable();

  constructor() {
    this.listenToWindowResize();
  }

  setContentHeight(height: number): void {
    this.contentHeight.next(height);
  }

  private listenToWindowResize(): void {
    window.addEventListener('resize', () => {
      const pageHeight = window.innerHeight;
      const headerHeight = document.querySelector('#header')?.clientHeight ?? 120;
      const footerHeight = document.querySelector('#footer')?.clientHeight ?? 50;
      const tableHeight = pageHeight - headerHeight - footerHeight - 180;
      this.setContentHeight(tableHeight);
    });
  }
}

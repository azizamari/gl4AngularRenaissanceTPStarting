import { Directive, signal } from '@angular/core';

@Directive({
  selector: 'input[appRainbow]',
  host: {
    '[style.color]': 'color()',
    '[style.border-color]': 'borderColor()',
    '(keyup)': 'onKeyup()',
  },
})
export class RainbowDirective {
  color = signal('black');
  borderColor = signal('black');

  onKeyup() {
    const randomColor = this.getRandomColor();
    this.color.set(randomColor);
    this.borderColor.set(randomColor);
  }

  private getRandomColor(): string {
    const value = Math.floor(Math.random() * 0x1000000);
    return '#' + value.toString(16).padStart(6, '0');
  }
}
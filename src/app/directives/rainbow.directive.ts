import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: 'input[appRainbow]',
})
export class RainbowDirective {
  @HostBinding('style.color') color = 'black';
  @HostBinding('style.border-color') borderColor = 'black';

  @HostListener('keyup')
  onKeyup() {
    const randomColor = this.getRandomColor();
    this.color = randomColor;
    this.borderColor = randomColor;
  }

  private getRandomColor(): string {
    const value = Math.floor(Math.random() * 0x1000000);
    return '#' + value.toString(16).padStart(6, '0');
  }
}

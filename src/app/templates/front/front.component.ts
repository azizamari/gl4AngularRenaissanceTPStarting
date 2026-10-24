import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TtcComponent } from '../../ttc/ttc.component';
import { RainbowDirective } from '../../directives/rainbow.directive';
@Component({
    selector: 'app-front',
    templateUrl: './front.component.html',
    styleUrls: ['./front.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [RouterOutlet, TtcComponent, RainbowDirective]
})
export class FrontComponent {

}

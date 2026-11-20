import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { Cv } from '../model/cv';
import { DefaultImagePipe } from '../pipes/default-image.pipe';

/**
 * Composant de présentation : affiche les informations d'un cv.
 * Les actions (ex: bouton Delete) sont projetées via <ng-content>.
 */
@Component({
  selector: 'app-cv-info',
  templateUrl: './cv-info.component.html',
  styleUrls: ['./cv-info.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DefaultImagePipe],
})
export class CvInfoComponent {
  cv = input.required<Cv>();
}

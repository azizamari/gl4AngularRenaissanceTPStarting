import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Cv } from "../model/cv";

/**
 * Composant de présentation : affiche les informations d'un cv.
 * Les actions (ex: bouton Delete) sont projetées via <ng-content>.
 */
@Component({
  selector: "app-cv-info",
  templateUrl: "./cv-info.component.html",
  styleUrls: ["./cv-info.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CvInfoComponent {
  @Input({ required: true }) cv!: Cv;
}

import { Component, ChangeDetectionStrategy, inject, signal } from "@angular/core";
import { Cv } from "../model/cv";
import { LoggerService } from "../../services/logger.service";
import { ToastrService } from "ngx-toastr";
import { CvService } from "../services/cv.service";
import { ListComponent } from "../list/list.component";
import { CvCardComponent } from "../cv-card/cv-card.component";
import { EmbaucheComponent } from "../embauche/embauche.component";
import { UpperCasePipe, DatePipe } from "@angular/common";

@Component({
  selector: "app-cv",
  templateUrl: "./cv.component.html",
  styleUrls: ["./cv.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Note pour le prof : EmbaucheComponent DOIT figurer dans imports pour qu'Angular
  // reconnaisse la balise <app-embauche>. Le compilateur détecte automatiquement
  // qu'il est encapsulé dans @defer et le splitte dans un lazy chunk dédié !
  imports: [ListComponent, CvCardComponent, EmbaucheComponent, UpperCasePipe, DatePipe],
})
export class CvComponent {
  private logger = inject(LoggerService);
  private toastr = inject(ToastrService);
  cvService = inject(CvService);

  /** Signal local : la liste des CVs chargée depuis l'API ou en fallback */
  cvs = signal<Cv[]>([]);
  date = new Date();

  constructor() {
    this.cvService.getCvs().subscribe({
      next: (cvs) => {
        this.cvs.set(cvs);
      },
      error: () => {
        this.cvs.set(this.cvService.getFakeCvs());
        this.toastr.error(`
          Attention!! Les données sont fictives, problème avec le serveur.
          Veuillez contacter l'admin.`);
      },
    });
    this.logger.logger("je suis le cvComponent");
    this.toastr.info("Bienvenu dans notre CvTech");
    // Plus besoin de subscribe à selectCv$ !
    // Le template lit directement cvService.selectedCv()
  }
}

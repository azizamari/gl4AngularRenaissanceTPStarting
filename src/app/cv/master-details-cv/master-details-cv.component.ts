import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { CvService } from "../services/cv.service";
import { DefaultImagePipe } from "../pipes/default-image.pipe";

@Component({
  selector: "app-master-details-cv",
  templateUrl: "./master-details-cv.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, DefaultImagePipe],
})
export class MasterDetailsCvComponent {
  private cvService = inject(CvService);

  cvs = rxResource({ stream: () => this.cvService.getCvs() });
}

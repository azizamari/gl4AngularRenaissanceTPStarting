import { Component, ChangeDetectionStrategy, inject, input, numberAttribute } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { CvService } from "../../services/cv.service";
import { DefaultImagePipe } from "../../pipes/default-image.pipe";

@Component({
  selector: "app-cv-detail",
  templateUrl: "./cv-detail.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DefaultImagePipe],
})
export class CvDetailComponent {
  private cvService = inject(CvService);

  id = input.required<number, string>({ transform: numberAttribute });

  cv = rxResource({
    params: () => this.id(),
    stream: ({ params: id }) => this.cvService.getCvById(id),
  });
}

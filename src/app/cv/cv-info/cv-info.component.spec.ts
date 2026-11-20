import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CvInfoComponent } from "./cv-info.component";
import { DefaultImagePipe } from "../pipes/default-image.pipe";
import { Cv } from "../model/cv";

describe("CvInfoComponent", () => {
  let fixture: ComponentFixture<CvInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CvInfoComponent, DefaultImagePipe],
    }).compileComponents();
    fixture = TestBed.createComponent(CvInfoComponent);
  });

  it("renders the cv heading and information rows", () => {
    fixture.componentRef.setInput(
      "cv",
      new Cv(1, "aymen", "sellaouti", "teacher", "as.jpg", "123456", 40)
    );
    fixture.detectChanges();
    const text: string = fixture.nativeElement.textContent;
    expect(fixture.nativeElement.querySelector("h4").textContent).toContain("Cv aymen sellaouti");
    expect(text).toContain("Cin 123456");
    expect(text).toContain("Age 40");
  });
});

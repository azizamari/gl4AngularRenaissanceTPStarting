import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { provideRouter } from "@angular/router";
import { MasterDetailsCvComponent } from "./master-details-cv.component";
import { Cv } from "../model/cv";
import { API } from "../../../config/api.config";

describe("MasterDetailsCvComponent", () => {
  let fixture: ComponentFixture<MasterDetailsCvComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterDetailsCvComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(MasterDetailsCvComponent);
  });

  it("lists the cvs returned by the API as links", async () => {
    fixture.detectChanges();
    http.expectOne(API.cv).flush([new Cv(1, "aymen", "sellaouti", "teacher", "as.jpg", "1234", 40)]);
    await fixture.whenStable();
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll("a");
    expect(links.length).toBe(1);
    expect(links[0].textContent).toContain("aymen sellaouti");
  });
});

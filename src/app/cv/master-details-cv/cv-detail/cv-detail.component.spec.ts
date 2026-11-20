import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { provideRouter, withComponentInputBinding } from "@angular/router";
import { RouterTestingHarness } from "@angular/router/testing";
import { CvDetailComponent } from "./cv-detail.component";
import { Cv } from "../../model/cv";
import { API } from "../../../../config/api.config";

describe("CvDetailComponent", () => {
  let http: HttpTestingController;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: "cv/:id", component: CvDetailComponent }], withComponentInputBinding()),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpTestingController);
    harness = await RouterTestingHarness.create();
  });

  afterEach(() => http.verify());

  it("loads the cv whose id is in the url", async () => {
    await harness.navigateByUrl("/cv/1", CvDetailComponent);
    http.expectOne(API.cv + "1").flush(new Cv(1, "aymen", "sellaouti", "teacher", "as.jpg", "1234", 40));
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(harness.routeNativeElement?.textContent).toContain("aymen sellaouti");
  });

  it("reloads the cv when the id changes without recreating the component", async () => {
    const first = await harness.navigateByUrl("/cv/1", CvDetailComponent);
    http.expectOne(API.cv + "1").flush(new Cv(1, "aymen", "sellaouti", "teacher", "as.jpg", "1234", 40));

    const second = await harness.navigateByUrl("/cv/2", CvDetailComponent);
    http.expectOne(API.cv + "2").flush(new Cv(2, "skander", "sellaouti", "enfant", "", "1234", 4));
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(second).toBe(first);
    expect(harness.routeNativeElement?.textContent).toContain("skander sellaouti");
  });
});

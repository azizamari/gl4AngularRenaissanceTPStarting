import { NO_ERRORS_SCHEMA } from "@angular/core";
import { TestBed, fakeAsync, tick } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Subject, of, throwError } from "rxjs";

import { AutocompleteComponent, SEARCH_DEBOUNCE_MS } from "./autocomplete.component";
import { CvService } from "../services/cv.service";
import { Cv } from "../model/cv";

describe("AutocompleteComponent", () => {
  const aymen = new Cv(1, "aymen", "sellaouti", "teacher", "as.jpg", "123456", 40);
  let component: AutocompleteComponent;
  let cvService: jasmine.SpyObj<CvService>;
  let toastr: jasmine.SpyObj<ToastrService>;
  let emitted: Cv[][];

  beforeEach(() => {
    cvService = jasmine.createSpyObj<CvService>("CvService", ["selectByName"], {
      selectCv$: new Subject<Cv>(),
    });
    cvService.selectByName.and.returnValue(of([aymen]));
    toastr = jasmine.createSpyObj<ToastrService>("ToastrService", ["error"]);

    TestBed.configureTestingModule({
      declarations: [AutocompleteComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: CvService, useValue: cvService },
        { provide: ToastrService, useValue: toastr },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    component = TestBed.createComponent(AutocompleteComponent).componentInstance;
    emitted = [];
    component.cvs$.subscribe((cvs) => emitted.push(cvs));
  });

  it("sends a single request once the user stops typing", fakeAsync(() => {
    component.search.setValue("s");
    tick(100);
    component.search.setValue("se");
    tick(SEARCH_DEBOUNCE_MS);

    expect(cvService.selectByName).toHaveBeenCalledOnceWith("se");
    expect(emitted).toEqual([[aymen]]);
  }));

  it("does not call the API for an empty search", fakeAsync(() => {
    component.search.setValue("   ");
    tick(SEARCH_DEBOUNCE_MS);

    expect(cvService.selectByName).not.toHaveBeenCalled();
    expect(emitted).toEqual([[]]);
  }));

  it("does not call the API again when the text did not change", fakeAsync(() => {
    component.search.setValue("se");
    tick(SEARCH_DEBOUNCE_MS);
    component.search.setValue("se ");
    tick(SEARCH_DEBOUNCE_MS);

    expect(cvService.selectByName).toHaveBeenCalledTimes(1);
  }));

  it("keeps searching after a server error", fakeAsync(() => {
    cvService.selectByName.and.returnValues(throwError(() => new Error("500")), of([aymen]));

    component.search.setValue("se");
    tick(SEARCH_DEBOUNCE_MS);
    component.search.setValue("sel");
    tick(SEARCH_DEBOUNCE_MS);

    expect(toastr.error).toHaveBeenCalledTimes(1);
    expect(emitted).toEqual([[], [aymen]]);
  }));
});

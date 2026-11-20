import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { AutocompleteComponent, SEARCH_DEBOUNCE_MS } from './autocomplete.component';
import { Cv } from '../model/cv';
import { API } from '../../../config/api.config';

describe('AutocompleteComponent', () => {
  let component: AutocompleteComponent;
  let fixture: ComponentFixture<AutocompleteComponent>;
  let http: HttpTestingController;

  const filterFor = (name: string) => JSON.stringify({ where: { name: { like: `%${name}%` } } });
  const cvA = new Cv(1, 'aymen', 'sellaouti', 'teacher', 'as.jpg', '123456', 40);

  /**
   * Crée le composant. Doit être appelé DANS fakeAsync : sinon le timer du
   * debounceTime est créé hors de la zone fakeAsync et tick() ne le fait pas avancer.
   */
  function setup() {
    fixture = TestBed.createComponent(AutocompleteComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  }
  /** Change le texte saisi puis lance la détection (les effets du composant s'exécutent) */
  function type(value: string) {
    component.search.set(value);
    fixture.detectChanges();
  }
  /** Laisse passer le délai du debounce */
  function settle() {
    tick(SEARCH_DEBOUNCE_MS);
    fixture.detectChanges();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AutocompleteComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
  });

  afterEach(() => http.verify());

  it('sends one request after the user stops typing', fakeAsync(() => {
    setup();
    type('s');
    tick(100);
    type('se');
    settle();
    const req = http.expectOne((r) => r.url === API.cv);
    expect(req.request.params.get('filter')).toBe(filterFor('se'));
    req.flush([cvA]);
    tick(); // la ressource traite la réponse dans une microtâche
    expect(component.results.value()).toEqual([cvA]);
  }));

  it('does not call the API for an empty or blank search', fakeAsync(() => {
    setup();
    type('   ');
    settle();
    http.expectNone((r) => r.url === API.cv);
    expect(component.results.value()).toEqual([]);
  }));

  it('does not re-request when the debounced text is unchanged', fakeAsync(() => {
    setup();
    type('se');
    settle();
    http.expectOne((r) => r.url === API.cv).flush([cvA]);
    tick();
    type('sel');
    tick(100);
    type('se ');
    settle();
    http.expectNone((r) => r.url === API.cv);
  }));

  it('cancels the previous request when a new search starts', fakeAsync(() => {
    setup();
    type('se');
    settle();
    const first = http.expectOne((r) => r.params.get('filter') === filterFor('se'));
    type('sel');
    settle();
    expect(first.cancelled).toBeTrue();
    http.expectOne((r) => r.params.get('filter') === filterFor('sel')).flush([]);
  }));

  describe('template', () => {
    const cvB = new Cv(2, 'skander', 'sellaouti', 'enfant', '', '1234', 4);

    /** Répond à la requête en cours puis met à jour la vue */
    function respond(body: Cv[]) {
      http.expectOne((r) => r.url === API.cv).flush(body);
      tick();
      fixture.detectChanges();
    }

    it('drives the search from the input and lists the results', fakeAsync(() => {
      setup();
      const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
      input.value = 'se';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      settle();
      respond([cvA, cvB]);
      expect(fixture.nativeElement.querySelectorAll('app-item').length).toBe(2);
    }));

    it('shows the clicked cv without any new request', fakeAsync(() => {
      setup();
      type('se');
      settle();
      respond([cvA, cvB]);
      fixture.nativeElement.querySelector('app-item div').click();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('app-cv-info h4').textContent).toContain(
        'Cv aymen sellaouti'
      );
      // afterEach http.verify() prouve qu'aucune autre requête n'a été envoyée
    }));

    it('shows an error when the server fails', fakeAsync(() => {
      setup();
      type('se');
      settle();
      http
        .expectOne((r) => r.url === API.cv)
        .flush('boom', { status: 500, statusText: 'Server Error' });
      tick();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.alert-danger')).not.toBeNull();
    }));
  });
});

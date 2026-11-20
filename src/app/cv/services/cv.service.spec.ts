import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { CvService } from './cv.service';
import { API } from '../../../config/api.config';

describe('CvService', () => {
  let service: CvService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CvService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('selectByName sends the loopback like filter', () => {
    service.selectByName('se').subscribe();
    const req = http.expectOne((r) => r.url === API.cv);
    expect(req.request.params.get('filter')).toBe('{"where":{"name":{"like":"%se%"}}}');
    req.flush([]);
  });

  it('selectByName escapes quotes so the filter stays valid JSON', () => {
    service.selectByName('a"b').subscribe();
    const req = http.expectOne((r) => r.url === API.cv);
    expect(JSON.parse(req.request.params.get('filter')!)).toEqual({
      where: { name: { like: '%a"b%' } },
    });
    req.flush([]);
  });

  it('selectByName escapes LIKE wildcards so they are searched literally', () => {
    service.selectByName('%_\\').subscribe();
    const req = http.expectOne((r) => r.url === API.cv);
    // % et _ sont des jokers en LIKE, \ est le caractère d'échappement : on les préfixe par \
    expect(JSON.parse(req.request.params.get('filter')!).where.name.like).toBe('%\\%\\_\\\\%');
    req.flush([]);
  });
});

import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import {
  Observable,
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  switchMap,
} from "rxjs";
import { Cv } from "../model/cv";
import { CvService } from "../services/cv.service";

/** Délai (ms) d'attente après la dernière frappe avant d'interroger l'API */
export const SEARCH_DEBOUNCE_MS = 300;

@Component({
  selector: "app-autocomplete",
  templateUrl: "./autocomplete.component.html",
  styleUrls: ["./autocomplete.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteComponent {
  private cvService = inject(CvService);
  private toastr = inject(ToastrService);

  /** Champ de recherche (nonNullable : sa valeur est toujours une string) */
  search = new FormControl("", { nonNullable: true });

  /**
   * Cvs dont le nom contient le texte saisi.
   * - debounceTime : on attend que l'utilisateur arrête de taper
   * - distinctUntilChanged : pas de nouvel appel si le texte n'a pas changé
   * - switchMap : une nouvelle recherche annule la requête précédente
   * - recherche vide : liste vide, sans appel HTTP
   */
  cvs$: Observable<Cv[]> = this.search.valueChanges.pipe(
    debounceTime(SEARCH_DEBOUNCE_MS),
    map((text) => text.trim()),
    distinctUntilChanged(),
    switchMap((text) => (text ? this.searchByName(text) : of([])))
  );

  /** Cv sélectionné au clic sur un item de la liste : déjà en mémoire, pas d'appel HTTP */
  selectedCv$ = this.cvService.selectCv$;

  /**
   * Le catchError est sur la requête interne et non sur cvs$ :
   * une erreur serveur ne termine pas le flux, la recherche suivante fonctionne toujours.
   */
  private searchByName(text: string): Observable<Cv[]> {
    return this.cvService.selectByName(text).pipe(
      catchError(() => {
        this.toastr.error("Problème avec le serveur, réessayez plus tard.");
        return of([]);
      })
    );
  }
}

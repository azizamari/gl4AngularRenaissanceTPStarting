import { Component, inject, ChangeDetectionStrategy, computed, signal } from "@angular/core";
import { rxResource, toObservable, toSignal } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { debounceTime, distinctUntilChanged, map } from "rxjs";
import { CvService } from "../services/cv.service";
import { ListComponent } from "../list/list.component";
import { CvInfoComponent } from "../cv-info/cv-info.component";

/** Délai (ms) d'attente après la dernière frappe avant d'interroger l'API */
export const SEARCH_DEBOUNCE_MS = 300;

@Component({
  selector: "app-autocomplete",
  templateUrl: "./autocomplete.component.html",
  styleUrls: ["./autocomplete.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ListComponent, CvInfoComponent],
})
export class AutocompleteComponent {
  private cvService = inject(CvService);

  /** Texte saisi par l'utilisateur, à chaque frappe */
  search = signal("");

  /**
   * Texte saisi (sans espaces autour), émis seulement après SEARCH_DEBOUNCE_MS sans frappe
   * et seulement s'il a changé depuis la dernière émission.
   * Un signal n'a pas de notion de temps : on passe par RxJS pour le debounce.
   */
  private debouncedSearch = toSignal(
    toObservable(this.search).pipe(
      debounceTime(SEARCH_DEBOUNCE_MS),
      map((text) => text.trim()),
      distinctUntilChanged()
    ),
    { initialValue: "" }
  );

  /**
   * Cvs dont le nom contient le texte recherché.
   * - params undefined (recherche vide) => la ressource reste inactive, aucun appel HTTP
   * - un nouveau texte annule la requête précédente (comme switchMap)
   */
  results = rxResource({
    params: () => this.debouncedSearch() || undefined,
    stream: ({ params }) => this.cvService.selectByName(params),
    defaultValue: [],
  });

  /**
   * Liste affichée. En cas d'erreur serveur, lire results.value() lève une exception :
   * on affiche alors une liste vide (le message d'erreur est géré par le template).
   */
  cvs = computed(() => (this.results.hasValue() ? this.results.value() : []));

  /** Cv sélectionné (au clic sur un item de la liste), déjà en mémoire : pas d'appel HTTP */
  selectedCv = this.cvService.selectedCv;

  constructor() {
    // La sélection est partagée avec la page /cv : on repart d'une page de recherche vide
    this.cvService.clearSelection();
  }
}

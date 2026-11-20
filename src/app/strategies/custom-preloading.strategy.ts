import { Injectable } from "@angular/core";
import { PreloadingStrategy, Route } from "@angular/router";
import { Observable, of } from "rxjs";

/**
 * Stratégie de préchargement sélective (Opt-in).
 * Ne précharge en arrière-plan que les routes ayant la propriété `data: { preload: true }`.
 * Les routes lourdes ou d'administration ne sont donc jamais préchargées inutilement.
 */
@Injectable({
  providedIn: "root",
})
export class CustomPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    return route.data && route.data["preload"] ? load() : of(null);
  }
}

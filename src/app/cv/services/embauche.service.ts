import { Injectable, signal } from '@angular/core';
import { Cv } from '../model/cv';

@Injectable({
  providedIn: 'root',
})
export class EmbaucheService {
  /**
   * Signal privé — seul le service peut modifier la liste
   */
  #embauchees = signal<Cv[]>([]);
  /**
   * Signal public en lecture seule — les composants ne font que lire
   */
  embauchees = this.#embauchees.asReadonly();

  /**
   *
   * Embauche une personne si elle ne l'est pas encore
   * Sinon il retourne false
   *
   * @param cv : Cv
   * @returns boolean
   */
  embauche(cv: Cv): boolean {
    if (!this.#embauchees().includes(cv)) {
      // update() crée un NOUVEAU tableau → la référence change → le signal notifie
      // push() muterait le même tableau → la référence ne change pas → le signal ne voit rien
      this.#embauchees.update(list => [...list, cv]);
      return true;
    }
    return false;
  }
}

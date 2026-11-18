import { ChangeDetectionStrategy, Component, computed, linkedSignal, signal } from '@angular/core';
import { PRODUCTS } from './product.data';

@Component({
  selector: 'app-products-filter',
  imports: [],
  standalone: true,
  templateUrl: './products-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './products-filter.component.css',
})
export class ProductsFilterComponent {
  readonly products = PRODUCTS;
  protected categories = Array.from(new Set(this.products.map((p) => p.category)));

  // Source déclenchant la réinitialisation déclarative
  private resetTrigger = signal(0);

  // Signaux réinitialisables déclarativement grâce à linkedSignal
  protected search = linkedSignal({
    source: this.resetTrigger,
    computation: () => '',
  });

  protected category = linkedSignal({
    source: this.resetTrigger,
    computation: () => '',
  });

  // Computed combinant search, category et la liste des produits
  protected filteredProducts = computed(() => {
    const s = this.search().toLowerCase().trim();
    const c = this.category();
    return this.products.filter((p) => {
      const matchesSearch = !s || p.name.toLowerCase().includes(s);
      const matchesCategory = !c || p.category === c;
      return matchesSearch && matchesCategory;
    });
  });

  protected onSearchChange(event: Event) {
    this.search.set((event.target as HTMLInputElement).value);
  }

  protected onCategoryChange(event: Event) {
    this.category.set((event.target as HTMLSelectElement).value);
  }

  protected reset() {
    this.resetTrigger.update((n) => n + 1);
  }
}


import { Component } from "@angular/core";
import { BehaviorSubject, Observable, concatMap, takeWhile, scan } from "rxjs";
import { Product } from "./dto/product.dto";
import { ProductService } from "./services/product.service";
import { Settings } from "./dto/product-settings.dto";

/** What the page needs: the products loaded so far and how many exist in total. */
interface ProductsState {
  products: Product[];
  total: number;
}

const PAGE_SIZE = 12;

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
})
export class ProductsComponent {
  /** Each value is a request for one page. The initial value loads the first page. */
  private settings$ = new BehaviorSubject<Settings>({ limit: PAGE_SIZE, skip: 0 });

  state$: Observable<ProductsState> = this.settings$.pipe(
    // One HTTP call per requested page, in order, none cancelled.
    concatMap((settings) => this.productService.getProducts(settings)),
    // Stop once the last page has arrived (true = still emit that last page).
    // The stream completes, so later clicks no longer reach the API.
    takeWhile((response) => response.skip + response.limit < response.total, true),
    // Append each page to the products already loaded.
    scan(
      (state: ProductsState, response) => ({
        products: [...state.products, ...response.products],
        total: response.total,
      }),
      { products: [], total: 0 }
    )
  );

  constructor(private productService: ProductService) {}

  loadMore(): void {
    const { limit, skip } = this.settings$.value;
    this.settings$.next({ limit, skip: skip + limit });
  }
}

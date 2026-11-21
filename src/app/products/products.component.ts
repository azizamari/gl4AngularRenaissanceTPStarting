import { Component } from "@angular/core";
import { BehaviorSubject, Observable, concatMap, takeWhile, scan } from "rxjs";
import { Product } from "./dto/product.dto";
import { ProductService } from "./services/product.service";
import { Settings } from "./dto/product-settings.dto";


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

  private settings$ = new BehaviorSubject<Settings>({ limit: PAGE_SIZE, skip: 0 });

  state$: Observable<ProductsState> = this.settings$.pipe(
    
    concatMap((settings) => this.productService.getProducts(settings)),
  
    takeWhile((response) => response.skip + response.limit < response.total, true),
    
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

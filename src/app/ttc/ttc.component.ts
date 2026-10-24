import { Component, computed, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ttc',
  templateUrl: './ttc.component.html',
  imports: [FormsModule, CurrencyPipe],
})
export class TtcComponent {
  price = signal(0);
  quantity = signal(1);
  tva = signal(18);

  unitPriceTtc = computed(() => this.price() * (1 + this.tva() / 100));

  discountRate = computed(() => {
    const q = this.quantity();
    if (q > 15) return 0.3;
    if (q > 10) return 0.2;
    return 0;
  });

  discount = computed(() => this.unitPriceTtc() * this.quantity() * this.discountRate());

  totalTtc = computed(() => this.unitPriceTtc() * this.quantity() - this.discount());
}
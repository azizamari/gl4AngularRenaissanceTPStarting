import { Component, computed, signal } from '@angular/core';
import { countries } from '../data/countries';

@Component({
  selector: 'app-country-currency-selector',
  imports: [],
  standalone: true,
  templateUrl: './country-currency-selector.component.html',
  styleUrl: './country-currency-selector.component.css',
})
export class CountryCurrencySelectorComponent {
  countries = signal(countries);

  selectedCountryName = signal(countries[0].name);

  currencies = computed(
    () =>
      this.countries().find((c) => c.name === this.selectedCountryName())
        ?.acceptedCurrencies ?? [],
  );

  onCountryChange(event: Event) {
    this.selectedCountryName.set((event.target as HTMLSelectElement).value);
  }
}
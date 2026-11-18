import { Component, computed, linkedSignal, signal } from '@angular/core';
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

  selectedCountry = computed(
    () => this.countries().find((c) => c.name === this.selectedCountryName())!,
  );

  currencies = computed(
    () => this.selectedCountry()?.acceptedCurrencies ?? [],
  );

  selectedCurrency = linkedSignal({
    source: () => this.selectedCountry(),
    computation: (country, previous: { value: string } | undefined) => {
      if (previous && country.acceptedCurrencies.includes(previous.value)) {
        return previous.value;
      }
      return country.defaultCurrency || country.acceptedCurrencies[0];
    },
  });

  onCountryChange(event: Event) {
    this.selectedCountryName.set((event.target as HTMLSelectElement).value);
  }

  onCurrencyChange(event: Event) {
    this.selectedCurrency.set((event.target as HTMLSelectElement).value);
  }
}

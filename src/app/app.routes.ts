import { Routes } from "@angular/router";
import { FrontComponent } from "./templates/front/front.component";
import { authGuard } from "./auth/guards/auth.guard";
import { CvComponent } from "./cv/cv/cv.component";

export const routes: Routes = [
  // --- ROUTES FRÉQUEMMENT VISITÉES (EAGER LOADING) ---
  // Page Cv principale : Cœur fonctionnel de l'application, chargée immédiatement
  { path: "cv", component: CvComponent },

  // --- ROUTES RAREMENT VISITÉES OU SPÉCIALISÉES (LAZY LOADING) ---
  // Authentification : visitée ponctuellement pour se connecter
  {
    path: "login",
    loadComponent: () =>
      import("./auth/login/login.component").then((m) => m.LoginComponent),
  },

  // Page RH : très lourde car elle embarque Chart.js et Plotly.js (isolée dans son chunk)
  {
    path: "rh",
    loadComponent: () =>
      import("./optimizationPattern/rh/rh.component").then((m) => m.RhComponent),
  },

  // Pages d'exercices TP2
  {
    path: "currency",
    loadComponent: () =>
      import("./tp2/currency-selector/country-currency-selector.component").then(
        (m) => m.CountryCurrencySelectorComponent
      ),
  },
  {
    path: "products-filter",
    loadComponent: () =>
      import("./tp2/products-filter/products-filter.component").then(
        (m) => m.ProductsFilterComponent
      ),
  },

  // Ajout de CV : formulaire protégé par authGuard, préchargé de manière sélective
  {
    path: "cv/add",
    loadComponent: () =>
      import("./cv/add-cv/add-cv.component").then((m) => m.AddCvComponent),
    canActivate: [authGuard],
    data: { preload: true },
  },

  // Détails CV : suite logique de la consultation de la liste, préchargé sélectivement
  {
    path: "cv/:id",
    loadComponent: () =>
      import("./cv/details-cv/details-cv.component").then(
        (m) => m.DetailsCvComponent
      ),
    data: { preload: true },
  },

  // Accueil : FrontComponent sert de conteneur eager avec menu/layout, ses sous-pages sont lazy
  {
    path: "",
    component: FrontComponent,
    children: [
      {
        path: "todo",
        loadComponent: () =>
          import("./todo/todo/todo.component").then((m) => m.TodoComponent),
      },
      {
        path: "word",
        loadComponent: () =>
          import("./directives/mini-word/mini-word.component").then(
            (m) => m.MiniWordComponent
          ),
      },
    ],
  },

  // Espace administration : réservé aux administrateurs
  {
    path: "admin",
    loadComponent: () =>
      import("./templates/admin/admin.component").then((m) => m.AdminComponent),
    children: [
      {
        path: "color",
        loadComponent: () =>
          import("./components/color/color.component").then(
            (m) => m.ColorComponent
          ),
      },
    ],
  },

  // Page 404 introuvable : affichée uniquement en cas d'erreur d'URL
  {
    path: "**",
    loadComponent: () =>
      import("./components/nf404/nf404.component").then((m) => m.NF404Component),
  },
];

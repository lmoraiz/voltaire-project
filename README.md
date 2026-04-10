# voltaire-project

## Architecture

Une application full-stack de gestion de produits avec un frontend Vue, un backend Express/Node.js et une base de données PostgreSQL — le tout conteneurisé avec Docker Compose.

En production, le serveur Express sert à la fois l'API REST et le frontend compilé sous forme de fichiers statiques, depuis un unique processus sur le port 3000.

```
┌─────────────────────────────────────────────┐
│               Docker Compose                │
│                                             │
│  ┌──────────────────────┐  ┌─────────────┐  │
│  │      app (port 3000) │  │  db         │  │
│  │                      │  │ (PostgreSQL)│  │
│  │  ┌────────────────┐  │  │             │  │
│  │  │  Vue 3 SPA     │  │  │  products   │  │
│  │  │  (static dist) │  │  │  table      │  │
│  │  └────────────────┘  │  │             │  │
│  │  ┌────────────────┐  │  └──────┬──────┘  │
│  │  │  Express API   │◄─┼─────────┘         │
│  │  │  /api/*        │  │  pg.Pool          │
│  │  └────────────────┘  │  (DB_HOST=db)     │
│  └──────────────────────┘                   │
└─────────────────────────────────────────────┘
         ▲
         │
    Browser (User)
```

## Guide dévelopement et utilisation  

Pour lancer le projet. Il suffit de lancer cette commande à la racine : \
`docker compose up --build`

Puis lancer http://localhost:3000/ dans votre browser.

### Dévelopement front

Dans le dossier frontend :\
- ` npm i `
- ` npm run dev `

### Dévelopement back

A la racine lancer la base de données via : \
`docker compose up db -d`

Puis dans le dossier backend : \
- ` npm i `
- ` npm run start:dev `

## Choix techniques

### Base de données
Une base de données SQL convient parfaitement pour une application interne qui catalogue des produits avec des champs définis. De plus, si on veut faire des relations avec d'autres tables dans le futur, comme un fournisseur par exemple. \
Si jamais on veut ajouter de la pagination, filtres, c'est plus simple à implémenter en SQL. De plus, les fonctions d'agrégation peuvent être très utiles pour faire l'inventaire des stocks.\

PostgreSQL vs SQLite. \
J'ai choisi PostgreSQL car bien plus robuste que SQLite pour un outil interne utilisé par plusieurs personnes. Cependant, pour le test j'aurais pu utiliser SQLite.

### Frontend  
J'ai choisi Vue.js parce que je voulais une app en client site, comme que les performances et l'indexation pour les moteurs de recherche ne sont pas les priorités. \
Pourquoi Vue.js et pas un autre, parce que c'est très léger par rapport à Angular et que je voulais essayer ce framework.

### Backend
J'ai choisi Express car c'est très léger et personnalisable via l'ajout de packages npm pour un typage à la compilation (TypeScript) et à la validation (Zod).\

Cela me permet aussi d'avoir un seul serveur qui expose les routes de l'API et le bundle de mon frontend. Ce qui suffit largement pour ce projet et même pour un intranet avec peu de trafic.

## Limitations

- OpenAPI spec et génération du code pour les routes (facilement faisable via Swagger-UI-express et open-api-generator)
- Pas d'ORM donc requête écrite manuellement, cependant c'est rajoutable via des packages comme Prisma
- Scalabilité, si jamais l'API et/ou grossis beaucoup, on risque d'avoir des performances réduites.
- Si on a besoin de beaucoup plus de features, autant utiliser des frameworks plus robustes comme Spring Boot et Angular que rajouter plein de packages npm.
- Authentification implementé mais pas l'authorization.
- Pas de log dans le back pour analyser l'utilisation de l'API
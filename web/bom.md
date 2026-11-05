# Bibliotecas e ferramentas da aplicação web

## Executadas no navegador

| Biblioteca | Versão | Uso | Carregamento |
| --- | --- | --- | --- |
| [MapLibre GL JS](https://maplibre.org/) | 6.16.0 | Renderizar o mapa, controles, camadas e dados GeoJSON. | ES module e CSS via unpkg |
| [Turf.js `@turf/buffer`](https://turfjs.org/) | 7.2.0 | Criar a área de tolerância ao redor do limite municipal. | ES module via jsDelivr |
| [Turf.js `@turf/boolean-point-in-polygon`](https://turfjs.org/) | 7.2.0 | Verificar se a localização está dentro da área municipal com buffer. | ES module via jsDelivr |

## Desenvolvimento

| Biblioteca/ferramenta | Versão | Uso |
| --- | --- | --- |
| [ESLint](https://eslint.org/) | 10.14.0 | Análise estática do JavaScript. |
| [@eslint/js](https://www.npmjs.com/package/@eslint/js) | 10.0.1 | Regras recomendadas do ESLint. |
| [globals](https://www.npmjs.com/package/globals) | 17.14.0 | Definições de variáveis globais usadas na configuração do ESLint. |
| [Prettier](https://prettier.io/) | 3.9.10 | Formatação e verificação de estilo. |

As versões das ferramentas de desenvolvimento correspondem ao lockfile npm.
O código da interface não usa framework; HTML5, CSS3, GeoJSON e Web App
Manifest são tecnologias e formatos da plataforma, não bibliotecas externas.
A localização usa a API de Geolocalização nativa do navegador.

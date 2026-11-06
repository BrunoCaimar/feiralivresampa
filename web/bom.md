# Bibliotecas e ferramentas da aplicação web

## Executadas no navegador

| Biblioteca | Versão | Licença | Uso | Carregamento |
| --- | --- | --- | --- | --- |
| [MapLibre GL JS](https://maplibre.org/) | 6.16.0 | BSD-3-Clause | Renderizar o mapa, controles, camadas e dados GeoJSON. | ES module e CSS via unpkg |
| Turf.js [`@turf/buffer`](https://turfjs.org/) | 7.2.0 | MIT | Criar a área de tolerância ao redor do limite municipal. | ES module via jsDelivr |
| Turf.js [`@turf/boolean-point-in-polygon`](https://turfjs.org/) | 7.2.0 | MIT | Verificar se a localização está dentro da área municipal com buffer. | ES module via jsDelivr |

## Desenvolvimento

| Biblioteca/ferramenta | Versão | Licença | Uso |
| --- | --- | --- | --- |
| [ESLint](https://eslint.org/) | 10.14.0 | MIT | Análise estática do JavaScript. |
| [@eslint/js](https://www.npmjs.com/package/@eslint/js) | 10.0.1 | MIT | Regras recomendadas do ESLint. |
| [globals](https://www.npmjs.com/package/globals) | 17.14.0 | MIT | Definições de variáveis globais usadas na configuração do ESLint. |
| [Prettier](https://prettier.io/) | 3.9.10 | MIT | Formatação e verificação de estilo. |

As versões das ferramentas de desenvolvimento correspondem ao lockfile npm.
O código da interface não usa framework; HTML5, CSS3, GeoJSON e Web App
Manifest são tecnologias e formatos da plataforma, não bibliotecas externas.
A localização usa a API de Geolocalização nativa do navegador.

## Serviços externos

| Serviço | Uso | Licença/termos aplicáveis |
| --- | --- | --- |
| [MapTiler](https://www.maptiler.com/) | Estilo e tiles do mapa de base, com dados cartográficos do [OpenStreetMap](https://www.openstreetmap.org/). | Serviço sujeito aos [termos do MapTiler](https://www.maptiler.com/terms/); os dados do OpenStreetMap são licenciados sob [ODbL 1.0](https://www.openstreetmap.org/copyright). |
| [OpenRouteService](https://openrouteservice.org/) | API para calcular rotas ponto a ponto. | Serviço sujeito aos termos de uso e às condições do plano do provedor; não é uma licença de software. |
| [GeoSampa](https://novogeosampa.prefeitura.sp.gov.br/) | Fonte dos dados abertos das feiras; os dados usados pela aplicação são mantidos localmente em GeoJSON. | Dados das feiras sob [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). |
| [IBGE](https://servicodados.ibge.gov.br/api/v3/malhas/municipios/3550308?formato=application%2Fvnd.geo%2Bjson&qualidade=maxima&projecao=4674) | API de malhas municipais usada para obter o limite do município de São Paulo, mantido localmente em GeoJSON. | Dados geográficos atribuídos ao IBGE; consulte as condições de uso e atribuição da fonte. |
| [GitHub](https://github.com/) | Hospedagem do repositório, do favicon e das imagens de marcadores carregadas de `raw.githubusercontent.com`. | Serviço sujeito aos [Termos de Serviço do GitHub](https://docs.github.com/en/site-policy/github-terms/github-terms-of-service); as licenças do conteúdo hospedado variam conforme cada arquivo. |
| [Google Maps](https://maps.google.com/) | Abertura de rotas em um serviço externo. | Sujeito aos [termos do Google Maps Platform](https://cloud.google.com/maps-platform/terms). |
| [unpkg](https://unpkg.com/) | Distribuição do MapLibre GL JS e de seu CSS. | Serviço de distribuição; a licença do código distribuído é a da biblioteca correspondente, indicada nas tabelas acima. |
| [jsDelivr](https://www.jsdelivr.com/) | Distribuição dos módulos Turf.js. | Serviço de distribuição; a licença do código distribuído é a da biblioteca correspondente, indicada nas tabelas acima. |

O mapa, o cálculo de trajetos e os recursos carregados por CDN dependem de
conexão com a internet. As chaves de acesso das APIs usadas no navegador devem
ser configuradas com as restrições e os limites de uso apropriados.

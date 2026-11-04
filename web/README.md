# Aplicação web Feira Livre Sampa

Aplicação web que exibe feiras livres da cidade de São Paulo em um mapa. É possível filtrar as feiras por dia da semana, consultar detalhes de cada feira, usar a localização do navegador e visualizar uma sugestão de trajeto a pé.

## Arquivos

- `index.html`: arquivo principal da aplicação.
- `styles.css`: estilos da interface.
- `feira_livre.js`: código javascript da aplicação.
- `data/equipamento_feira_livre.geojson`: dados das feiras exibidos no mapa.
- `images/`: imagens usadas pela aplicação.

Os dados GeoJSON são obtidos pelo script em `scripts/` e copiados para `web/data`. Consulte [`../scripts/README.MD`](../scripts/README.MD) para instruções de atualização.

## Tecnologias e bibliotecas

- **HTML5, CSS3 e JavaScript (ES modules):** estrutura, estilos e interações da aplicação, sem framework de interface.
- **MapLibre GL JS 6.16.0:** renderização do mapa interativo e das camadas GeoJSON.
- **GeoJSON:** formato dos dados das feiras carregados em `data/equipamento_feira_livre.geojson`.
- **API de Geolocalização do navegador:** obtenção da localização do usuário, mediante permissão do navegador.
- **ESLint e Prettier:** análise estática e formatação dos arquivos do frontend.

## Serviços externos

- **MapTiler:** estilo e mapas de base.
- **OpenRouteService:** cálculo de trajetos a pé.
- **Google Maps:** abertura de rotas externas.
- **GeoSampa:** fonte dos dados abertos das feiras livres.
- **unpkg:** distribuição do MapLibre GL JS e de seus estilos.
- **GitHub:** repositório, favicon e imagens de marcadores carregados externamente.

O mapa e alguns recursos dependem de conexão com esses serviços. As chaves de acesso dos provedores usadas pelo frontend são entregues ao navegador; configure restrições e limites de uso nos respectivos provedores.

## Executar localmente

Sirva a pasta `web` por HTTP:

```sh
cd web
python3 -m http.server 8000
```

Abra <http://localhost:8000> no navegador. O acesso à internet é necessário para carregar o mapa e os serviços externos.

## Ferramentas de desenvolvimento

Instale as dependências JavaScript a partir desta pasta:

```sh
npm install
```

Verifique o JavaScript com ESLint:

```sh
npm run lint
```

Formate os arquivos JavaScript, HTML e CSS:

```sh
npm run format
```

Confira a formatação sem modificar os arquivos:

```sh
npm run format:check
```

## TO DO

- Botão compartilhar
- PWA
- Responsividade - checar com co-piloto
- Github pages
- Versão
- Zoom menor ao abrir na localização

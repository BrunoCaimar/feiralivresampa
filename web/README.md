# Aplicação web Feira Livre Sampa

Aplicação web que exibe feiras livres da cidade de São Paulo em um mapa. É possível filtrar as feiras por dia da semana, consultar detalhes de cada feira, usar a localização do navegador e visualizar uma sugestão de trajeto a pé.

## Arquivos

- `index.html`: arquivo principal da aplicação.
- `styles.css`: estilos da interface.
- `feira_livre.js`: código javascript da aplicação.
- `data/equipamento_feira_livre.geojson`: dados das feiras exibidos no mapa.
- `images/`: imagens usadas pela aplicação.

Os dados GeoJSON são obtidos pelo script em `scripts/` e copiados para `web/data`. Consulte [`../scripts/README.MD`](../scripts/README.MD) para instruções de atualização.

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


# Scripts do projeto feira livre sampa

Essa pasta contém os scripts python utilizados pelo projeto.

## Instalando o ambiente de execução

### Pré-requisitos

- Python 3.14 ou superior
- UV 0.11 ou superior

### Iniciando o ambiente

Para iniciar siga os seguintes passos:

1 - Sincronize seu ambiente utilizando o uv

```sh
uv sync
```

2 - Ative o ambiente virtual criado

```sh
source .venv/bin/activate
````

3 - Valide o ambiente

```sh
uv run main.py
```

## Verificando o código com Ruff

Execute o verificador a partir desta pasta:

```sh
uv run ruff check .
```

### Obtendo os dados das feiras livres

O script `obter_dados_feiras_livres.py` obtém os dados das feiras livres disponibilizados pela API do GeoSampa. Isso é feito através de uma requisição HTTP, solicitando apenas os dados de feiras livres no formato GeoJSON e no sistema de coordenadas WGS84.

O timeout dessa requisição está definido em 30 segundos. Respostas HTTP com erro interrompem a execução. Os dados são salvos em um arquivo chamado `equipamento_feira_livre.geojson` na pasta `scripts/data`. Depois, esse mesmo arquivo é copiado para a pasta `web/data`, para uso pela aplicação web.

### Configuração

O arquivo `config.py` centraliza os valores utilizados pelo script de obtenção dos dados:

- `url_geosampa_download`: endereço do serviço de download do GeoSampa, que
  recebe a requisição HTTP.
- `url_geosampa_geoserver`: endereço do GeoServer usado na solicitação WFS.
- `feira_livre_layer_id`: identificador da camada de feiras livres no GeoSampa.
- `output_srid_wgs84`: sistema de coordenadas solicitado; atualmente `EPSG:4326`
  (WGS84).
- `nome_arquivo_saida`: nome do arquivo GeoJSON gerado.
- `pasta_destino_saida`: pasta dentro de `scripts` onde o arquivo é salvo.

Os valores de configuração nesse arquivo para atualizar os parâmetros sem modificar a lógica do script.

Execute o script a partir da pasta `scripts`:

```sh
uv run obter_dados_feiras_livres.py
````

## TO DO

- Timestamp para marcar data de última execução
- Github action para executar o script periodicamente

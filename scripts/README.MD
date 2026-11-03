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

O script `obter_dados_feiras_livres.py` obtém os dados das feiras livres
disponibilizados pelo GeoSampa e solicita o resultado no formato GeoJSON, usando
o sistema de coordenadas WGS84 (definido na configuração).

Após receber a resposta, o script salva o arquivo `equipamento_feira_livre.geojson`
na pasta `scripts/data` e copia uma versão para `web/data`, onde pode ser utilizada
pela aplicação web.
O timeout definido para obtenção dos dados é de 30 segundos e erros HTTP interrompem a execução.

Os parâmetros do serviço, o nome do arquivo, a pasta de saída e o sistema de
coordenadas estão definidos em `config.py`.

### Configuração

O arquivo `config.py` centraliza os valores usados pelo script de obtenção de
dados:

- `url_geosampa`: endereço do serviço GeoSampa que recebe a requisição.
- `url_geoserver`: endereço do GeoServer de onde os dados das feiras são solicitados.
- `feira_livre_layer_id`: identificador da camada de feiras livres no GeoSampa.
- `nome_arquivo_saida`: nome do arquivo GeoJSON gerado.
- `pasta_destino_saida`: pasta dentro de `scripts` onde o arquivo é salvo.
- `output_srid_wgs84`: sistema de coordenadas solicitado para os dados.

Altere esses valores nesse arquivo para atualizar os parâmetros sem modificar a
lógica do script.

Execute o script a partir da pasta `scripts`:

```sh
uv run obter_dados_feiras_livres.py
````

## TO DO

- Timestamp para marcar data de última execução
- Github action para executar o script periodicamente

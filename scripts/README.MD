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

### Executando o script de de obtenção dos dados

```sh
uv run obter_dados_feiras_livres.py
````

## TO DO

- Timestamp para marcar data de última execução
- 
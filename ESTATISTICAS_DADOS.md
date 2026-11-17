# Estatísticas dos dados das feiras livres

Este documento resume o arquivo
[`web/data/equipamento_feira_livre.geojson`](web/data/equipamento_feira_livre.geojson).
Os números são uma fotografia dos dados disponíveis no arquivo e devem ser
recalculados quando ele for atualizado.

## Referência

- **Fonte:** [GeoSampa](https://novogeosampa.prefeitura.sp.gov.br/), Prefeitura
  de São Paulo.
- **Data dos dados no GeoJSON:** 5 de novembro de 2026, às 12:55 UTC
  (09:55 no horário de Brasília).
- **Sistema de coordenadas:** WGS 84 (EPSG:4326).
- **Licença dos dados das feiras:** [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
- **Registros analisados:** 975 feições do tipo `Point`.

## Distribuição por dia de funcionamento

| Dia | Registros | Percentual |
| --- | ---: | ---: |
| Domingo | 205 | 21,0% |
| Segunda-feira | 0 | 0,0% |
| Terça-feira | 133 | 13,6% |
| Quarta-feira | 161 | 16,5% |
| Quinta-feira | 141 | 14,5% |
| Sexta-feira | 140 | 14,4% |
| Sábado | 195 | 20,0% |
| **Total** | **975** | **100,0%** |

## Categorias de feira

| Categoria | Código | Registros | Percentual |
| --- | --- | ---: | ---: |
| Tradicional | `T` | 931 | 95,5% |
| Noturna | `N` | 31 | 3,2% |
| Orgânica | `O` | 13 | 1,3% |
| **Total** |  | **975** | **100,0%** |

## Quantidade de barracas

A quantidade total abaixo é a soma dos valores registrados em cada feição;
registros em dias diferentes podem corresponder à mesma feira.

- **Soma registrada:** 46.248 barracas.
- **Média por registro:** 47,4 barracas.
- **Mediana:** 38 barracas.
- **Menor valor:** 0.
- **Maior valor:** 224.

### Registros com maiores quantidades

| Feira | Dia | Barracas |
| --- | --- | ---: |
| Vila Mara | Domingo | 224 |
| Bosque | Domingo | 215 |
| Aclimação | Sábado | 199 |

### Registros com menores quantidades

Há 34 registros com zero barracas. A tabela lista três deles, em ordem
alfabética pelo nome:

| Feira | Dia | Barracas |
| --- | --- | ---: |
| Antonio Eneas Matias | Terça-feira | 0 |
| Carvaxi | Domingo | 0 |
| CDHU Conjunto Hab Guaianases | Domingo | 0 |

## Nomes, endereços e coordenadas

- **Nomes distintos:** 874.
- **Coordenadas distintas:** 963.
- **Coordenadas compartilhadas por mais de um registro:** 12.
- **Registros sem endereço preenchido:** 10.
- **Limites das coordenadas observadas:** longitude de -46,8033 a -46,3671;
  latitude de -23,8773 a -23,3970.

Os totais representam registros presentes na fonte, não necessariamente
quantidades de feiras ou locais únicos: uma feira pode ocorrer em mais de um
dia, e mais de um registro pode compartilhar coordenadas.

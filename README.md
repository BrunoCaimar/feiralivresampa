# Feira Livre Sampa

Aplicação web para visualizar a localização das feiras livres na cidade de São Paulo.

## Funcionalidades

- Mapa interativo com os pontos das feiras livres.
- Filtros para exibir feiras por dia da semana.
- Detalhes da feira selecionada, incluindo endereço, horário e quantidade de
  barracas quando essas informações estão disponíveis nos dados.
- Localização do usuário e cálculo de trajeto a pé, mediante permissão do
  navegador e disponibilidade dos serviços externos.
- Link para abrir o trajeto no Google Maps.
- Menu com controle da legenda, informações sobre o projeto e acesso ao
  repositório.

## Tecnologias e serviços

- **Frontend:** HTML5, CSS3 e JavaScript com módulos ES, sem framework de
  interface.
- **Mapa:** MapLibre GL JS 6.16.0 e dados GeoJSON.
- **Dados:** camada de feiras livres do GeoSampa, em coordenadas WGS84
  (`EPSG:4326`).
- **Scripts de dados:** Python 3.14 ou superior, `requests` e `geopandas`.
- **Qualidade de código:** Ruff para Python; ESLint e Prettier para o frontend.
- **Serviços externos:** MapTiler para o mapa-base, OpenRouteService para
  trajetos a pé e Google Maps para abrir rotas.

O mapa e os serviços de rota precisam de conexão com a internet. A localização
depende da permissão do usuário e de um contexto seguro do navegador, como
`localhost` ou HTTPS. As chaves dos serviços usadas pelo frontend são entregues
ao navegador; configure restrições e limites de uso nos provedores.

## Pré-requisitos

- Python 3.14 ou superior e [uv](https://docs.astral.sh/uv/) 0.11 ou superior
  para atualizar os dados.
- Node.js e npm para executar ESLint e Prettier.
- Um navegador moderno e acesso à internet para usar o mapa e os serviços
  externos.

## Executar a aplicação web

Sirva a pasta `web` por HTTP:

```sh
cd web
python3 -m http.server 8000
```

Abra <http://localhost:8000>. A geolocalização pode solicitar permissão do
navegador.

Consulte [`web/README.md`](web/README.md) para detalhes sobre as tecnologias,
serviços e ferramentas do frontend.

## Publicar no GitHub Pages

O workflow [Deploy to GitHub Pages](.github/workflows/deploy-pages.yml) publica
automaticamente o conteúdo de `web/` após um push na branch padrão. Também é
possível iniciá-lo manualmente pela aba **Actions** do GitHub. O site deverá
ficar disponível em <https://brunocaimar.github.io/feiralivresampa/>.

Na primeira publicação:

1. Abra **Settings → Pages** no repositório.
2. Em **Build and deployment**, selecione **GitHub Actions** como fonte.
3. Na aba **Actions**, aguarde a execução do workflow terminar e abra o link
   publicado no ambiente `github-pages`.

O site é estático: chaves usadas no frontend ficam acessíveis aos visitantes.
Configure restrições de domínio e limites de uso nos provedores de mapas e
rotas; não coloque segredos no repositório ou no workflow esperando ocultá-los
do código entregue ao navegador.

## Atualizar os dados das feiras

Execute o script a partir da pasta `scripts`:

```sh
cd scripts
uv sync
uv run obter_dados_feiras_livres.py
```

O script consulta o GeoSampa, solicita os dados no formato GeoJSON e no sistema
WGS84, salva o resultado em `scripts/data/` e o copia para `web/data/`. A
requisição tem timeout de 30 segundos; respostas HTTP com erro interrompem a
execução.

Para ajustar endpoints, camada, sistema de coordenadas ou nome do arquivo,
edite `scripts/config.py`. Mais detalhes estão em
[`scripts/README.MD`](scripts/README.MD).

## Adaptando essa aplicação para outras cidades

Consulte o guia [Adaptando a aplicação para outras cidades](ADAPTAR_OUTRAS_CIDADES.md).

## Como contribuir

Contribuições são bem-vindas. Para propor uma mudança:

1. Abra uma issue para relatar um problema ou discutir uma melhoria relevante.
2. Crie um fork do repositório e uma branch para sua alteração.
3. Faça mudanças focadas, atualize a documentação relacionada e verifique a
   aplicação localmente.
4. Envie um pull request descrevendo o que mudou e como a alteração foi
   verificada.

Não inclua credenciais, chaves privadas ou outros dados sensíveis nas
contribuições. Ao contribuir, considere os termos da AGPL-3.0 e as atribuições
e condições de licença dos dados descritas abaixo.

## Dados e licenças

Os dados das feiras livres são obtidos do portal de dados abertos da Prefeitura
do Município de São Paulo, por meio do
[GeoSampa](https://metadados.geosampa.prefeitura.sp.gov.br/geonetwork/srv/por/catalog.search#/metadata/bd6e68ad-aba4-4841-af4d-e1c6dfc1057f),
e estão licenciados sob
[Creative Commons Atribuição-CompartilhaIgual 4.0 Internacional (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/).

O código da aplicação é distribuído sob a
[GNU Affero General Public License, versão 3 (AGPL-3.0)](LICENSE). Consulte os
termos completos no arquivo [`LICENSE`](LICENSE).

Em resumo, a AGPL-3.0 permite usar, estudar, modificar e redistribuir o
software, inclusive para fins comerciais. Ao redistribuir o programa ou versões
modificadas, é necessário manter os avisos de licença e disponibilizar o código
fonte correspondente sob a mesma licença. Se uma versão modificada for
disponibilizada para interação pela rede, os usuários devem poder obter seu
código-fonte. Este resumo é informativo; consulte o texto da licença para os
termos e obrigações completos.

## Desenvolvido por

Bruno Caimar, como parte do curso de Especialização em Tecnologia da
Informação da [Universidade Federal do ABC (UFABC)](https://www.ufabc.edu.br/)
— novembro de 2026.

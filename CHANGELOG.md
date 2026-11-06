# Changelog

## [0.0.3] - 2026-11-05

- Reduzido o tamanho dos arquivos GeoJSON, mantendo apenas as propriedades
  utilizadas pela aplicação e removendo espaços de formatação.
- Atualizado o script para gerar os arquivos GeoJSON compactos.
- Agendada a atualização dos dados para todas as sextas-feiras, à 1h da manhã
  (horário de Brasília).
- Configurada a action de atualização para acionar o workflow de deploy do
  GitHub Pages quando os dados forem alterados.

## [0.0.2] - 2026-11-04

- Ajustes na legenda para exibi-la somente em telas 'grandes'
- Ajuste do ícone da aplicação (favicon.ico)
- Validação da localização do usuário dentro do limite do município

## [0.0.1] - 2026-11-03

- Adicionado mapa interativo de feiras livres de São Paulo com filtros por dia,
  detalhes e sugestão de trajeto a pé.
- Adicionada interface instalável em navegadores compatíveis.
- Atualizados os ícones da aplicação com o contorno de São Paulo e a barraca
  da feira.
- Incluídos número, data e hash da versão no diálogo “Sobre”.
- Adicionado QR code para acessar a aplicação publicada.
- Adicionado controle para selecionar ou desmarcar todos os dias da semana.
- Configurada publicação no GitHub Pages e atualização diária dos dados via
  GitHub Actions.
- Atualizados os dados das feiras livres.

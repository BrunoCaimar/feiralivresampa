# Adaptando a aplicação para outras cidades

A aplicação pode servir de base para exibir feiras ou outros serviços locais
em outra cidade. Para adaptar os dados e a interface:

1. **Obtenha os dados da cidade:** identifique uma fonte aberta e confiável,
   verifique a licença, a frequência de atualização e os campos disponíveis.
   Substitua ou adapte o script em `scripts/` para consultar essa fonte.
2. **Prepare o GeoJSON:** a camada atual espera feições `Point` em WGS84
   (`EPSG:4326`) e usa os campos `tx_dia_funcionamento`,
   `nm_equipamento`, `tx_endereco_equipamento`, `qt_equipamento` e
   `cd_tipo_categoria`. Faça o mapeamento dos campos da nova fonte ou ajuste
   `web/feira_livre.js` para o novo formato. Se a cidade não tiver informação
   de dias, horários ou categorias, adapte também os filtros e os detalhes da
   feira.
3. **Atualize a visualização do mapa:** altere o centro inicial do mapa,
   atualmente configurado para São Paulo em `web/feira_livre.js`, e revise as
   cores/ícones e os filtros de dias em `web/index.html`,
   `web/styles.css` e `web/feira_livre.js`.
4. **Revise textos e atribuições:** atualize título, descrição, diálogo
   “Sobre”, créditos da fonte e atribuições do mapa em `web/index.html` e
   `web/feira_livre.js`. Mantenha os avisos exigidos pelas licenças dos dados e
   dos serviços.
5. **Avalie serviços externos:** configure um estilo de mapa e chaves
   apropriadas para a implantação. Confirme se o serviço de rotas cobre a
   região; substitua-o ou desative a função se não cobrir.
6. **Valide os dados e a interface:** gere o GeoJSON, copie-o para
   `web/data/`, teste os filtros e os detalhes das feiras e confira a
   aplicação em dispositivos móveis.

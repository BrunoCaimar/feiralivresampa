import os
import shutil

import requests
import json
import logging
import sys

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)

url_geosampa = "https://novogeosampa.prefeitura.sp.gov.br/Download/DownloadGeoServer"
nome_arquivo_saida = "equipamento_feira_livre.geojson"
pasta_destino_saida = "data"


def obter_dados_feiras_livres():
    url_geoserver = (
        "https://geoserver.geosampa.prefeitura.sp.gov.br/geoserver/geoportal/ows"
    )
    feira_livre_layer_id = 569
    output_srid_wgs84 = "EPSG:4326"

    payload = {
        "url": f"{url_geoserver}?"
        + "service=WFS"
        + "&version=1.1.0"
        + "&request=GetFeature"
        + "&typeName=geoportal:equipamento_feira_livre_v2"
        + "&outputFormat=application/json"
        + f"&srsName={output_srid_wgs84}",
        "filename": nome_arquivo_saida,
        "layerId": feira_livre_layer_id,
        "format": "geojson",
    }

    logging.info("-" * 80)
    logging.info(
        f"Iniciando requisição para obter dados das feiras livres... {url_geosampa}"
    )
    logging.info(f"Payload: {payload}")
    response = requests.post(url_geosampa, headers={}, json=payload)
    logging.info("HTTP Status Code: %d", response.status_code)
    response.raise_for_status()

    json_data = response.json()

    logging.info(f"Tamanho pacote recebido: {len(json_data)}")

    salvar_dados_feiras_livres(json_data)
    logging.info("Dados salvos com sucesso")
    
    copiar_dados_para_pasta_web()
    logging.info("Dados copiados para a pasta web com sucesso")
    
    logging.info("-" * 80)


def salvar_dados_feiras_livres(json_data):
    pasta_script = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(pasta_script, pasta_destino_saida, nome_arquivo_saida)
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(json_data, f, ensure_ascii=False, indent=2)

        logging.info("Dados salvos em: %s", file_path)


def copiar_dados_para_pasta_web():
    logging.info("Copiando arquivo para a pasta web/data...")

    pasta_script = os.path.dirname(os.path.abspath(__file__))
    arquivo_saida = os.path.join(pasta_script, pasta_destino_saida, nome_arquivo_saida)
    pasta_web_data = os.path.join(pasta_script, "..", "web", "data")
    os.makedirs(pasta_web_data, exist_ok=True)

    caminho_destino = os.path.join(pasta_web_data, nome_arquivo_saida)
    shutil.copy2(arquivo_saida, caminho_destino)

    logging.info("Arquivo copiado para: %s", caminho_destino)


if __name__ == "__main__":
    obter_dados_feiras_livres()

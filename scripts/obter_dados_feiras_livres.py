import json
import logging
import os
import shutil
import sys
import tempfile

import requests

from config import (
    feira_livre_layer_id,
    nome_arquivo_saida,
    output_srid_wgs84,
    pasta_destino_saida,
    url_geosampa_download,
    url_geosampa_geoserver,
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)


def obter_dados_feiras_livres():
    payload = {
        "url": f"{url_geosampa_geoserver}?"
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
    logging.info(f"Requisitando os dados das feiras livres... {url_geosampa_download}")
    logging.info(f"Payload: {payload}")
    response = requests.post(
        url_geosampa_download, headers={}, json=payload, timeout=30
    )
    logging.info(f"HTTP Status Code: {response.status_code}")
    response.raise_for_status()

    json_data = response.json()

    logging.info(f"Quantidade de feiras existentes: {len(json_data['features'])}")

    salvar_dados_feiras_livres(json_data)
    logging.info("Dados salvos com sucesso")

    copiar_dados_para_pasta_web()
    logging.info("Dados copiados para a pasta web com sucesso")

    logging.info("-" * 80)


def salvar_dados_feiras_livres(json_data):
    pasta_script = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(pasta_script, pasta_destino_saida, nome_arquivo_saida)
    pasta_saida = os.path.dirname(file_path)
    os.makedirs(pasta_saida, exist_ok=True)

    caminho_temporario = None
    try:
        with tempfile.NamedTemporaryFile(
            mode="w", encoding="utf-8", dir=pasta_saida, delete=False
        ) as arquivo_temporario:
            caminho_temporario = arquivo_temporario.name
            json.dump(json_data, arquivo_temporario, ensure_ascii=False, indent=2)

        os.replace(caminho_temporario, file_path)
        caminho_temporario = None
    finally:
        if caminho_temporario is not None and os.path.exists(caminho_temporario):
            os.remove(caminho_temporario)

    logging.info(f"Dados salvos em: {file_path}")


def copiar_dados_para_pasta_web():
    logging.info("Copiando arquivo para a pasta web/data...")

    pasta_script = os.path.dirname(os.path.abspath(__file__))
    arquivo_saida = os.path.join(pasta_script, pasta_destino_saida, nome_arquivo_saida)
    pasta_web_data = os.path.join(pasta_script, "..", "web", "data")
    os.makedirs(pasta_web_data, exist_ok=True)

    caminho_destino = os.path.join(pasta_web_data, nome_arquivo_saida)
    caminho_temporario = None
    try:
        with tempfile.NamedTemporaryFile(
            dir=pasta_web_data, delete=False
        ) as arquivo_temporario:
            caminho_temporario = arquivo_temporario.name

        shutil.copy2(arquivo_saida, caminho_temporario)
        os.replace(caminho_temporario, caminho_destino)
        caminho_temporario = None
    finally:
        if caminho_temporario is not None and os.path.exists(caminho_temporario):
            os.remove(caminho_temporario)

    logging.info(f"Arquivo copiado para: {caminho_destino}")


if __name__ == "__main__":
    obter_dados_feiras_livres()

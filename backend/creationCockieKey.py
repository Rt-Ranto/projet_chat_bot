import os
import secrets
from pathlib import Path
from dotenv import set_key, load_dotenv


BASE_DIR = Path(__file__).resolve().parent
ENV_FILE = BASE_DIR / ".env"

def creer_cockie_key():
    load_dotenv()

    file_env = ".env"
    #creation du env s'il n'existe pas
    if not ENV_FILE.exists():
        ENV_FILE.touch()
        print("\033[32m =>\033[0m \033[33m creation du fichier env \033[0m")

    #generer le clé de la session
    key = secrets.token_hex(32)

    set_key(str(ENV_FILE),"FLASK_SECRET_KEY", key)
    print("\033[33m la clé du cockie est bien généner \033[0m")

if __name__ == "__main__":
    creer_cockie_key()
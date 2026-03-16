import json
import os
from pathlib import Path

class GetJson:
    def __init__(self):
        BASE_DIR = Path(__file__).resolve().parent #chemin du script.py dans l'ordi
        self.__path = BASE_DIR /"Data_json" / "nombre_de_collection.json"
        # print(self.__path)
        # print(os.getcwd())

    def lire_json(self):
        with open(self.__path,"r", encoding="utf-8") as file:
            data = json.load(file)
        return data

    def modifier_json(self, newvalue:dict):
        with open(self.__path,"w",encoding="utf-8") as file:
            json.dump(newvalue, file,indent=4, ensure_ascii=False)




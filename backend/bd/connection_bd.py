import pymongo
from tkinter import messagebox
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from bd.donnee_json import GetJson



class EmailDejaExister(Exception):
    pass

class ConnecterAMongoDB:
    cpt = 1
    def __init__(self):
        self.__monClient = pymongo.MongoClient("mongodb://localhost:27017/")
        self.__mon_db = self.__monClient['GeminiAPI']
        self.__hasher = PasswordHasher() #cryptage de mot passe utilisant l'algo de argon2id
        self.__gJson = GetJson() 
        self.__dataJson = self.__gJson.lire_json()
        self.__collection = self.__mon_db[f"{self.__dataJson['act_col']}"]
        self.__limite_document_collection = 5
    
          
               
    def ajouter_nouvel_user(self, user:dict):
        if self.__collection.count_documents({}) == self.__limite_document_collection:
            self.__gJson.modifier_json({'act_col':f"collection{len(self.__mon_db.list_collection_names())+1}","lastId":self.__gJson.lire_json()['lastId']})
            self.__collection = self.__mon_db[f"{self.__gJson.lire_json()['act_col']}"]
            print("\033[34m ♥☺ \033[0m") 

        for x in self.__mon_db.list_collection_names():
            collection_actuel = self.__mon_db[f"{x}"]
            for email in collection_actuel.find({"email":user['email']}):
                raise EmailDejaExister(f"il y a déjà un compte \n associer à cette email '{user['email']}'.")
            
        
        try:
            user_Id = self.__gJson.lire_json()['lastId'] + 1
            self.__gJson.modifier_json({'act_col':self.__gJson.lire_json()['act_col'], 'lastId':user_Id})
            mot_de_passe = self.__hasher.hash(user['password'])
            insertion_d = self.__collection.insert_one(
                {
                    "_id" : user_Id,
                    "email" : user.get('email'),
                    "password" : mot_de_passe
                }
            )
            print(f"""
            \033[32m
            id inserer =>\033[0m  \033[33m {insertion_d.inserted_id}\033[0m \033[32m| 
            nombre de doc =>\033[0m \033[33m {self.__collection.count_documents({})}\033[0m \033[32m|
            nombre de collection => \033[0m \033[33m{len(self.__mon_db.list_collection_names())} \033[0m
            """)
        
        except Exception as e:
            print("Une erreur se produit "+str(e))

    def se_connecter(self, user:dict) -> int:
        for collection in self.__mon_db.list_collection_names():
            collection_actuel = self.__mon_db[f'{collection}']
            for email in collection_actuel.find({"email":user['email']}):
                try:
                    self.__hasher.verify(email['password'], user['password'])
                    return email['_id'] #return userID si email exist et password ok  

                except VerifyMismatchError:
                    return 1 #return 1 si mot de passe incorrect
        
        return 2 #retunr 2 si email n'existe pas

    def ajouter_chat(self, id:int, titre:str, liste_message:list):
        self.__collection.update_one(
            {"_id":id},
            {"$set":{f"chat.{titre}":liste_message}}
        )

    def obtenir_chat(self, id:int) -> list:
        for doc in self.__collection.find({"_id":id}):
            try:
                return doc["chat"]
            except Exception as e:
                print(e)    
    
    def supprimer_documents(self,id:int ,titre:str):#pour supprimer un documment c_à_d un chat en général

        query = {"_id":id}
        suppression = {"$unset":{f"chat.{titre}":""}}
        self.__collection.update_one(query,suppression)
        print(f"\033[30m Suppresion de {titre} reussie \033[0m")
    
    def upload_photo(self, id:int, path:str):
        query = {"_id":id}
        ajout_photo = {"$set":{"photo":f"{path}"}}
        self.__collection.update_one(query,ajout_photo)
        print(f"\033[32m Ajout photo reussie \033[0m")


    def get_image_path(self, id:int):
        query = {"_id":id}
        for doc in self.__collection.find(query):
            try:
                return doc['photo']
            except Exception as e:
                print(e)

    def rename_chat(self, id, oldName, newName):
        query = {"_id":id}
        modification = {"$rename": {f"chat.{oldName}": f"chat.{newName}"}}
        try:
            print(f"\033[32m {oldName} \033[0m")  #oldName est un dict 
            self.__collection.update_one(query, modification)
            print(f"\033[32m renommination reussie ☻ \033[0m")

        except Exception as e:
            print(f"\033[33m le chat n'existe pas \033[0m")


# a = ConnecterAMongoDB()
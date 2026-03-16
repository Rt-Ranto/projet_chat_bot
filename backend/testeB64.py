# import base64
# # mot = "Cat"
# # motarr = list(mot)
# # motchrarr = [ int(x) for x in motarr]
# # print(motchrarr)

# print(format(ord("A"),"08b")) #transformation Binaire ,ord() transformation ascii
# def transformer_en_base64(texte):
    
#     # L'alphabet de référence
#     alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

#     bits = ""
#     for char in texte:
#         bits += format(ord(char), "08b")
#         # print(len(bits))
        

#     # Ajouter des zéros à la fin pour avoir un multiple de 6
#     padding = 0
#     # print(len(bits))
#     while len(bits) % 6 != 0:
#         bits += "0"
#         padding += 1
        
#     # Découpage par 6 bits du groupe de 24bits    
#     resultat = ""
#     for i in range(0,len(bits), 6):
#         pacquet_6_bits = bits[i:i+6]
#         index = int(pacquet_6_bits, 2) #transformer en entier le paquet de 6 bits
#         # print(index)
#         resultat += alphabet[index]

#     # Gérer le signe "=" à la fin (le padding)
#     # En Base64, on ajoute '=' pour chaque paire de bits de remplissage
#     if padding == 2: resultat += "="
#     elif padding == 4: resultat += "=="
#     return(resultat)

# def retransform_en_mot(b64):
#     # L'alphabet de référence
#     alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
   
#     b64 = b64.rstrip('=')
#     bits = ""
#     for x in b64:
#         if x == "=" or x=="==":
#             pass
#         else:
#             n = alphabet.index(x)
#             bits += format(n, "06b")
#             # print(bits)
    

#     texte = ""
#     for i in range(0,len(bits),8):
#         huit_bits = bits[i:i+8]

#         if len(huit_bits) == 8:
#             code_ascii = int(huit_bits, 2)
#             texte += chr(code_ascii)


#     return texte


# mot = "Cat"
# print(base64.b64encode(mot.encode()))
# print(transformer_en_base64(mot))
# print(base64.b64decode(transformer_en_base64(mot)).decode())
# print(retransform_en_mot("Q2F0"))

from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

# 1. Initialisation de l'instance
ph = PasswordHasher()

# 2. Hachage d'un mot de passe
password_utilisateur = "mon_super_password_123"
hash_genere = ph.hash(password_utilisateur)

print(f"Hash stocké en base : {hash_genere}")

# 3. Vérification du mot de passe
mot_de_passe_saisi = "mon_super_password_12"

try:
    # On compare le hash stocké avec la saisie de l'utilisateur
    ph.verify(hash_genere, mot_de_passe_saisi)
    print("✅ Mot de passe valide !")
except VerifyMismatchError:
    print("❌ Mot de passe incorrect.")
except Exception as e:
    print(f"⚠️ Une erreur est survenue : {e}")
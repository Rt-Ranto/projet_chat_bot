from flask import Flask, session, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
import traceback
import os 

from service_api import RequetteVersApi
from bd.connection_bd import ConnecterAMongoDB 



app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY') #Indispensable pour signer les sessions
app.config.update(
    SESSION_COOKIE_SAMESITE='Lax', #None si front dans le meme domaine 
    SESSION_COOKIE_SECURE=False, # Mettre à True seulement si vous utilisez HTTPS
    SESSION_COOKIE_HTTPONLY=True,
)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"]) #Autoriser React à envoyer les cockies
#CORS Block les Domaine qui ne sont pas http://localhost:5173

db = ConnecterAMongoDB()

UPLOAD_DIR = 'static/upload'
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)


@app.route("/api/addUser", methods=["POST"])
def signup():
   
    data = request.json
    newUser = data.get("newUser")

    if not newUser:
        return jsonify({"erreur":"veuiller remplir tous les champs"}), 400

    try:
        if newUser['email'] and newUser["password"]:
            db.ajouter_nouvel_user(newUser)
            return jsonify({'message':f"le compte avec l'email {newUser['email']} \n a été crée avec succés"})
        else:
            return jsonify({'erreur':f"remplisser tous les champs."})

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'erreur':f"erreur:{e}"}), 500

@app.route("/api/login", methods=["POST"])
def login():
    
    data = request.json
    userAuth = data.get("userAuth")

    if not userAuth:
        return jsonify({"erreur":"veuiller remplir tous les champs"}), 400

    userVerification = db.se_connecter(userAuth) 
    
    if userVerification == 1:
        return jsonify({"erreur1":"mot de passe incorrect"})     
    elif userVerification == 2:
        return jsonify({"erreur":f"ce compte n'existe pas "}) 
    else:
        session["userId"] = userVerification
        print(session.get("userId"))
        return jsonify({"message":"session ouvert","userId": userVerification}), 200
        
@app.route("/api/moi", methods=["GET"])
def mes_donnees():
    if 'userId' in session : 
        photo = db.get_image_path(session['userId'])
        donnee = {"user_Id": session['userId']} if not photo else {"user_Id": session['userId'], "photo":f"http://localhost:5000/static/upload/{photo}"}
        return jsonify(donnee)
    return jsonify({'erreur':"error de connexion."}), 400

@app.route("/api/logout", methods=["POST"])
def logout():
    session.pop('userId', None)
    return jsonify({'message':"Deconnecté"})

@app.route("/api/listeChat", methods=['GET'])
def liste_des_chats():
    liste_chats = db.obtenir_chat(session['userId'])
    try:
        print("chat existe")
        print([k for k,v in liste_chats.items()])
        return jsonify({"chats":[k for k,v in liste_chats.items()]}), 200
    except Exception as e:
        return jsonify({"listeVide":"liste vide"})
        # return jsonify({"":["error"]})

@app.route("/api/listeMessages", methods=["POST"])
def liste_des_messages():
    titre = request.args.get("titre")
    print(titre)
    try:
        liste_messages = db.obtenir_chat(session['userId'])[titre]
        if liste_messages != []:
            print("\033[34m chat trouvé \033[0m")
            print(f"\033[35m {liste_messages} \033[0m")
            return jsonify({"messages":liste_messages}), 200
        else:
            print(f"\033[31m Auccun Chat correspond à {titre} \033[0m")

    except ValueError as e:
        return jsonify({"erreur":str(e)})

@app.route("/api/stockChatFinal", methods=['POST'])
def stocker_chat_final():
    data = request.args
    liste_message = data.get("chat")
    print(liste_message)
    db.ajouter_chat(session['userId'],liste_message[0]['message'][:60],liste_message)
    return jsonify({'message':'chat enrgistré avec succès'})

@app.route("/api/ask", methods=["POST"])
def ask_api():
    
    # print(f"Cookies reçus : {request.cookies}") 
    # print(f"Session actuelle : {session}")

    data = request.json
    prompt_entrer = data.get("prompt")
    liste_message = data.get("message")

    print(liste_message)
    
    if not prompt_entrer:
        return jsonify({"erreur":"prompt vide"}), 400
    
    try:
        # reponse = client.models.generate_content(
        #     model="gemini-2.5-flash-lite",
        #     contents=prompt_entrer
        # )
        req = RequetteVersApi(prompt_entrer)
        if liste_message == []:
            pass
        else:
            db.ajouter_chat(session['userId'],liste_message[0]['message'][:60],liste_message)
        
        return jsonify({"reponse":str(req)})

    except Exception as e:
        print(f"error occured: {e}")
        return jsonify({'erreur': "Connection Error"}), 500

@app.route("/api/supprimerChat", methods=["POST"])
def supprimer_chat():
    titre = request.args.get("titre")
    print(titre)
    try:
        db.supprimer_documents(session["userId"], titre)
        return jsonify({"message":"suppression reussi"})
    except Exception as e:
        return jsonify({"error": "Impossible de supprimer"})


@app.route("/api/uploadImage", methods=["POST"])
def ajouter_image():
    if 'photo' not in request.files:
        return jsonify({"error":"aucun fichier trouvé"}), 400

    file = request.files['photo']
    if file.filename == '':
        return jsonify({"error": "Nom de fichier vide"}), 400
    # Nettoyage du nom de fichier
    filename = secure_filename(file.filename)
    
    # Construction du chemin complet (Sûr et absolu)
    destination_path = os.path.join(UPLOAD_DIR, filename)
    # le chemin absolut du photo
    # absolut_path = os.path.abspath(destination_path)

    try:
        db.upload_photo(session['userId'], filename)
        file.save(destination_path)
        return jsonify({'message':"upload photo reussie"}), 200
    except Exception as e:
        return jsonify({'error':str(e)})
     
@app.route("/api/rename", methods=['POST'])
def renomer_le_chat():
    data = request.json.get("info")
    try:
        db.rename_chat(session['userId'], data['l_titre'], data['n_titre'])
        print(data['l_titre'])
        return jsonify({"message":"renommination reussie"}), 200  
    
    except Exception as e:
        return jsonify({"error":str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True, port=5000)

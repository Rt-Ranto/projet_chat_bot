from google import genai
from groq import Groq
import os 

class RequetteVersApi:
    def __init__(self, monrequette):
        self.__monrequtte = monrequette

    def req_gemini(self):              
        cle_api_gemini = os.getenv('GEMINI_API_KEY')
        if not cle_api_gemini:
            raise ValueError("Aucune clé api trouver!")
        else:
            client = genai.Client(api_key = cle_api_gemini)
        
        try:
            reponse = client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=self.__monrequtte
            )
            print("\033[32m requette vers gemini \033[0m")
            return reponse.text
        
        except ValueError:
            print(f"\033[35m aucune clé gemini trouver. \033[0m")
            return self.req_groq

        except Exception as e:
            return self.req_groq()

    def req_groq(self):
        cle_api_groq = os.getenv("GROQ_API_KEY")
        if not cle_api_groq:
            raise ValueError("Aucune clé api trouver!")
        else:
            client = Groq(api_key=cle_api_groq)

        try:
            reponse = client.chat.completions.create(
                model = "llama-3.3-70b-versatile",
                messages = [{"role":"user","content":self.__monrequtte}],
                temperature = 0.7
            )
            print("\033[32m requette vers groq \033[0m")
            return reponse.choices[0].message.content
        
        except ValueError:
            print(f"\033[34m aucune clé groq trouver. \033[0m")
        except Exception as e:
            print(f"\033[32m {e} \033[0m")

    def __str__(self):
        return self.req_gemini()
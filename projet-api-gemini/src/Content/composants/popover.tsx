import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type ChangeEvent, useState } from "react";
import type { JSX } from "react/jsx-runtime";

const Popover = ({isOpen, fermerPopover}:{isOpen:boolean, fermerPopover:()=>void}):JSX.Element =>{
    const [filePath , setFilePath] = useState<File | null>(null);

    const handleFileChange = (event:ChangeEvent<HTMLInputElement>):void => {
        if (event.target.files){
            setFilePath(event.target.files[0]);
        }
    }
    const uploadFile = async():Promise<void>=>{
        if (!filePath) return alert("choisir d'abord un photo.")
        const formData = new FormData();
        formData.append('photo', filePath);
        console.log(filePath)
        try{
            const rep = await fetch("http://localhost:5000/api/uploadImage",
                {
                    method:"POST",
                    //  headers:{ "Content-Type": "application/json" },
                     body:formData,
                     credentials:'include'
                }
            )
            const data = await rep.json();
            console.log("Réponse su serveur: ", data);
        }
        catch(error){
            console.error("Error lors de l'envoi : ",error);
        }
        window.location.reload();
        setFilePath(null);
    }
    return (
        <div className={`w-60 h-auto p-3 fixed bottom-18 bg-color1 rounded-2xl 
            shadow-2xl block left-70 duration-700
            ${!isOpen ? '-translate-x-[390%]' : 'translate-x-0'}`}>
            <div className="w-full h-auto flex justify-end items-center">
                <button type="button"
                className="border-0 hover:bg-color2 w-full h-full"
                onClick={fermerPopover}
                >
                    <FontAwesomeIcon 
                        icon={faX}
                        className="text-md p-3"
                    />
                </button>
            </div>
            <p className="w-full h-auto text-lg tracking-wider font-fontArial text-color4">
                Ajouter Photo
            </p>
            <div className="relative p-[20px] border-gray-300 border-2 mx-3 max-h-40 border-dashed rounded-lg hover:border-blue-400 hover:bg-blue-50 
            transition-all cursor-pointer flex flex-col items-center justify-center">
    
                {/* 1. L'input est étalé sur toute la surface mais invisible (opacity-0) */}
                <input 
                    type="file" 
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="file-upload"
                />

                {/* 2. Le contenu visuel qui remplace le texte par défaut */}
                <div className="text-center">
                    <span className="text-color4 font-semibold">
                        {filePath ? "Changer la photo" : "Cliquez pour ajouter une photo"}
                    </span>
                    <p className="text-gray-300 text-sm mt-1">PNG, JPG jusqu'à 10MB</p>
                </div>

                {/* 3. Affichage du nom du fichier choisi */}
                {filePath && (
                    <p className="mt-3 text-sm text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200">
                        <strong>Fichier :</strong> {filePath.name}
                    </p>
                )}
            </div>
            {filePath &&(
                <button type="button"
                className="w-full h-16 rounded-xl border-0 bg-color4 text-gray-300
                font-fontArial text-lg"
                onClick={uploadFile}
                >
                    Envoyer
                </button>
            )
            }
        </div>
    )
} 

export default Popover;
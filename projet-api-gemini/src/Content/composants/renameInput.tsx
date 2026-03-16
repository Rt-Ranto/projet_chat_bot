import { faPen, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, type JSX } from "react";
import type InfoTitre from "./infoTitre";
import valider_renommer_chat from "./renomerTitreChat";
import { LabelFlotant } from "./inputFlotant";


const RenomerTitreDuChat = ({show, oldTitle, close}:
    {show:boolean,oldTitle:string, close:()=>void}):JSX.Element =>{
    const [newTitle, setNewTitle] = useState<string>('');
    
    const renommer = async():Promise<void>=>{
        const info : InfoTitre = {
            l_titre : oldTitle,
            n_titre : newTitle
        }
        await valider_renommer_chat(info);
    }
    
    return (
        <div className={`w-60 h-auto p-3 fixed top-18 bg-color1 rounded-2xl 
            shadow-2xl block right-70 duration-700
            ${!show ? '-translate-y-[390%]' : 'translate-y-0'}`}>
            <div className="w-full h-auto flex justify-end items-center">
                <button type="button"
                className="border-0 hover:bg-color2 w-full h-full"
                onClick={close}
                >
                    <FontAwesomeIcon 
                        icon={faX}
                        className="text-md p-3"
                    />
                </button>
            </div>
            <LabelFlotant label="Titre" icon={faPen} onChange={(e)=>setNewTitle(e.target.value)}/>
            <button type="button"
            className="w-full h-16 mt-6 rounded-xl border-0 bg-color5 text-gray-300
            font-fontArial text-lg"
            onClick={renommer}
            disabled={oldTitle === ""}
            >
                Valider
            </button>
            
            
        </div>
    )
}

export default RenomerTitreDuChat;
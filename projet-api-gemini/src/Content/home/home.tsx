// import { useState, type ChangeEvent, type JSX } from "react";
import type User from "../composants/user";
// import { Menu } from "./menu";
// import PromptInterface from "./prompteInterface";
// import { Menu1 } from "./menu1";
import {useWindowSize} from "../composants/monHook";
// import { Menu } from "./menu";
import { useEffect, useRef, useState, type JSX } from "react";
import myImage from "../../assets/logo.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faRobot, faBars, faShareAlt, faPen , faPenToSquare, faSearch, faSignOut, faTrash } from "@fortawesome/free-solid-svg-icons";
import { AutoResizeTextarea } from "../composants/autoResizeTextArea";
import type { IReponseGemini } from "../composants/reponsegem";
import type IMessage  from "../composants/chargementMessage";
import { useOnOutsizeClick } from "../composants/monHook";
import { ChargementContenuChat, ChargementDesChats } from "./chargerChat";
import ChangerThemeButton from "../composants/changertheme";
import supprimerChat from "../composants/supprimerChat";
import Popover from "../composants/popover";
import RenomerTitreDuChat from "../composants/renameInput";

export default function HomePage({user, onLogout}:{ user:User, onLogout:() => void}):JSX.Element{
    const [isOpen, setOpen] = useState<boolean>(false);
    const[retrecie, setRetrecie] = useState<boolean>(false);
    const [answ, setAnsw] = useState<boolean>(false);
    const [Erreur, setErreur] = useState<string>("");
    const [prompt,setPrompt] = useState<string>("");
    const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
    const [popoverOpen1, setPopoverOpen1] = useState<boolean>(false);
    const [titre,setTitre] = useState<string>('');
    const [loading,setLoading] = useState<boolean>(false);
    const [Message, setMessage] = useState<IMessage[]>([]);
    const width = useWindowSize();
    const isMobile = width < 800;
    const scrollRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const chats = ChargementDesChats();
    // let ChatFinal:IMessage[] = [...Message];

    useOnOutsizeClick(
        {
            ref:menuRef, 
            callback:()=>{
                setOpen(false);
            }
        });
    //auto scroll vers le bas en cas de nouvelle message
    useEffect(()=>{
        if (scrollRef.current){
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [Message])

    useEffect(()=>{
        setRetrecie(false);
    },[isMobile])
    const fermerpop = ():void=>setPopoverOpen(false);
    const chargerContenuChat = (titreSelect:string)=>{

            const chargerDonnee = async()=>{
                setLoading(true)
                try{
                    const data = await ChargementContenuChat(titreSelect);
                    setMessage(data);
                }
                catch (error){
                    console.error(error);
                }
                finally{
                    setLoading(false);
                }
            }
            setTitre(titreSelect);
            console.log(titreSelect);
            console.log(Message);
            setAnsw(true);
            chargerDonnee();
            
    }
    
    // const terminerChat = async():Promise<void> =>{
    //     try{
    //         const rep = await fetch(`http://localhost:5000/api/stockChatFinal?chat=${Message}`,
    //             { 
    //              method:"POST",
    //              headers:{ "Content-Type": "application/json" },
    //             //  body:JSON.stringify({chat:Message}),
    //              credentials:'include'
    //             }
    //         );
    //         const data = await rep.json();
    //         console.log(data);
    //     }
    //     catch (error){
    //         console.error(error);
    //     }
    // }
    // window.addEventListener('load',async()=>await terminerChat())
    const newChat = async():Promise<void> =>{
        // await terminerChat();
        setPrompt('')
        // await envoyerAGemini()
        window.location.reload()
    }
    const suppr = async(titre:string):Promise<void>=>{
        await supprimerChat(titre);
    }

    const envoyerAGemini = async():Promise<void>=>{
        if (!prompt.trim()) return;
        setErreur("");
        const newPrompt:IMessage = {
            id : Date.now(),
            message : prompt.trim(),
            envoyeur : "user"
        }
        // 1. On crée la nouvelle liste manuellement
        const updatedMessages = [...Message, newPrompt];

        // 2. On met à jour l'UI (React fera le rendu plus tard)
        setMessage(updatedMessages);
        setLoading(true);
        setAnsw(true);
        try{
            const rep = await fetch("http://localhost:5000/api/ask",
                { 
                 method:"POST",
                 headers:{ "Content-Type": "application/json" },
                 body:JSON.stringify({ prompt:prompt, message:updatedMessages }),
                 credentials:'include'
                }
            );
            const data : IReponseGemini = await rep.json();
            // setReponse(data.reponse||data.erreur||"Erreur inconnu");
            const botResponse : IMessage = {
                id:Date.now(),
                message:data.reponse,
                envoyeur:'bot'
            }
            if (data.erreur){
                setErreur(data.erreur);
                return;
            }
            setMessage(prev =>[...prev, botResponse]);
            console.log(Message);
            setPrompt('');

        }catch(err){
            console.log(err);
            // setReponse("Erreur : Impossible de contacter le serveur Flask.");
        }finally{
            setLoading(false);
            setTitre(Message[0].message);
        }
        
    }
    return (
        <div className=" absolute flex items-center justify-start 
                                h-screen w-screen bg-color2 text-white">
            
            <div className={`${isMobile ?'fixed':'relative'} ${isMobile && !isOpen && '-translate-x-full'} 
                            duration-700 h-full ${!retrecie ? 'min-w-64':'w-28'} bg-color1 
                    flex flex-col items-center z-30`}
                    ref={menuRef}>
                    {!isMobile && (
                        <div className="w-full h-18 flex justify-center items-center">
                            <button type="button"
                            className=" w-16 h-16 text-color7 btn-hover flex items-center justify-center rounded-full px-3 py-3"
                            onClick={()=>setRetrecie(!retrecie)}
                            >
                                <FontAwesomeIcon 
                                    icon={faBars}
                                    className="text-3xl"
                                />
                            </button>
                        </div>
                    )}
                    <div className="w-full h-18 flex items-center justify-start btn-hover">
                        <button type="button"
                        className=" w-full h-16 gap-x-1 
                        flex items-center justify-start ml-9 text-color7 text-base font-fontArial"
                        >
                            <FontAwesomeIcon 
                                icon={faSearch}
                                className="text-3xl"
                            />
                            {retrecie ? "": "Rechercher Chat."}
                        </button>
                    </div>
                    <div className="w-full h-18 flex justify-start items-center btn-hover">
                        <button type="button"
                        onClick={()=>newChat()}
                        className=" w-full h-16  gap-x-1 ml-9 md:lg-3
                        flex items-center justify-start text-color7 text-base font-fontArial"
                        >
                            <FontAwesomeIcon 
                                icon={faPenToSquare}
                                className="text-3xl"
                            />
                            {retrecie ? "": "Nouveau Chat."}
                        </button>
                    </div>
                    {!retrecie &&(
                        <div className="w-full h-auto block">
                            <div className="w-full h-auto px-3">
                                <h1 className="border-b-2 border-color8 w-full h-10 
                                    font-fontArial text-lg text-color8 mb-6 flex items-end justify-start">
                                        Les Chats
                                </h1>
                            </div>
                            <div className="w-full h-auto max-h-40 overflow-auto scroll-smooth shadow-inner">
                                {chats&&(
                                    chats.map(chat =>(
                                        <div key={chat} className="btn-hover px-3 div-perso flex items-center justify-between">
                                            <button  type="button"
                                            onClick={()=>chargerContenuChat(chat)}
                                            className="w-full max-w-45 h-10 text-md font-fontArial text-gray-400 truncate
                                            flex items-center justify-start">
                                                {chat}
                                            </button>
                                            <button type="button"
                                            className=" w-10 h-10 text-gray-300 duration-700 btn-hover btn-perso
                                            items-center justify-center rounded-full px-3 py-3 "
                                            onClick={()=>suppr(chat)}
                                            >
                                                <FontAwesomeIcon 
                                                    icon={faTrash}
                                                    className="text-lg"
                                                />
                                            </button>
                                        </div>
                                    ))
                                )
                                }
                            </div> 
                        </div>
                    )}
                    <div className="absolute bottom-36 left-0 w-full h-16 flex items-center justify-center">
                        <button type="button"
                        className="w-16 h-16 text-2xl text-color3 flex items-center justify-center
                        font-fontArial rounded-full px-1 py-1 bg-color2 hover:bg-color2"
                        onClick={()=>setPopoverOpen(!popoverOpen)}
                        >
                            {!user.photo && (
                               <p>{user.user_Id}</p> 
                            )}
                            {user.photo && (
                                <img src={user.photo} alt="" className="w-full h-full flex items-center justify-center rounded-full" />
                            )}
                        </button>
                    </div>
                    <div className="absolute bottom-18 left-0 w-full h-16 btn-hover">
                        <ChangerThemeButton label="Mode" retrecie={retrecie} className="w-full h-16 gap-x-1 
                        flex items-center justify-start ml-9 text-color7 text-lg font-fontArial"/>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-16 btn-hover">
                        <button type="button"
                            onClick={onLogout}
                            className=" w-full h-16 gap-x-1 
                        flex items-center justify-start ml-9 text-color4 text-lg font-fontArial"
                        >
                            <FontAwesomeIcon 
                                icon={faSignOut}
                                className="text-3xl"
                            />
                            {retrecie ? "": "Deconnecter"}
                        </button>
                    </div>
                    
            </div>
            {/*==================================== HOME ===================================*/}
            <div className={`h-full w-full z-0 bg-color2 flex flex-col duration-700
            item-center justify-center ${ answ ? 'space-y-0' : 'gap-y-8'}`}>
                <div className="fixed top-0 left-0 w-full h-20 z-10 bg-color2 flex items-center justify-end gap-x-0">
                    {isMobile &&
                        <div className=" fixed left-6 w-18 h-18 flex justify-center items-center">
                            <button type="button"
                            className=" w-16 h-16 text-color7 btn-hover1 flex items-center justify-center rounded-full px-3 py-3"
                            onClick={()=>setOpen(!isOpen)}
                            >
                                <FontAwesomeIcon 
                                    icon={faBars}
                                    className="text-3xl"
                                />
                            </button>
                        </div>
                    }
                    <div className="flex w-auto h-full color2 flex items-center justify-center mr-6 gap-x-1">
                        <button type="button"
                        className=" w-16 h-16 text-gray-300 duration-700 btn-hover flex 
                        items-center justify-center rounded-full px-3 py-3"
                        >
                            <FontAwesomeIcon 
                                icon={faShareAlt}
                                className="text-2xl"
                            />
                        </button>
                        
                        <button type="button"
                        className=" w-16 h-16 text-green-300 btn-hover duration-700 flex items-center justify-center rounded-full px-3 py-3"
                        onClick={()=>setPopoverOpen1(true)}
                        >
                            <FontAwesomeIcon 
                                icon={faPen}
                                className="text-2xl"
                            />
                        </button>
                        <img src={myImage} alt="logo" className="w-14 h-14"/>
                    </div>
                </div>
                { answ &&(
                    <div ref={scrollRef} className="h-120 mt-20 max-h-160 rounded-3xl  
                    w-full   overflow-y-auto scroll-smooth  flex-1 space-y-4">
                        {
                            Message.map((msg)=>(
                                <div key={msg.id}
                                className={`flex ${msg.envoyeur === 'user' ? 'justify-end': 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-3xl shadow-sm ${msg.envoyeur === 'user' 
                                        ?'bg-color5 text-lg mr-8 text-color9 font-fontArial rounded-tr-none'
                                        :'bg-color1 text-lg ml-8 text-gray-200 font-fontArial rounded-bl-none animate-skew'
                                    }`}>
                                        {msg.message}
                                    </div>
                                </div>
                            ))
                        }
                        {loading &&(
                           <div className="flex justify-start p-12">
                                <FontAwesomeIcon 
                                    icon={faRobot}
                                    className="text-3xl text-color5 bounce-spin-faster"
                                />
                           </div> 
                        )}
                    </div>
                )}
                {Erreur &&(
                    <p className="text-lg font-fontArial text-red-300 overflow-clip
                    h-auto w-auto max-w-[75%] border-2 rounded-xl border-4 border-red-400 
                    flex items-center justify-center">
                        {Erreur}
                    </p>
                )
                }
                <div className="w-full h-auto flex item-center justify-center gap-x-3">
                    {!answ &&(
                        <>
                        <h1 className="text-2xl sm:text-4xl tracking-wide text-white animate-reveal
                        ">
                            Est ce que je peut vous aider?
                        </h1>
                        <FontAwesomeIcon 
                            icon={faRobot}
                            className="text-4xl sm:text-6xl text-green-500 bounce-spin"
                        />
                        </>
                    )}
                </div>
                <div className="w-auto max-h-36 min-h-16 mb-5 overflow-hidden md:mx-28 mx-12 rounded-full px-6 py-5 shadow-dark bg-color1 flex items-center justify-center">
                    <AutoResizeTextarea texte={prompt} setPrompte={setPrompt}/>
                    <button className="border-0 bg-transparence w-16 hover:animate-send-fly flex items-center rotate-hover"
                     onClick={envoyerAGemini}>
                        <FontAwesomeIcon
                            icon={faPaperPlane}
                            className="text-green text-4xl "
                        />
                    </button>
                </div>
                <Popover isOpen={popoverOpen} fermerPopover={fermerpop} />
                <RenomerTitreDuChat show={popoverOpen1} oldTitle={titre} close={()=>setPopoverOpen1(false)}/>
            </div>
        </div>
    )
}
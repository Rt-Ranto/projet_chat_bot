import { useEffect, useState } from "react";
import type IMessage from "../composants/chargementMessage";
// import type { JSX } from "react/jsx-runtime";


const ChargementDesChats = ():string[] =>{
    const[chats, setChat] = useState<string[]>([]);
    useEffect(()=>{
        fetch("http://localhost:5000/api/listeChat", { credentials:'include' })
        .then(rep => rep.ok ? rep.json() : null)
        .then(data =>{
            setChat(data.chats);
            console.log(data.chats)
        }).catch(err => console.log(err))
    },[])

    return chats;
}
const ChargementContenuChat = async(titre:string):Promise<IMessage[]> =>{
   const rep = await fetch(`http://localhost:5000/api/listeMessages?titre=${titre}`,
                            {
                                method:"POST",
                                headers:{ "Content-Type": "application/json" },
                                // body:JSON.stringify({ index:index }),
                                credentials : 'include'   
                            }
   )
   if(rep.ok){
    const data = await rep.json();
    return data.messages;
   }
   else{
    throw new Error('ERROR OCCURED');
   }
}
export {ChargementDesChats, ChargementContenuChat}
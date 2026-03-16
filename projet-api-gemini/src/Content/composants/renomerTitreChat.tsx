import type InfoTitre from "./infoTitre";

const valider_renommer_chat = async(info:InfoTitre):Promise<void> =>{
    try{
            const rep = await fetch("http://localhost:5000/api/rename",
                { 
                 method:"POST",
                 headers:{ "Content-Type": "application/json" },
                 body:JSON.stringify({info:info}),
                 credentials:'include'
                }
            );
            const data = await rep.json();
            console.log(data);
            window.location.reload();
        }
        catch (error){
            console.error(error);
        }
}

export default valider_renommer_chat;
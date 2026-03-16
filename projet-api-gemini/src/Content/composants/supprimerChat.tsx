

const supprimerChat = async(titre:string):Promise<void>=>{
    const rep = await fetch(`http://localhost:5000/api/supprimerChat?titre=${titre}`,
        {
            method:"POST",
            headers:{ "Content-Type": "application/json" },
            credentials:'include'
        }
    )
    if(rep.ok){
        const data = await rep.json();
        if (data.message){
            window.location.reload();
        }
    }
}

export default supprimerChat;
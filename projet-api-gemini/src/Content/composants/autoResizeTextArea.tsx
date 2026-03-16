
import { useEffect, useRef, type JSX } from "react";

const AutoResizeTextarea = ({texte,setPrompte}:{texte:string,setPrompte:(u:string)=>void}):JSX.Element =>{
    // const [texte, setText] = useState<string>('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjusteHeight = ()=>{
        const textarea = textareaRef.current;
        if (textarea){
            textarea.style.height = "auto", //on reinitialise la hauteur pour permettre de retrécir si on supprime du texte
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }
    // const handleTextareaChange = (e:ChangeEvent<HTMLTextAreaElement>) =>{
    //     setText(e.target.value);
    //     setPrompte(texte);
    // }

    // on declenche l'ajustement à chaque changement de texte
    useEffect(()=>{
        adjusteHeight();
    },  [texte])

    return (
        <>
            <textarea 
            ref={textareaRef}
            rows={1}
            value={texte}
            onChange={(e)=>setPrompte(e.target.value)}
            className="w-full h-full p-2 max-h-36
                     text-lg tracking-widest font-medium overflow-ellipse m-l-20
                     font-sans resize-none truncate
                     placeholder-gray-300::placeholder focus:outline-none 
                    " 
                     placeholder="Entrer votre prompt ..."
            ></textarea>
        </>
    )
}

export {AutoResizeTextarea};
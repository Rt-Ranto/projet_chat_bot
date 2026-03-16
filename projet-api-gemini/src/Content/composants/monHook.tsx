import React, { useEffect, useState } from "react";


function useWindowSize():number{
    const [width, setWidth] = useState<number>(
        typeof window!== "undefined" ? window.innerWidth:0);

    useEffect(()=>{
        const handleWidthChange = ()=>{
            setWidth(window.innerWidth)
            // console.log(width);
        }
        window.addEventListener('resize', handleWidthChange);

        //Nettoyage
        return ()=>{
            window.removeEventListener('resize', handleWidthChange);
        }
    }, [])// [] s'assure que l'écouteur n'est créé qu'une fois

    return width;
}
function useOnOutsizeClick({ref, callback}:{ref:React.RefObject<HTMLElement | null>, callback:()=>void}){
    useEffect(()=>{
        const listenEvent = (e:MouseEvent) =>{
            if (!ref.current || ref.current.contains(e.target as Node)) return; //return si on click à l'exterieur ou l'element n'existe pas
            callback(); // sinon on execute la fonction entrer au param
        }
        document.addEventListener('mousedown',listenEvent);
        //nettoyage
        return ()=>document.removeEventListener('mousedown',listenEvent)
    }, [ref, callback])
}

export {useOnOutsizeClick, useWindowSize}
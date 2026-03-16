import type { JSX } from "react";

type validationPassword = "faible"|"moyen"|"forte"|"tres forte" | null;
const verifyCaratere = (str:string):validationPassword =>{
    
    const maj = /[A-Z]/.test(str);
    const min = /[a-z]/.test(str);
    const num = /[0-9]/.test(str);
    const spc = /[!@#$%^&*(),.?":{}|<>]/.test(str);
    let v:validationPassword = null;
    
    if (str.length <= 5){
        v = "faible"
    }
    else if (str.length >= 8 && maj && min && num && !spc){
        v = "forte";
    }
    else if(str.length > 5 && str.length <=8 && min && maj && num && spc){
        v = "forte";
    }
    else if (str.length >= 8 && maj && min && num && spc){
        v = "tres forte";
    }
    else{
        v = "moyen";
    }
    return v;
}

const renderValidationPassword = (validation:validationPassword):JSX.Element | null =>{

    switch (validation) {
        case "faible": 
            return <p className="text-red-600">mot de passe trop courte.</p>;
        case "moyen": 
            return <p className="text-yellow-200 ">moyen.</p>;
        case "forte":
            return <p className="text-green-400">bien.</p>;
        case "tres forte":
            return <p className="text-green-200">très bien.</p>;

        default:
            return null;
            break;
    }

}
export {verifyCaratere, renderValidationPassword}
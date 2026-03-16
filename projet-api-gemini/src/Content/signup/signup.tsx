import React, { useState, type JSX } from "react";
import myImage from "../../assets/logo.png"
import { LabelFlotant } from "../composants/inputFlotant";
import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from 'react-router-dom'
import {  renderValidationPassword, verifyCaratere } from "../composants/passwordValidation";

interface IUser{
    email:string;
    password:string;
}

type validationPassword = "faible"|"moyen"|"forte"|"tres forte"|null;

export default function SignUpPage (): JSX.Element {
    const [newUser, setUser] = useState<IUser>({
        email:'',
        password:''
    });
    const [confirm, setConfirm] = useState<string>('');
    const [erreur, setErreur] = useState<string>('');
    const [passerreur, setPassError] = useState<string>('');

    const [passwordValidation, setPassValidation] = useState<validationPassword>(null);
    // const [success, setSuccess] = useState<boolean>(false);
    const navigate = useNavigate();
    // const [loading, setLoading] = useState<boolean>(false);
    
    const handlConfirmChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        setConfirm(e.target.value)
    }

    const handlChangePassword = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const value = e.target.value;
        if (value === ""){
            setPassValidation(null);
        }
        else{
            setPassValidation(verifyCaratere(value));
        }
        
        setUser({
            "email" : newUser.email,
            "password":value
        })
    }
    const handlChangeEmail = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setUser({
            "email" : e.target.value,
            "password":newUser.password
        })
    }
    // const handlChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
    //     const { name, value } = e.target;
    //     setUser({
    //         ...newUser,
    //         [name]: value // mettre à jour le champ concerner
    //     });
    //     console.log(newUser.password);
    //     console.log(passwordValidation);
    //     setPassValidation(verifyCaratere(newUser.password));
       
    // }
    const ajouter = async():Promise<void> =>{
        
        
        if (newUser.email === ""){
            setErreur("veuiller remplir le champ email");
            return;
        }
        if (newUser.password.trim() !== confirm.trim() || passwordValidation == "faible"){
            alert("Mot de passe invalide");
            return;
        }
        if (newUser.password.trim() === ""){
            setPassError("veuiller enter votre mot de passe");
            return;
        }
        
        try{
            const rep = await fetch("http://localhost:5000/api/addUser",
                { 
                    method:"POST",
                    headers:{ "Content-Type": "application/json" },
                    body:JSON.stringify({ newUser:newUser })
                }
            );
            const data = await rep.json();
            if (data.message){
                alert(data.message);
                
                navigate("/");
            }
            if (data.erreur){
                setErreur(data.erreur);
            }
        
        }catch (Error){
            console.log("Erreur:${Error}");
        }
        
    }
    return (
        <div className="w-screen h-screen bg-color1 flex items-center justify-center">
            <div className="w-1/2 min-w-120 h-2/3 bg-color2 rounded-3xl flex flex-col items-center justify-start">
                <div className="h-auto flex items-center justify-center gap-x-2 mt-6">
                    <img src={myImage} alt="logo" className="w-20 h-20"/>
                    <h1 className=" font-sans text-3xl text-gray-300 font-semibold">
                        Mon
                        <span className="text-color5"> IA</span>
                    </h1>
                </div>
                <div className="w-3/5">
                    <LabelFlotant 
                        type="email"
                        value={newUser.email}
                        onChange={handlChangeEmail}
                        onMouseEnter={()=>setErreur('')}
                        id="utilisateur"
                        name="email"
                        label="Email"
                        icon={faUser}
                    />
                    {erreur &&(
                        <div className="w-full h-6 flex items-center justify-start">
                            <p className="trcaking-wider truncate h-auto w-full  text-red-300 font-fontArial text-sm">{erreur}</p>
                        </div>
                    )}
                    <LabelFlotant
                        type="password"
                        onChange={handlChangePassword}
                        onMouseEnter={()=>setPassError('')}
                        value={newUser.password}
                        name="password"
                        label="Mot de passe"
                        id="motDePasse"
                        icon={faLock}
                    />
                    {passwordValidation &&(
                        <div className=" w-full h-4 flex items-start justify-start text-sm font-fonrArial">
                            {renderValidationPassword(passwordValidation)}
                        </div>
                    )}
                    {passerreur &&(
                        <div className=" w-full h-4 flex items-start justify-start text-sm font-fonrArial">
                            <p className="trcaking-wider h-auto w-full  text-red-300">{passerreur}</p>
                        </div>
                    )}
                    <LabelFlotant
                        type="password" 
                        label="Confirmer"
                        id="confMotDePasse"
                        value={confirm}
                        onChange={handlConfirmChange}
                        icon={faLock}
                    />
                </div>
                <p className="h-7 w-3/5 font-fontArial text-sm text-gray-300 flex items-end justify-end">je ai déjà un compte, 
                    <Link to="/" className="text-color5 underline">voulez vous  se connecter?</Link>
                </p>
                <button type="button"
                onClick={ajouter}
                className="w-3/5 h-16 mt-6 bg-color1 rounded-2xl text-gray-200
                           font-fontArial tracking-wider font-medium text-lg  
                           tracking-widest hover:bg-color3    
                "   
                >
                    Inscrire
                </button>
            </div>
        </div>
        
    )
}
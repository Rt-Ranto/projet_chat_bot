import { useState, type JSX } from "react";
import myImage from "../../assets/logo.png"
import {LabelFlotant, LabelFlotantMotPasse} from "../composants/inputFlotant";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

interface IUser{
    email:string;
    password:string;
}
interface User{
    user_Id:number;
    email?:string;
}
export default function LoginPage ({ onLoginSuccess }: { onLoginSuccess: (u: User) => void }): JSX.Element {
    const [userAuth, setUser] = useState<IUser>({
        email:'',
        password:''
    });
    const [emailError, setEmailError] = useState<string>('');
    const [passError, setPassError] = useState<string>('');
    // const navigate = useNavigate();
    const handlChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        const { name, value } = e.target;
        setUser({
            ...userAuth,
            [name]: value // mettre à jour le champ concerner
        });
    }
    const valider = async():Promise<void> =>{
        if (userAuth.email === ""){
            setEmailError('Veuiller entrer votre email.');
            return;
        }
        if (userAuth.password === ""){
            setPassError("veuiller entrer votre password.");
            return;
        }

        try{
            const rep = await fetch("http://localhost:5000/api/login",
                { 
                    method:"POST",
                    headers:{ "Content-Type": "application/json" },
                    body:JSON.stringify({ userAuth:userAuth }),
                    credentials : 'include'
                }
            );
            const data = await rep.json();
            if (data.userId){
                onLoginSuccess({user_Id:data.userId})
                console.log(data.message);
            }
            else if (data.erreur){
                setEmailError(data.erreur);
            }
            else if (data.erreur1){
                setPassError(data.erreur1)
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
                        <span className="text-color5"> ChatBot</span>
                    </h1>
                </div>
                <div className="w-3/5">
                    <LabelFlotant 
                        type="email"
                        name="email"
                        value={userAuth.email}
                        onChange={handlChange}
                        onMouseEnter={()=>setEmailError('')}
                        id="email"
                        label="Email"
                        icon={faUser}
                    />
                    {emailError &&(
                        <div className="w-full h-6 flex items-center justify-start">
                            <p className="trcaking-wider truncate h-auto w-full  text-red-500 font-fontArial text-sm">{emailError}</p>
                        </div>
                    )}
                    <LabelFlotantMotPasse 
                        label="Mot de passe"
                        name="password"
                        value={userAuth.password}
                        onChange={handlChange}
                        onMouseEnter={()=>setPassError('')}
                        id="motDePasse"
                    />
                    {passError &&(
                        <div className="w-full h-6 flex items-center justify-start">
                            <p className="trcaking-wider truncate h-auto w-full  text-red-200 font-fontArial text-sm">{passError}</p>
                        </div>
                    )}
                </div>
                <p className="h-7 w-3/5 font-fontArial text-sm text-gray-300 flex items-end justify-end">je n'ai pas un compte, 
                    <Link to="/SignUpPage" className="text-color5 underline">voulez vous s'inscrire?</Link>
                </p>
                <button type="button"
                className="w-3/5 h-16 mt-6 bg-color1 rounded-2xl text-gray-200
                           font-fontArial tracking-wider font-medium text-lg  
                           tracking-widest hover:bg-color3    
                "   
                onClick={valider}
                >
                    Connexion
                </button>
            </div>
        </div>
    )
}
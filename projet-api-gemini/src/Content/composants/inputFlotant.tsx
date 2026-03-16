import React, { useState, type InputHTMLAttributes } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

interface ILabeleFlotant extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon:IconDefinition;
}
interface ILabeleFlotantMotPasse extends InputHTMLAttributes<HTMLInputElement>{
    label:string;
}

const LabelFlotant: React.FC<ILabeleFlotant> = ({ label, icon, id, ...props }) => {
  return (
    <div className="relative mt-6 border-b-3 border-gray-300 focus-within:border-blue-600 transition-all w-full">
      <input
        {...props}
        id={id}
        className="peer h-10 w-full bg-transparent text-gray-300 font-fontArial traking-wider placeholder-transparent focus:outline-none pr-10"
        placeholder={label}
      />
      
      <label
        htmlFor={id}
        className="absolute left-0 -top-3.5 text-gray-300 text-sm transition-all
                   font-fontArial  tracking-wider  font-medium
                   peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-300 peer-placeholder-shown:top-2 
                   peer-focus:-top-3.5 peer-focus:text-blue-600 peer-focus:text-sm"
      >
        {label}
      </label>

      {/* Icône positionnée à droite */}
      <div className="absolute right-0 inset-y-0 flex items-center pr-1 pointer-events-none text-gray-400 peer-focus:text-blue-600 transition-colors">
        <FontAwesomeIcon icon={icon} className='text-2xl text-color5'/>
      </div>
    </div>
  );
};
const LabelFlotantMotPasse : React.FC<ILabeleFlotantMotPasse> = ({label,id,...props}) =>{
    const [motDePasseM, setMotPass] = useState<boolean>(false);
    const inputType = motDePasseM ? "text" : "password";
    return (
        
        <div className="relative mt-6 border-b-3 border-gray-300 focus-within:border-blue-600 transition-all w-full">
            <input
              {...props}
              type={inputType}
              id={id}
              className="peer h-10 w-full bg-transparent text-gray-300 font-fontArial 
              tracking-wider placeholder-transparent focus:outline-none pr-10"
              placeholder={label}
            />

            <label
              htmlFor={id}
              className="absolute left-0 -top-3.5 text-gray-300 text-sm transition-all
                        font-fontArial  tracking-wider  font-medium
                        peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-300 peer-placeholder-shown:top-2 
                        peer-focus:-top-3.5 peer-focus:text-blue-600 peer-focus:text-sm"
            >
              {label}
            </label>

            <button 
            type="button"
            className="absolute right-0 bottom-2 text-gray-400 hover:text-blue-600 transition-colors focus:outline-none pr-1"
            aria-label={motDePasseM ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            onClick={()=>(setMotPass(!motDePasseM))}
            >
                <FontAwesomeIcon icon={motDePasseM? faEyeSlash: faEye} className='text-2xl text-color5'/>
            </button>
        </div>
    );
}
export {LabelFlotant, LabelFlotantMotPasse};

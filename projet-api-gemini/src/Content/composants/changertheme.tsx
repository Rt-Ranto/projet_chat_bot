import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState, type ButtonHTMLAttributes } from 'react';

interface IButton extends ButtonHTMLAttributes<HTMLButtonElement>{
    label:string;
    retrecie:boolean
  }


const ChangerThemeButton :React.FC<IButton> = ({label, retrecie,...prop}) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = window.document.documentElement; // Accès à la balise <html>
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <button 
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      {...prop}
    >
      <FontAwesomeIcon 
        icon={theme === 'dark' ? faSun : faMoon}
        size='xl'
      />
      {/* {`${!retrecie ? 'mode':''} ${theme === 'dark' && !retrecie ? 'Clair' : 'Sombre'} `} */}
      {!retrecie &&(
        <span>
          {theme === 'dark' ? 'Mode Clair' : 'Mode Sombre'}
        </span> 
      )}
      
    </button>
  );
}
export default ChangerThemeButton;
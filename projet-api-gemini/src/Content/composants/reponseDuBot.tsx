import React from 'react';

interface ChatResponseProps {
  text: string;
}

const ChatResponse: React.FC<ChatResponseProps> = ({ text }) => {
  //découpage par lignes
  const lines = text.split('\n');

  const formatLine = (line: string) => {
    // Nettoyage des marqueurs markdown éventuels (ex: * ou **)
    let cleanLine = line.replace(/\*\*/g, '');

    // Regex pour les dates (ex: 1905, 1879-1955)
    const dateRegex = /(\b\d{4}(?:-\d{4})?\b)/g;
    
    // Regex pour les titres suivis de ":" (ex: "Pionnier de la physique moderne :")
    const labelRegex = /([^:*]+):/g;

    // Transformation de la ligne en fragments React
    const parts = cleanLine.split(dateRegex).map((part, i) => {
      if (dateRegex.test(part)) {
        // Style pour les dates
        return <span key={`date-${i}`} className="text-blue-400 font-mono">{part}</span>;
      }

      // Pour chaque fragment qui n'est pas une date, on cherche les labels avec ":"
      const subParts = part.split(labelRegex);
      return subParts.map((subPart, j) => {
        // Si la partie suivante dans le split originel était un label (on vérifie via l'index)
        if (j % 2 === 1) {
          return (
            <span key={`label-${j}`} className="inline-flex items-center">
              <span className="mr-1 text-green-500">•</span>
              <strong className="underline decoration-line">{subPart}</strong>:
            </span>
          );
        }
        return subPart;
      });
    });

    return parts;
  };

  return (
    <div className="max-w-[80%] min-h-12 text-gray-200 font-sans  space-y-3
        bg-color1 text-lg ml-3 text-gray-200 font-fontArial rounded-3xl px-2
        rounded-bl-none animate-skew px-2 flex flex-col items-center justify-center
    ">
      {lines.map((line, index) => (
        <p key={index} className="min-h-[1rem] overflow-clip">
          {formatLine(line)}
        </p>
      ))}
    </div>
  );
};

export default ChatResponse;
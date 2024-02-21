// components/Sidebar.js
import Link from 'next/link';
import { useState } from 'react';

export default function Sidebar() {
  const [isFieldsOpen, setIsFieldsOpen] = useState(false);

  const toggleFields = () => setIsFieldsOpen(!isFieldsOpen);

  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-5 font-bold">Gestion Immobilière</div>
      <ul className="flex flex-col flex-1">
        <li className="px-5 py-2 hover:bg-gray-700">
            <a href="/categories">Catégories</a>
        </li>
        <li className="px-5 py-2 hover:bg-gray-700">
          <button onClick={toggleFields} className="w-full text-left">
            Champs
          </button>
          {isFieldsOpen && (
            <ul className="pl-8 py-2 space-y-2">
              <li className="hover:text-gray-300">
                <a href="/fields/shorttext">Texte Court</a>
              </li>
              <li className="hover:text-gray-300">
                <a href="/fields/longtext">Texte Long</a>
              </li>
              <li className="hover:text-gray-300">
                <a href="/fields/date">Date</a>
              </li>
              <li className="hover:text-gray-300">
                <a  href="/fields/integer">Nombre Entier</a>
              </li>
              <li className="hover:text-gray-300">
                <a href="/fields/select">Sélection</a>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
}

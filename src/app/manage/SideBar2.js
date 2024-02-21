// components/Sidebar.js
import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai'

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isFieldsOpen, setIsFieldsOpen] = useState(false);

    const toggleDrawer = () => setIsOpen(!isOpen);
    const toggleFields = () => setIsFieldsOpen(!isFieldsOpen);

    return (
        <>
            {/* Bouton pour afficher le drawer */}
            <div className="fixed top-0 left-0 right-0 z-50 m-6 flex justify-center">
                <button onClick={toggleDrawer} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                    {isOpen ? 'Hide navigation' : 'Show navigation'}
                </button>
            </div>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={toggleDrawer}></div>
            )}

            {/* Drawer component */}
            <div id="drawer-navigation" className={`fixed top-0 left-0 z-40 w-64 h-screen p-4 overflow-y-auto transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} bg-white dark:bg-gray-800`} tabIndex="-1" >
                <h5 id="drawer-navigation-label" className="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">Menu</h5>
                <button onClick={toggleDrawer} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                    <AiOutlineClose className="close-button" size={25} />
                </button>
                <div className="py-4 overflow-y-auto">
                    <ul className="space-y-2">
                        <li>
                            <a href="/manage/CategoryList" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                <span className="ml-3">Categories</span>
                            </a>
                        </li>
                        <li>
                            <button type="button" onClick={toggleFields} className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" aria-controls="dropdown-example">
                                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Champs</span>
                                <svg className="w-3 h-3" aria-hidden="true" fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                </svg>
                            </button>
                            {isFieldsOpen && (
                                <ul id="dropdown-example" className="py-2 space-y-2 pl-11">
                                    <li><a href="/manage/FieldList/ShortTextField" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Texte Court</a></li>
                                    <li><a href="/manage/FieldList/LongTextField" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Texte Long</a></li>
                                    <li><a href="/manage/FieldList/DateField" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Date</a></li>
                                    <li><a href="/manage/FieldList/IntegerField" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Nombre Entier</a></li>
                                    <li><a href="/manage/FieldList/SelectField" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Sélection</a></li>
                                </ul>
                            )}
                        </li>
                        <li>
                            <a href="/manage/CityList" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                <span className="ml-3">Cities</span>
                            </a>
                        </li>
                        <li>
                            <a href="/manage/DistrictList" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                <span className="ml-3">Districts</span>
                            </a>
                        </li>
                        {/* Add more menu items here */}
                    </ul>
                </div>
            </div>
        </>
    );
}

"use client"
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'
import CreationModal from '../CreationModal';
import CategorynDistrictSelectionModal from '../CategorynDistrictSelectionModal';
import CategoryFieldsModal from '../CategoryFieldsModal';
import ImagesUploadModal from '../ImagesUploadModal';

const ListingPage = () => {
    const [activeModal, setActiveModal] = useState(null);
    const searchParams = useSearchParams()
    const openCreationModal = searchParams.get('openCreationModal')

    useEffect(() => {
        if (openCreationModal) {
            setActiveModal(openCreationModal);
        } else {
            setActiveModal(null);
        }
        console.log(activeModal)
    }, [openCreationModal]);


    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const renderModal = () => {
        switch (activeModal) {
            case 'creation':
                return <CreationModal onNext={() => setActiveModal("categoryDistrictSelection")} />;
            case 'categoryDistrictSelection':
                return <CategorynDistrictSelectionModal onNext={() => setActiveModal("categoryFields")} />;
            case 'categoryFields':
                return <CategoryFieldsModal onNext={() => setActiveModal("imagesUpload")} />;
            case 'imagesUpload':
                return <ImagesUploadModal onNext={console.log("imagesUpload")} />;
            default:
                return null;
        }
    };

    return (
        <div>
            <p>Listing Page Content</p>
            {renderModal()}
        </div>
    );
};

export default ListingPage;

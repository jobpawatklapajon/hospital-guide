import { useState, useEffect, lazy, Suspense, useMemo, useCallback } from "react";
import { FaHospital, FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";
import { HiOutlineMap } from "react-icons/hi";
import PropTypes from 'prop-types';
import clinicData from '../data/clinics.json';

// Lazy load components
const ClinicItem = lazy(() => import('./ClinicItem'));
const ClinicGuide = lazy(() => import('./ClinicGuide'));

// LazyImage component for optimized image loading
export const LazyImage = ({ src, alt, className }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    
    return (
        <div className={`${className} relative`}>
            {!isLoaded && (
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center animate-pulse">
                    <div className="w-8 h-8 border-2 border-[#0077B6] border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            <img
                src={`${import.meta.env.BASE_URL.replace(/\/$/, '')}${src}`}
                alt={alt}
                className={`${className} ${!isLoaded ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} transition-all duration-300 ease-in-out`}
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
            />
        </div>
    );
};

LazyImage.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    className: PropTypes.string
};

// Loading fallback component
const LoadingFallback = () => (
    <div className="animate-pulse bg-gray-200 h-24 w-24 rounded-lg" />
);

// Back button component
const BackButton = ({ onClick, icon: Icon, text }) => (
    <button 
        onClick={onClick}
        className="flex items-center justify-center bg-[#7ac142] text-white px-5 py-2.5 rounded-lg hover:bg-[#68a936] transition-all shadow-sm hover:shadow font-medium w-full max-w-xs"
    >
        <Icon size={16} className="mr-2" />
        {text}
    </button>
);

BackButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    icon: PropTypes.elementType.isRequired,
    text: PropTypes.string.isRequired
};

// Main component
export default function ClinicList({ selectedBuild, handleSelectedBuild, selectedClinic, setSelectedClinic }) {
    const [clinics] = useState(clinicData.clinics);

    const handleClinicSelect = useCallback((clinic) => {
        setSelectedClinic(clinic);
    }, [setSelectedClinic]);

    const handleBackToBuildings = useCallback(() => {
        handleSelectedBuild(null);
        setSelectedClinic(null);
    }, [handleSelectedBuild, setSelectedClinic]);

    const handleBackToClinicList = useCallback(() => {
        setSelectedClinic(null);
    }, [setSelectedClinic]);

    // Memoize clinic lists to prevent unnecessary re-renders
    const allClinics = useMemo(() => 
        clinics.map((clinic, index) => (
            <div key={index}>
                <Suspense fallback={<LoadingFallback />}>
                    <ClinicItem 
                        clinic={clinic} 
                        handleClinicSelect={handleClinicSelect} 
                    />
                </Suspense>
            </div>
        )), [clinics, handleClinicSelect]);

    const clinicsInBuild = useMemo(() => 
        clinics
            .filter(clinic => clinic.build === selectedBuild)
            .map((clinic, index) => (
                <Suspense 
                    key={index} 
                    fallback={<LoadingFallback />}
                >
                    <ClinicItem 
                        clinic={clinic} 
                        handleClinicSelect={handleClinicSelect} 
                    />
                </Suspense>
            )), [clinics, selectedBuild, handleClinicSelect]);

    // If a clinic is selected, show the image navigation guide
    if (selectedClinic) {
        return (
            <Suspense fallback={
                <div className="h-full w-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7ac142]" />
                </div>
            }>
                <ClinicGuide 
                    selectedClinic={selectedClinic} 
                    handleBackToClinicList={handleBackToClinicList} 
                    handleBackToBuildings={handleBackToBuildings} 
                />
            </Suspense>
        );
    }

    // Render appropriate view based on selection state
    return (
        <div className="h-full w-full overflow-y-auto px-4 pt-5 pb-20">
            {selectedBuild == null ? (
                // All clinics view
                <>
                    <div className="flex items-center mb-6">
                        <HiOutlineMap size={24} className="text-[#7ac142] mr-2" />
                        <h2 className="text-xl font-bold text-gray-800">คลินิกทั้งหมด</h2>
                    </div>
                    <div className="grid grid-cols-4 gap-4 p-2">
                        {allClinics}
                    </div>
                </>
            ) : (
                // Building-specific clinics view
                <>
                    <div className="mb-6 flex items-center">
                        <FaHospital size={24} className="text-[#7ac142] mr-2" /> 
                        <h1 className="text-xl font-bold text-gray-800">
                            {selectedBuild}
                        </h1>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 p-2">
                        {clinicsInBuild}
                    </div>
                    
                    <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-center shadow-md border-t border-[#7ac142]/20 mx-4 mb-2 rounded-t-xl bg-white/70 backdrop-blur-md">
                        <BackButton 
                            onClick={handleBackToBuildings}
                            icon={FaArrowLeft}
                            text="คลินิกทั้งหมด"
                        />
                    </div>
                </>
            )}
        </div>
    );
}

ClinicList.propTypes = {
    selectedBuild: PropTypes.string,
    handleSelectedBuild: PropTypes.func.isRequired,
    selectedClinic: PropTypes.object,
    setSelectedClinic: PropTypes.func.isRequired
};
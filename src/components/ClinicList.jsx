import { useState, useEffect, lazy, Suspense, useMemo, useCallback, useRef } from "react";
import { FaHospital, FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";
import { HiOutlineMap } from "react-icons/hi";
import PropTypes from 'prop-types';
import clinicData from '../data/clinics.json';

// Lazy load components with explicit preloading hints
const ClinicItem = lazy(() => {
    // Add a small delay to ensure smooth transitions
    return Promise.all([
        import('./ClinicItem'),
        new Promise(resolve => setTimeout(resolve, 50))
    ]).then(([moduleExports]) => moduleExports);
});

const ClinicGuide = lazy(() => {
    // Add a small delay to ensure smooth transitions
    return Promise.all([
        import('./ClinicGuide'),
        new Promise(resolve => setTimeout(resolve, 50))
    ]).then(([moduleExports]) => moduleExports);
});

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

// Loading indicator for infinite scroll
const LoadingIndicator = () => (
    <div className="flex justify-center items-center py-4">
        <div className="w-8 h-8 border-2 border-[#7ac142] border-t-transparent rounded-full animate-spin"></div>
    </div>
);

// Main component
export default function ClinicList({ selectedBuild, handleSelectedBuild, selectedClinic, setSelectedClinic }) {
    const [clinics] = useState(clinicData.clinics);
    const [visibleItems, setVisibleItems] = useState(5);
    const [isLoading, setIsLoading] = useState(false);
    const containerRef = useRef(null);
    const loaderRef = useRef(null);
    
    const handleClinicSelect = useCallback((clinic) => {
        setSelectedClinic(clinic);
    }, [setSelectedClinic]);

    const handleBackToBuildings = useCallback(() => {
        setTimeout(() => {
            handleSelectedBuild(null);
            setSelectedClinic(null);
            setVisibleItems(5); // Reset visible items when going back
        }, 0);
    }, [handleSelectedBuild, setSelectedClinic]);

    const handleBackToClinicList = useCallback(() => {
        setTimeout(() => {
            setSelectedClinic(null);
        }, 0);
    }, [setSelectedClinic]);

    // Setup infinite scroll observer
    useEffect(() => {
        // Skip if already selected a clinic
        if (selectedClinic) return;
        
        const loadMoreItems = () => {
            setIsLoading(true);
            setTimeout(() => {
                setVisibleItems(prev => prev + 5);
                setIsLoading(false);
            }, 500); // Small delay to show loading effect
        };

        const handleObserver = (entries) => {
            const target = entries[0];
            if (target.isIntersecting && !isLoading) {
                const filteredClinics = selectedBuild 
                    ? clinics.filter(clinic => clinic.build === selectedBuild)
                    : clinics;
                
                // Only load more if there are more items to show
                if (filteredClinics.length > visibleItems) {
                    loadMoreItems();
                }
            }
        };

        const observer = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: '20px',
            threshold: 0.1
        });

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [clinics, selectedBuild, visibleItems, isLoading, selectedClinic]);

    // Reset visible items when changing between all clinics and building-specific views
    useEffect(() => {
        setVisibleItems(5);
    }, [selectedBuild]);

    // Memoize clinic lists to prevent unnecessary re-renders
    const allClinics = useMemo(() => {
        const clinicsToRender = clinics.slice(0, visibleItems);
        return clinicsToRender.map((clinic, index) => (
            <div key={index}>
                <Suspense fallback={<LoadingFallback />}>
                    <ClinicItem 
                        clinic={clinic} 
                        handleClinicSelect={handleClinicSelect} 
                    />
                </Suspense>
            </div>
        ));
    }, [clinics, handleClinicSelect, visibleItems]);

    const clinicsInBuild = useMemo(() => {
        const filteredClinics = clinics.filter(clinic => clinic.build === selectedBuild);
        const clinicsToRender = filteredClinics.slice(0, visibleItems);
        return clinicsToRender.map((clinic, index) => (
            <Suspense 
                key={index} 
                fallback={<LoadingFallback />}
            >
                <ClinicItem 
                    clinic={clinic} 
                    handleClinicSelect={handleClinicSelect} 
                />
            </Suspense>
        ));
    }, [clinics, selectedBuild, handleClinicSelect, visibleItems]);

    // Check if there are more items to load
    const hasMoreAllClinics = clinics.length > visibleItems;
    const hasMoreBuildingClinics = clinics.filter(clinic => clinic.build === selectedBuild).length > visibleItems;
    const shouldShowLoader = selectedBuild === null ? hasMoreAllClinics : hasMoreBuildingClinics;

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
        <div 
            ref={containerRef} 
            className="h-full w-full overflow-y-auto px-4 pt-5 pb-20"
        >
            {selectedBuild == null ? (
                // All clinics view
                <>
                    <div className="flex items-center mb-6">
                        <HiOutlineMap size={24} className="text-[#7ac142] mr-2" />
                        <h2 className="text-xl font-bold text-gray-800">คลินิกทั้งหมด</h2>
                    </div>
                    <div className="grid grid-cols-3 gap-4 p-2">
                        {allClinics}
                    </div>
                    {shouldShowLoader && (
                        <div ref={loaderRef}>
                            <LoadingIndicator />
                        </div>
                    )}
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
                    
                    <div className="grid grid-cols-3 gap-4 p-2">
                        {clinicsInBuild}
                    </div>
                    
                    {shouldShowLoader && (
                        <div ref={loaderRef}>
                            <LoadingIndicator />
                        </div>
                    )}
                    
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
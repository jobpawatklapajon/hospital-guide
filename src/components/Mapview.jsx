import { useState, useEffect, useCallback, useRef } from "react";
import { buildings, buildingStyles } from '../data/buildings';

// Constants
const MAP_IMAGES = {
    'อาคารอำนวยการ 11 ชั้น': 'TopView-1.webp',
    'อาคารศูนย์โรคหัวใจ': 'TopView-2.webp',
    'อาคารออร์โธปิดิกส์': 'TopView-3.webp',
    'อาคารเจ้าพระยายมราช': 'TopView-4.webp',
    'อาคารสนับสนุนทางการแพทย์': 'TopView-5.webp',
    'สำนักงานเทศบาลเมืองสุพรรณบุรี': 'TopView-6.webp',
    'อาคารจอดรถ 7 ชั้น': 'TopView-7.webp',
    'อนุสาวรีย์ท่านเจ้าคุณ': 'TopView-8.webp',
    'default': 'TopView-(all).webp'
};

// Get base URL that works both in development and production
const getBaseUrl = () => {
    const base = import.meta.env.BASE_URL || '/hospital-guide/';
    return base.endsWith('/') ? base : `${base}/`;
};

// Main MapView component
const MapView = ({ setSelectedBuild, build }) => {
    const [imgUrl, setImgUrl] = useState(`${getBaseUrl()}maps/${MAP_IMAGES.default}`);
    const [selectedStyle, setSelectedStyle] = useState(null);
    const [imgError, setImgError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        const mapImage = MAP_IMAGES[build] || MAP_IMAGES.default;
        const newImageUrl = `${getBaseUrl()}maps/${mapImage}`;
        
        // Only change the URL if it's different
        if (newImageUrl !== imgUrl) {
            setIsLoaded(false);
            setImgUrl(newImageUrl);
            setImgError(false);
        }

        // Find the building style for the selected building
        const building = buildings.find(b => b.name === build);
        if (building) {
            setSelectedStyle(buildingStyles[building.className]);
        } else {
            setSelectedStyle(null);
        }
    }, [build, imgUrl]);

    const handleClick = useCallback((name, event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        setSelectedBuild(name, event);
    }, [setSelectedBuild]);

    const handleTouchStart = useCallback((e, name) => {
        e.preventDefault();
        handleClick(name, e);
    }, [handleClick]);

    const handleImageError = () => {
        setImgError(true);
        setIsLoaded(true);
        console.error(`Failed to load image: ${imgUrl}`);
    };

    const handleImageLoad = () => {
        setIsLoaded(true);
    };

    return (
        <div className="relative overflow-hidden rounded-xl shadow-xl bg-white flex items-center justify-center">
            <div className="relative w-full h-full">
                {!isLoaded && !imgError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                        <div className="w-10 h-10 border-2 border-[#7ac142] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {imgError ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600">
                        Map image could not be loaded
                    </div>
                ) : (
                    <img
                        ref={imgRef}
                        src={imgUrl}
                        alt="แผนที่โรงพยาบาล"
                        className={`rounded-xl z-0 select-none w-full h-full object-contain transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                        loading="lazy"
                        decoding="async"
                        onError={handleImageError}
                        onLoad={handleImageLoad}
                    />
                )}
                {buildings.map((building) => (
                    <div
                        key={building.id}
                        className={`${buildingStyles[building.className]} ${selectedStyle === buildingStyles[building.className] ? 'opacity-70' : 'opacity-0'}`}
                        onClick={(e) => handleClick(building.name, e)}
                        onTouchStart={(e) => handleTouchStart(e, building.name)}
                    />
                ))}
            </div>
        </div>
    );
};

export default MapView;

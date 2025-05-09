import { useState, useEffect, useCallback } from "react";
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

// Main MapView component
const MapView = ({ setSelectedBuild, build }) => {
    const [imgUrl, setImgUrl] = useState(`${import.meta.env.BASE_URL.replace(/\/$/, '')}/maps/${MAP_IMAGES.default}`);
    const [selectedStyle, setSelectedStyle] = useState(null);

    useEffect(() => {
        const mapImage = MAP_IMAGES[build] || MAP_IMAGES.default;
        const newImageUrl = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/maps/${mapImage}`;
        setImgUrl(newImageUrl);

        // Find the building style for the selected building
        const building = buildings.find(b => b.name === build);
        if (building) {
            setSelectedStyle(buildingStyles[building.className]);
        } else {
            setSelectedStyle(null);
        }
    }, [build]);

    const handleClick = useCallback((name, event) => {
        setSelectedBuild(name, event);
    }, [setSelectedBuild]);

    const handleTouchStart = useCallback((e, name) => {
        handleClick(name, e);
    }, [handleClick]);

    return (
        <div className="relative overflow-hidden rounded-xl shadow-xl bg-white flex items-center justify-center">
            <div className="relative w-full h-full">
                <img
                    src={imgUrl}
                    alt="แผนที่โรงพยาบาล"
                    className="rounded-xl z-0 select-none pointer-events-none"
                    loading="eager"
                    decoding="async"
                />
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

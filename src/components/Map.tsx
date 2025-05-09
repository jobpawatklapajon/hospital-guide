export const buildings = [
  { id: 1, number: 1, name: "อาคารอำนวยการ 11 ชั้น", className: "building1-1" },
  { id: 2, number: 1, name: "อาคารอำนวยการ 11 ชั้น", className: "building1-2" },
  { id: 3, number: 2, name: "อาคารศูนย์โรคหัวใจ", className: "building2-1" },
  { id: 4, number: 2, name: "อาคารศูนย์โรคหัวใจ", className: "building2-2" },
  { id: 5, number: 3, name: "อาคารออร์โธปิดิกส์", className: "building3" },
  { id: 6, number: 4, name: "อาคารเจ้าพระยายมราช", className: "building4" },
  { id: 7, number: 5, name: "อาคารสนับสนุนทางการแพทย์", className: "building5" },
  { id: 8, number: 6, name: "สำนักงานเทศบาลเมืองสุพรรณบุรี", className: "building6" },
] as const;

type BuildingClassName = typeof buildings[number]['className'];

export const overlay_building: Record<BuildingClassName, string> = {
  "building1-1": "absolute top-[23.7%] left-[51.5%] w-[24.5%] h-[21.7%] bg-[#FFFFFF] rounded-tl-[8%] rounded-bl-[8%] opacity-0 hover:opacity-70 hover:shadow-[0_0_20px_rgba(0,119,182,0.6)] transition-all duration-300 cursor-pointer",
  "building1-2": "absolute top-[3.5%] left-[76%] w-[12.5%] h-[41.8%] bg-[#FFFFFF] rounded-[8.8%] rounded-bl-none opacity-0 hover:opacity-70 hover:shadow-[0_0_20px_rgba(0,119,182,0.6)] transition-all duration-300 cursor-pointer",
  "building2-1": "absolute top-[47%] left-[51.5%] w-[21%] h-[34.2%] bg-[#FFFFFF] rounded-[6%] rounded-tr-none opacity-0 hover:opacity-70 hover:shadow-[0_0_20px_rgba(239,71,111,0.6)] transition-all duration-300 cursor-pointer",
  "building2-2": "absolute top-[47%] left-[72.5%] w-[16.1%] h-[24.5%] bg-[#FFFFFF] rounded-[10%] rounded-tl-none rounded-bl-none opacity-0 hover:opacity-70 hover:shadow-[0_0_20px_rgba(239,71,111,0.6)] transition-all duration-300 cursor-pointer",
  "building3": "absolute top-[3.8%] left-[51.5%] w-[23.8%] h-[18.1%] bg-[#FFFFFF] rounded-[10%] opacity-0 hover:opacity-70 hover:shadow-[0_0_20px_rgba(6,214,160,0.6)] transition-all duration-300 cursor-pointer",
  "building4": "absolute top-[24.3%] left-[33.3%] w-[17.6%] h-[17.2%] bg-[#FFFFFF] rounded-[10%] opacity-0 hover:opacity-70 hover:shadow-[0_0_20px_rgba(255,209,102,0.6)] transition-all duration-300 cursor-pointer",
  "building5": "absolute top-[22.8%] left-[0.8%] w-[15%] h-[47.4%] bg-[#FFFFFF] rounded-[7%] opacity-0 hover:opacity-70 hover:shadow-[0_0_20px_rgba(17,138,178,0.6)] transition-all duration-300 cursor-pointer",
  "building6": "absolute bottom-[0.8%] right-[0.8%] w-[6.5%] h-[12%] bg-[#FFFFFF] rounded-[23%] opacity-0 hover:opacity-70 hover:shadow-[0_0_20px_rgba(7,59,76,0.6)] transition-all duration-300 cursor-pointer",
}; 

interface MapProps {
  selectedBuilding: string;
  onBuildingSelect?: (buildingClass: string) => void;
  imageBasePath?: string;
}

export default function Map({ selectedBuilding, onBuildingSelect, imageBasePath = '/maps/' }: MapProps) {
  // Get building number from selected building class
  const getMapImagePath = () => {
    if (!selectedBuilding) return `${imageBasePath}/maps/TopView-(all).webp`;
    
    // Find the building with the matching className
    const building = buildings.find(b => b.className === selectedBuilding);
    if (!building) return `${imageBasePath}/maps/TopView-(all).webp`;
    
    return `${imageBasePath}/maps/TopView-${building.number}.webp`;
  };

  const handleBuildingClick = (buildingClass: string) => {
    if (onBuildingSelect) {
      onBuildingSelect(buildingClass);
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Map Image */}
      <img 
        src={getMapImagePath()} 
        alt="Hospital Map" 
        className="w-full h-auto"
      />
      
      {/* Building Overlays */}
      {buildings.map((building) => (
        <div
          key={building.id}
          className={`${overlay_building[building.className]} ${
            selectedBuilding === building.className 
              ? "opacity-50 shadow-[0_0_30px_rgba(59,130,246,0.8)]" 
              : ""
          }`}
          onClick={() => handleBuildingClick(building.className)}
          title={building.name}
        />
      ))}
    </div>
  );
}
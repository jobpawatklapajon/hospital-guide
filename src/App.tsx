import { useState, useEffect, useRef } from 'react'
import './App.css'
import Map from './components/Map'
import { buildings } from './components/Map'
import clinicsData from './data/clinics.json'

// Base path for images
const IMAGE_BASE_PATH = '/hospital-guide/';

// Lazy Image component
function LazyImage({ src, alt, className, placeholderClass }: { src: string, alt: string, className: string, placeholderClass?: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={imgRef} className={className}>
      {isVisible ? (
        <>
          {!isLoaded && <div className={`${placeholderClass || ''} animate-pulse bg-gray-200 rounded-full w-full h-full`}></div>}
          <img 
            src={src} 
            alt={alt} 
            className={`w-full h-full object-contain transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
            onLoad={() => setIsLoaded(true)}
            style={{ display: isLoaded ? 'block' : 'none' }}
          />
        </>
      ) : (
        <div className={`${placeholderClass || ''} animate-pulse bg-gray-200 rounded-full w-full h-full`}></div>
      )}
    </div>
  );
}

function App() {
  const [selectedBuilding, setSelectedBuilding] = useState<string>('');
  const [selectedClinic, setSelectedClinic] = useState<any>(null);

  const handleBuildingSelect = (buildingClass: string) => {
    setSelectedBuilding(buildingClass);
    setSelectedClinic(null); // Clear selected clinic when building changes
  };

  // Get the name of the selected building
  const getSelectedBuildingName = () => {
    const building = buildings.find(b => b.className === selectedBuilding);
    return building ? building.name : '';
  };

  // Filter clinics by selected building
  const getFilteredClinics = () => {
    if (!selectedBuilding) {
      return clinicsData; // Show all clinics if no building is selected
    }
    
    const buildingName = getSelectedBuildingName();
    return clinicsData.filter(clinic => clinic.build === buildingName);
  };

  const handleClinicSelect = (clinic: any) => {
    setSelectedClinic(clinic);
  };

  // Helper function to get full image path
  const getImagePath = (relativePath: string) => {
    // If the path already includes http or https, assume it's an external URL
    if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
      return relativePath;
    }
    // Otherwise, prepend the base path
    return `${IMAGE_BASE_PATH}${relativePath.startsWith('/') ? '' : '/'}${relativePath}`;
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-50 overflow-hidden">
      {/* Fixed map section - reduced height on mobile */}
      <div className="sticky top-0 z-10 bg-white shadow-md w-full flex-shrink-0" style={{ height: '20vh', minHeight: '120px', maxHeight: '150px' }}>
        <Map 
          selectedBuilding={selectedBuilding} 
          onBuildingSelect={handleBuildingSelect} 
          imageBasePath={IMAGE_BASE_PATH}
        />
      </div>
      
      {/* Scrollable content section - using remaining space with better touch handling */}
      <div className="flex-1 overflow-y-auto overscroll-contain -webkit-overflow-scrolling-touch" style={{ height: 'calc(80vh - 0px)' }}>
        {/* Building selection info */}
        {selectedBuilding && (
          <div className="m-3 bg-white rounded-lg shadow-md overflow-hidden border border-blue-100">
            <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
              <h2 className="text-lg md:text-xl font-semibold text-blue-800">อาคารที่เลือก: {getSelectedBuildingName()}</h2>
            </div>
            <div className="p-3">
              <button 
                className="w-full md:w-auto px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-md transition-colors duration-200 shadow-sm text-sm md:text-base font-medium" 
                onClick={() => {
                  setSelectedBuilding('');
                  setSelectedClinic(null);
                }}
              >
                กลับไปยังแผนที่รวม
              </button>
            </div>
          </div>
        )}

        {/* Clinic details with navigation guide */}
        {selectedClinic && (
          <div className="m-3 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                {selectedClinic.name}
              </h2>
              <p className="text-sm text-gray-600 mt-1">อาคาร: {selectedClinic.build}</p>
            </div>
            <div className="p-3">
              <button 
                className="w-full md:w-auto px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-md transition-colors duration-200 shadow-sm text-sm md:text-base font-medium" 
                onClick={() => setSelectedClinic(null)}
              >
                กลับไปยังรายการคลินิก
              </button>
              
              <div className="mt-6">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 text-center">แนะนำการเดินทาง:</h3>
                <div className="flex flex-col space-y-4">
                  {selectedClinic.navigation_guide.map((guide: any, index: number) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                      <div className="relative">
                        <LazyImage 
                          src={getImagePath(guide.path)} 
                          alt={`Step ${index + 1}`} 
                          className="w-full h-auto" 
                        />
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                          <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                            <span className="text-sm font-bold">{index + 1}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 pt-6 text-center">
                        <p className="text-sm md:text-base text-gray-700">{guide.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Clinic list section */}
        {!selectedClinic && (
          <div className="m-3 pb-6">
            <div className="bg-white rounded-lg shadow-md mb-3 py-3 px-4">
              <h2 className="text-lg md:text-xl font-semibold text-center text-gray-800">
                {selectedBuilding 
                  ? `คลินิกในอาคาร ${getSelectedBuildingName()}` 
                  : 'คลินิกทั้งหมด'}
              </h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {getFilteredClinics().map((clinic, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-200 active:bg-blue-50 transition-all duration-200 cursor-pointer overflow-hidden touch-manipulation"
                  onClick={() => handleClinicSelect(clinic)}
                >
                  <div className="p-3 flex flex-col items-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-50 rounded-full p-2 flex items-center justify-center mb-2">
                      <LazyImage 
                        src={getImagePath(clinic.icon)} 
                        alt={clinic.name} 
                        className="w-10 h-10 md:w-14 md:h-14 object-contain" 
                      />
                    </div>
                    <p className="text-xs md:text-sm text-center text-gray-700 font-medium line-clamp-2">{clinic.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

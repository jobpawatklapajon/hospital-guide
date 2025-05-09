import { useState, useEffect, useRef } from 'react'
import './App.css'
import Map from './components/Map'
import { buildings } from './components/Map'
import clinicsData from './data/clinics.json'

// Base path for images
const IMAGE_BASE_PATH = '/hospital-guide/';

// Lazy Image component with error handling and optimization
function LazyImage({ src, alt, className, placeholderClass }: { src: string, alt: string, className: string, placeholderClass?: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create a more performance-friendly observer with higher thresholds
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // Delay loading slightly to prevent too many concurrent loads
        setTimeout(() => {
          setIsVisible(true);
        }, Math.random() * 300); // Random delay between 0-300ms to stagger loading
        observer.disconnect();
      }
    }, { 
      threshold: 0.1,
      rootMargin: '100px' // Start loading when within 100px of viewport
    });

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Handle image loading errors
  const handleError = () => {
    setHasError(true);
    setIsLoaded(true); // Consider it "loaded" to remove loading state
    
    // Log error for debugging
    console.error(`Failed to load image: ${src}`);
  };

  // Optimize image path - potentially add size parameters for dynamic resizing
  const getOptimizedImagePath = (originalPath: string) => {
    // For external images, can't modify
    if (originalPath.startsWith('http://') || originalPath.startsWith('https://')) {
      return originalPath;
    }
    
    // For local images, could add query params for size if you have an image processing server
    // e.g., return `${originalPath}?width=150&quality=70`;
    return originalPath;
  };

  return (
    <div ref={imgRef} className={className}>
      {isVisible ? (
        <>
          {!isLoaded && !hasError && (
            <div className={`${placeholderClass || ''} animate-pulse bg-gray-200 rounded-full w-full h-full`}></div>
          )}
          {hasError ? (
            // Fallback for error cases
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-full">
              <svg className="w-1/2 h-1/2 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          ) : (
            <img 
              src={getOptimizedImagePath(src)} 
              alt={alt} 
              className={`w-full h-full object-contain transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
              onLoad={() => setIsLoaded(true)}
              onError={handleError}
              style={{ display: isLoaded ? 'block' : 'none' }}
              loading="lazy" // Use built-in lazy loading as additional help
              decoding="async" // Use async decoding to prevent UI blocking
            />
          )}
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
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  // Track app initialization
  useEffect(() => {
    // Mark page as loaded after a small delay to ensure stability
    setTimeout(() => {
      setIsPageLoaded(true);
    }, 300);

    // Add error boundary for the whole app
    const handleGlobalError = (event: ErrorEvent) => {
      console.error('Global error caught:', event.error);
      // Could implement more robust error handling here
    };

    window.addEventListener('error', handleGlobalError);
    return () => window.removeEventListener('error', handleGlobalError);
  }, []);

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

  // Limit the number of clinics to display at once to improve performance
  const getOptimizedClinicList = () => {
    const filteredClinics = getFilteredClinics();
    
    // On mobile, we might want to limit the initial load
    const isMobile = window.innerWidth < 768;
    
    // Show all clinics when page is fully loaded, or just first batch on mobile
    return isPageLoaded || !isMobile ? filteredClinics : filteredClinics.slice(0, 12);
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
                  {(selectedClinic.navigation_guide || []).slice(0, 5).map((guide: any, index: number) => (
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
                  
                  {selectedClinic.navigation_guide && selectedClinic.navigation_guide.length > 5 && (
                    <div className="text-center text-gray-500 text-sm">
                      ...และอีก {selectedClinic.navigation_guide.length - 5} ขั้นตอน
                    </div>
                  )}
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
              {getOptimizedClinicList().map((clinic, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-200 active:bg-blue-50 transition-all duration-200 cursor-pointer overflow-hidden touch-manipulation"
                  onClick={() => handleClinicSelect(clinic)}
                >
                  <div className="p-3 flex flex-col items-center">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-50 rounded-full p-2 flex items-center justify-center mb-2">
                      <LazyImage 
                        src={getImagePath(clinic.icon)} 
                        alt={clinic.name} 
                        className="w-8 h-8 md:w-10 md:h-10 object-contain" 
                      />
                    </div>
                    <p className="text-xs md:text-sm text-center text-gray-700 font-medium line-clamp-2">{clinic.name}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Load more button for mobile if needed */}
            {!isPageLoaded && window.innerWidth < 768 && getFilteredClinics().length > 12 && (
              <div className="text-center mt-4">
                <button 
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200 shadow-sm text-sm font-medium"
                  onClick={() => setIsPageLoaded(true)}
                >
                  แสดงคลินิกเพิ่มเติม ({getFilteredClinics().length - 12})
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App

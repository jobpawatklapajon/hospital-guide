import MapView from './components/Mapview.jsx';
import ClinicList from './components/ClinicList.jsx';
import { useState, useCallback, useEffect, Suspense, lazy } from 'react';

// Lazy load components
const LazyClinicList = lazy(() => import('./components/ClinicList.jsx'));

function App() {
  // State management
  const [selectedBuild, setSelectedBuild] = useState(null);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if device is mobile and setup performance optimizations
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Add delay to ensure smooth initial loading
    const loadTimer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(loadTimer);
    };
  }, []);

  // Event handlers
  const handleSelectedBuild = useCallback((build, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setSelectedBuild(build);
    setMapExpanded(false);
  }, []);

  const handleMapTouch = useCallback((event) => {
    if (event) {
      event.preventDefault();
    }
    setMapExpanded(false);
  }, []);

  const handleClinicTouch = useCallback((event) => {
    if (event) {
      event.preventDefault();
    }
    if (!selectedClinic) {
      setMapExpanded(false);
    }
  }, [selectedClinic]);

  // Component styles
  const mapContainerClass = `
    transition-all 
    duration-300 
    ease-in-out 
    ${selectedClinic ? 'h-0' : mapExpanded ? 'h-2/5' : 'h-2/5'} 
    shadow-md 
    rounded-b-xl 
    overflow-hidden
    touch-none
  `;
  
  const clinicListContainerClass = `
    bg-white 
    transition-all 
    duration-300 
    ease-in-out 
    ${selectedClinic ? 'h-full flex-1' : mapExpanded ? 'h-3/5' : 'h-3/5'} 
    overflow-y-auto
    rounded-t-xl
    shadow-inner
    border-t
    border-gray-200
  `;

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen w-screen bg-gray-50 items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#7ac142] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 font-medium">กำลังโหลด...</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-screen w-screen bg-gray-50 transition-all duration-300 overflow-hidden'>
      {/* Map Section */}
      <div 
        className={mapContainerClass}
        onClick={handleMapTouch}
        onTouchStart={handleMapTouch}
      >
        {!selectedClinic && (
          <div className='flex items-center justify-center h-full'>
            <MapView 
              setSelectedBuild={handleSelectedBuild} 
              build={selectedBuild} 
            />
          </div>
        )}
      </div>
      
      {/* Clinic List Section */}
      <div 
        className={clinicListContainerClass}
        onClick={handleClinicTouch}
        onTouchStart={handleClinicTouch}
      >
        <div className="px-2 py-1 bg-green-200 rounded-full w-20 mx-auto mt-2 mb-2">
          <div className="h-1.5 bg-green-500 rounded-full"></div>
        </div>
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <div className="w-10 h-10 border-2 border-[#7ac142] border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <ClinicList 
            selectedBuild={selectedBuild} 
            handleSelectedBuild={handleSelectedBuild} 
            selectedClinic={selectedClinic} 
            setSelectedClinic={setSelectedClinic} 
            isMobile={isMobile}
          />
        </Suspense>
      </div>
    </div>
  );
}

export default App;

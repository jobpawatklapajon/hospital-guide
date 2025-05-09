import MapView from './components/Mapview.jsx';
import { useState, useCallback, useEffect, lazy, Suspense } from 'react';

// Lazy load ClinicList component
const ClinicList = lazy(() => import('./components/ClinicList.jsx'));

function App() {
  // State management
  const [selectedBuild, setSelectedBuild] = useState(null);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapVisible, setMapVisible] = useState(true);

  // Component styles
  const mapContainerClass = `
    h-2/5
    shadow-md 
    rounded-b-xl 
    overflow-hidden
    touch-none
    ${mapVisible ? '' : 'hidden'}
  `;
  
  const clinicListContainerClass = `
    bg-white 
    ${mapVisible ? 'h-3/5' : 'h-full'}
    overflow-y-auto
    rounded-t-xl
    shadow-inner
    border-t
    border-gray-200
  `;

  // Initialize app with a short timeout to ensure smooth initial rendering
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Event handlers
  const handleSelectedBuild = useCallback((build, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setSelectedBuild(build);
  }, []);

  const handleInteraction = useCallback((event) => {
    if (event) {
      event.preventDefault();
    }
  }, []);

  // Toggle map visibility (hiding map can improve performance on mobile)
  const toggleMapVisibility = useCallback(() => {
    setMapVisible(prev => !prev);
  }, []);

  // Simple loading screen
  if (isLoading) {
    return (
      <div className="flex flex-col h-screen w-screen bg-white items-center justify-center">
        <div className="w-12 h-12 border-3 border-[#7ac142] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-screen w-screen bg-gray-50 overflow-hidden'>
      {/* Map Section */}
      <div 
        className={mapContainerClass}
        onClick={handleInteraction}
        onTouchStart={handleInteraction}
      >
        <div className='flex items-center justify-center h-full'>
          <MapView 
            setSelectedBuild={handleSelectedBuild} 
            build={selectedBuild} 
          />
        </div>
      </div>
      
      {/* Clinic List Section */}
      <div 
        className={clinicListContainerClass}
        onClick={handleInteraction}
        onTouchStart={handleInteraction}
      >
        <div 
          className="px-2 py-1 bg-green-200 rounded-full w-20 mx-auto mt-2 mb-2"
          onClick={toggleMapVisibility}
        >
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
          />
        </Suspense>
      </div>
    </div>
  );
}

export default App;

import { useState } from "react";
import { MdOutlineNavigateNext, MdOutlineNavigateBefore } from "react-icons/md";
import { HiOutlineMapPin } from "react-icons/hi2";
import { FaArrowLeft } from "react-icons/fa";
import { HiOutlineMap } from "react-icons/hi2";
import { LazyImage } from "./ClinicList";

export default function ClinicGuide({
  selectedClinic,
  handleBackToClinicList,
  handleBackToBuildings,
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = selectedClinic.navigation_guide.length;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Get current navigation step
  const currentNavigation = selectedClinic.navigation_guide[currentStep];

  return (
    <div className="h-full w-full overflow-y-auto px-4 pt-5 pb-20 relative">
      <div className="mb-6 flex items-center">
        <HiOutlineMapPin size={24} className="text-[#7ac142] mr-2" />
        <h2 className="text-lg font-bold text-gray-800">
          {selectedClinic.name}
        </h2>
      </div>

      <div className="flex flex-col items-center p-2 max-w-2xl mx-auto">
        {/* Only render the current step */}
        <div className="mb-8 w-full">
          <div className="flex items-center mb-3 bg-[#f9f9f9] p-3 rounded-lg shadow-sm border-l-4 border-[#7ac142]">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#7ac142] text-white font-medium mr-3">
              {currentStep + 1}
            </div>
            <p className="text-sm font-medium text-gray-700">
              {currentNavigation.description}
            </p>
          </div>
          <div className="border border-[#f0f0f0] rounded-lg overflow-hidden shadow-sm">
            <LazyImage
              src={currentNavigation.path}
              alt={`Navigation step ${currentStep + 1}`}
              className="max-w-full h-auto"
            />
          </div>
        </div>

        {/* Step indicator */}
        {totalSteps > 1 && (
          <div className="flex items-center justify-center gap-2 mb-4">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <button 
                key={index} 
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? "bg-[#7ac142]" : "bg-gray-300"
                }`}
                onClick={() => setCurrentStep(index)}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Navigation buttons */}
        {totalSteps > 1 && (
          <div className="flex justify-center gap-4 mb-4">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex items-center justify-center px-3 py-2 rounded-lg transition-all shadow-sm hover:shadow font-medium ${
                currentStep === 0 
                ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <MdOutlineNavigateBefore size={20} />
            </button>
            <div className="text-sm text-gray-600 flex items-center">
              {currentStep + 1} / {totalSteps}
            </div>
            <button
              onClick={handleNext}
              disabled={currentStep === totalSteps - 1}
              className={`flex items-center justify-center px-3 py-2 rounded-lg transition-all shadow-sm hover:shadow font-medium ${
                currentStep === totalSteps - 1 
                ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <MdOutlineNavigateNext size={20} />
            </button>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-center shadow-md border-t border-[#7ac142]/20 mx-4 mb-2 rounded-t-xl bg-white/70 backdrop-blur-md gap-x-2">
        <button
          onClick={handleBackToClinicList}
          className="flex items-center justify-center bg-[#7ac142] text-white px-5 py-2.5 rounded-lg hover:bg-[#68a936] transition-all shadow-sm hover:shadow font-medium"
        >
          <FaArrowLeft size={16} className="mr-2" />
          กลับ
        </button>
        <button
          onClick={handleBackToBuildings}
          className="bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg flex items-center hover:bg-gray-50 transition-all shadow-sm hover:shadow font-medium"
        >
          <HiOutlineMap size={16} className="mr-2 text-[#7ac142]" />
          คลินิกทั้งหมด
        </button>
      </div>
    </div>
  );
}

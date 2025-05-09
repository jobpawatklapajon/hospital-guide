import { LazyImage } from './ClinicList';

export default function ClinicItem({clinic, handleClinicSelect}) {
    return (
        <div 
            className="w-20 h-20 p-3 bg-white shadow-sm hover:shadow transition-all cursor-pointer flex flex-col items-center justify-center text-center mb-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            onClick={() => handleClinicSelect(clinic)}
        >
            <LazyImage src={clinic.icon} alt={clinic.name} className="w-16 h-16 object-contain" />
        </div>
    )
}
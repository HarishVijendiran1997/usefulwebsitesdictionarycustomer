
import {  FaSpinner } from 'react-icons/fa';
const LoadingIndicator = () => (
    <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
        <FaSpinner className="animate-spin text-gray-400" />
    </div>
);

export default LoadingIndicator;
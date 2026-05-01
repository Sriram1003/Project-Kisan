import React from 'react';
import { Wheat } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <div className="text-center mb-10 md:mb-16">
      <div className="flex items-center justify-center mb-4">
        <div className="p-3 bg-green-100 rounded-2xl mr-4 shadow-inner">
          <Wheat className="w-8 h-8 md:w-10 md:h-10 text-green-700" />
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900 uppercase italic">
          Project <span className="text-green-700 not-italic">Kisan</span>
        </h1>
      </div>
      <p className="text-sm md:text-lg text-gray-500 font-medium tracking-[0.2em] uppercase">
        Advanced AI Agriculture Assistant
      </p>
    </div>
  );
};

export default Header;
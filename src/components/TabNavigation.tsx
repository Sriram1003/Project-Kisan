import React from 'react';
import { Sprout, TrendingUp, CloudSun } from 'lucide-react';
import { TabType } from '../App';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'diagnosis' as TabType, label: 'Crop Diagnosis', icon: Sprout },
    { id: 'market' as TabType, label: 'Market Analysis', icon: TrendingUp },
    { id: 'weather' as TabType, label: 'Weather', icon: CloudSun },
  ];

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-3 md:gap-6 mb-8 md:mb-12">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`field-btn flex items-center justify-center w-full sm:w-auto px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs border-2 transition-all ${
            activeTab === id
              ? 'bg-green-700 text-white border-green-700 shadow-green-200'
              : 'bg-white text-gray-500 border-gray-100 hover:border-green-200 hover:text-green-700'
          }`}
        >
          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 mr-3 ${activeTab === id ? 'text-white' : 'text-green-600'}`} />
          {label}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
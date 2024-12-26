// src/components/ui/TabComponent.jsx

import React, { useState } from 'react';

// TabList Component
export const TabList = ({ children, ...props }) => (
  <div className="flex border-b border-gray-200" {...props}>
    {children}
  </div>
);

// Tab Component
export const Tab = ({ isActive, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium ${isActive ? 'border-blue-500 text-blue-600' : 'text-gray-600'} border-b-2`}
  >
    {children}
  </button>
);

// TabPanel Component
export const TabPanel = ({ isActive, children }) => (
  <div className={`p-4 ${isActive ? 'block' : 'hidden'}`}>
    {children}
  </div>
);

// Main TabComponent Component
const TabComponent = ({ defaultTab = 0, children }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div>
      <TabList>
        {React.Children.map(children, (child, index) => {
          if (child.type === Tab) {
            return React.cloneElement(child, {
              isActive: index === activeTab,
              onClick: () => setActiveTab(index),
            });
          }
          return null;
        })}
      </TabList>
      {React.Children.map(children, (child, index) => {
        if (child.type === TabPanel) {
          return React.cloneElement(child, {
            isActive: index === activeTab,
          });
        }
        return null;
      })}
    </div>
  );
};

export default TabComponent;

import { useState } from 'react';

export const Tabs = ({ defaultValue, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return <div>{children(activeTab, setActiveTab)}</div>;
};

export const TabsList = ({ children }) => (
  <div className="flex">{children}</div>
);

export const TabsTrigger = ({ value, setActiveTab, children }) => (
  <button
    className="px-4 py-2 border-b-2"
    onClick={() => setActiveTab(value)}
  >
    {children}
  </button>
);

export const TabsContent = ({ value, activeTab, children }) => (
  activeTab === value ? <div>{children}</div> : null
);




















// import React, { useState, Children, cloneElement } from 'react';

// export const Tabs = ({ defaultValue, children }) => {
//   const [activeTab, setActiveTab] = useState(defaultValue);

//   // Render children based on render props pattern or cloneElement
//   return (
//     <div>
//       {Children.map(children, child =>
//         cloneElement(child, { activeTab, setActiveTab })
//       )}
//     </div>
//   );
// };

// export const TabsList = ({ children }) => (
//   <div className="flex">{children}</div>
// );

// export const TabsTrigger = ({ value, activeTab, setActiveTab, children }) => (
//   <button
//     className={`px-4 py-2 border-b-2 ${activeTab === value ? 'border-blue-500' : 'border-transparent'}`}
//     onClick={() => setActiveTab(value)}
//   >
//     {children}
//   </button>
// );

// export const TabsContent = ({ value, activeTab, children }) => (
//   activeTab === value ? <div>{children}</div> : null
// );

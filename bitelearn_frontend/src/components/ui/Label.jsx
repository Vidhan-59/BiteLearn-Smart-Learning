// import React from 'react';

// export function Label({ htmlFor, children }) {
//   return (
//     <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 md:text-lg">
//       {children}
//     </label>
//   );
// }


export const Label = ({ htmlFor, children }) => {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 md:text-lg">
      {children}
    </label>
  );
};

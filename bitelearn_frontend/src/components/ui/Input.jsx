// import React from 'react';

// export const Input = ({ id, value, onChange, ...props }) => {
//   return (
//     <input
//       id={id}
//       value={value}
//       onChange={onChange}
//       {...props}
//       className="border p-2 rounded w-full"
//     />
//   );
// };


export const Input = ({ id, value, onChange, type = 'text', className = '', ...props }) => {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      className={`border p-2 rounded w-full ${className}`}
      {...props}
    />
  );
};

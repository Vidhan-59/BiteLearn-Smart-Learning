// import React from 'react';

// export function Button({ type = "button", children, className }) {
//   return (
//     <button
//       type={type}
//       className={`inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-md font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${className}`}

//     >
//       {children}
//     </button>
//   );
// }

import React from 'react';

// Define the Button component
const Button = ({ asChild, variant = 'default', children, className = '', type = 'button', ...props }) => {
  // Base styles for the button
  const baseStyle = 'inline-flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2';

  // Variant styles for different button types
  const variants = {
    default: 'bg-black text-white hover:bg-gray-800 focus:ring-black',
    outline: 'border-black text-black hover:bg-gray-100 focus:ring-black',
    ghost: 'text-black hover:bg-gray-100 focus:ring-black',
  };

  // Combine base styles with variant styles and additional classes
  const combinedStyles = `${baseStyle} ${variants[variant]} ${className}`;

  // If asChild is true, render the button as a child of another component
  if (asChild) {
    const { as: Component = 'button', ...restProps } = props;
    return (
      <Component type={type} className={combinedStyles} {...restProps}>
        {children}
      </Component>
    );
  }

  // Render the button normally
  return (
    <button type={type} className={combinedStyles} {...props}>
      {children}
    </button>
  );
};

export { Button };


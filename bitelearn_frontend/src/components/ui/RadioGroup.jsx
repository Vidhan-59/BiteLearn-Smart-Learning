import React from 'react';

export const RadioGroup = ({ value, onValueChange, children, className }) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          checked: child.props.value === value,
          onChange: () => onValueChange(child.props.value),
        })
      )}
    </div>
  );
};

export const RadioGroupItem = ({ value, checked, onChange, id, children }) => {
  return (
    <div className="flex items-center">
      <input
        type="radio"
        id={id}
        value={value}
        checked={checked}
        onChange={onChange}
        className="form-radio h-4 w-4 text-blue-600 border-gray-300"
      />
      <label
        htmlFor={id}
        className="ml-2 text-gray-700 cursor-pointer"
      >
        {children}
      </label>
    </div>
  );
};

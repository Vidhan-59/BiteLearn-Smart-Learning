import React from 'react';
import classNames from 'classnames';

export function Badge({ variant = 'default', className, children }) {
  const baseStyles = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium';

  const variants = {
    default: 'bg-gray-100 text-gray-800',
    secondary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
  };

  const badgeClassName = classNames(baseStyles, variants[variant], className);

  return <span className={badgeClassName}>{children}</span>;
}

import classNames from 'classnames';
import React from 'react';

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = props => {
  return (
    <button
      {...props}
      className={classNames(
        'rounded-full bg-emerald-500 hover:bg-emerald-700 py-2 px-8',
        props.className
      )}
    />
  );
};

export default Button;

import classNames from 'classnames';
import React from 'react';

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = props => {
  return <button {...props} className={classNames('rounded-full bg-green', props.className)} />;
};

export default Button;

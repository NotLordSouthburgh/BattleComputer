import React, { useState } from 'react';

type ActionButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  label: string;
};
export const ActionButton = ({ onClick, label }: ActionButtonProps) => {
  return (
    <button
      className={`w-48  bg-regionLight h-16`}
      // size={size}
      // style={buttonStyle}
      // type="button"
      // icon={ButtonUtils.getButtonIconName(buttonType, buttonPlacement)}
      onClick={onClick}
      // disabled={disabled || ButtonUtils.isDisabledButton(buttonType, this.props)}
    >
      {label}
    </button>
  );
};

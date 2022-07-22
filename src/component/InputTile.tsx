import React, { useRef, useState } from 'react';
import { useRecoilState } from 'recoil';

import { battleBoardState, garrisonState } from '../logic/recoil';
import { UnitDefs, UnitTypes } from '../logic/unitdefs';

type InputTileProps = {
  unittype: UnitTypes;
  useGarrison?: boolean;
};

export function InputTile({ unittype, useGarrison }: InputTileProps) {
  const [battleBoard, setBattleBoard] = useRecoilState(battleBoardState);
  const [garrison, setGarrison] = useRecoilState(garrisonState);
  const inputElement = useRef<HTMLInputElement>(null);

  function getValue() {
    if (useGarrison) return garrison[unittype] || 0;

    const data = UnitDefs[unittype];

    if (data.player) {
      return battleBoard.player[unittype] || 0;
    }
    return battleBoard.adversary[unittype] || 0;
  }

  function setValue(value: number) {
    console.log('setValue:', value);
    const data = UnitDefs[unittype];

    if (useGarrison) {
      return setGarrison({
        ...garrison,
        [unittype]: value,
      });
    }

    if (data.player) {
      return setBattleBoard({
        ...battleBoard,
        player: {
          ...battleBoard.player,
          [unittype]: value,
        },
      });
    }
    return setBattleBoard({
      ...battleBoard,
      adversary: {
        ...battleBoard.adversary,
        [unittype]: value,
      },
    });
  }

  function onMouseEnter() {
    if (inputElement.current) {
      (inputElement.current as any).focus();
      (inputElement.current as any).select();
    }
  }

  const minValue = 0;
  const maxValue = 1000;

  function onWheel(e: React.WheelEvent<HTMLInputElement>) {
    e.preventDefault();
    // this.decrementOrIncrementValueByStepAmount('increment', event.deltaY);
    console.log('WHEEL:' + e.deltaY);
  }

  function applyDelta(delta: number) {
    // const { maxValue, minValue, onChange, precision, value, valueType } = this.props;
    const currentValue = getValue();
    let newValue = currentValue + delta;

    if (newValue < minValue) {
      newValue = minValue;
    } else if (newValue > maxValue) {
      newValue = maxValue;
    }

    setValue(newValue);

    // if (Validators.isValidValue(newValue, valueType)) {
    //   onChange(NumberUtils.getValueWithPrecisionAsString(newValue, valueType, precision));
    // }

    // this.timeoutIDMap[buttonType] = 0;
  }

  function Clear() {
    setValue(0);
  }

  function changeValue(e: React.ChangeEvent<HTMLInputElement>) {
    // const {
    //   allowEmptyValue,
    //   maxValue,
    //   minValue,
    //   onChange,
    //   precision,
    //   valueType,
    // } = this.props;
    const newValue = getParsedValue(e.target.value);

    setValue(newValue);

    // if (Validators.isValidValue(newValue, valueType) && newValue >= minValue && newValue <= maxValue) {
    //   onChange(NumberUtils.getValueWithPrecisionAsString(newValue, valueType, precision, value));
    // } else if (allowEmptyValue && !value) {
    //   onChange('');
    // }
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    let handled = false;

    switch (event.key) {
      case 'ArrowUp':
      case '+':
        // if (event.ctrlKey) {
        //   _.times(2, () => decrementOrIncrementValue('increment'));
        // } else {
        applyDelta(1);
        // }
        // handled = true;
        break;

      case 'ArrowDown':
      case '-':
        // if (event.ctrlKey) {
        //   _.times(2, () => this.decrementOrIncrementValue('decrement'));
        // } else {
        applyDelta(-1);
        // }
        handled = true;
        break;

      case 'PageUp':
        // _.times(2, () => this.decrementOrIncrementValue('increment'));
        handled = true;
        break;

      case 'PageDown':
        // _.times(2, () => this.decrementOrIncrementValue('decrement'));
        handled = true;
        break;

      // no default
    }

    if (handled) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  const data = UnitDefs[unittype];
  // return (<NumberInput buttonPlacement="leftAndRight" value={1} onChange={()=>{}} />)
  if (!data) throw new Error('Unknown unit type ' + unittype);

  const any = getValue() > 0;

  return (
    <div
      style={{ width: '18rem' }}
      onMouseEnter={onMouseEnter}
      className={`p-0 m-1 mx-auto rounded flex flex-col items-center  ${
        any ? 'bg-tilebackground' : 'bg-disabled'
      }`}
    >
      <div
        className="text-white"
        // style={{ textShadow: '0 2px 4px rgba(0,0,0,1);' }}
      >
        {data.name}
      </div>
      <div className="flex flex-row space-x-1">
        <div className=" flex h-18 w-18 min-w-18">
          <img
            className="h-12 w-12 relative top-0 left-0"
            src={data.unitURL}
            alt="Unit"
          />
          <img
            className="h-12 w-12 relative top-4 -left-6 -mr-6 mb-6"
            src={data.weaponURL}
            alt="Weapon"
          />
        </div>
        <CalculatorButton label="C" onClick={() => Clear()} tall />
        <div className={`ui input `}>
          {/* <ActiveListener onWheel={onWheel}> */}
          <input
            ref={inputElement}
            // ref={(node) => {
            //   console.log('REF SET BIT', node);
            //   // inputElement;
            // }}
            type="text"
            className="text-center text-4xl w-20 bg-regionLight"
            style={{ height: '4.25rem' }}
            // maxLength={maxLength}
            // placeholder={placeholder}
            value={getValue()}
            onChange={changeValue}
            // onBlur={this.onInputBlur}
            onKeyDown={onKeyDown}
          />
          {/* </ActiveListener> */}
        </div>
        <div className="flex flex-col space-y-1">
          <CalculatorButton label="+" onClick={() => applyDelta(1)} />
          <CalculatorButton label="-" onClick={() => applyDelta(-1)} />
        </div>
        <div className="flex flex-col  space-y-1">
          <CalculatorButton label=">>" onClick={() => applyDelta(10)} />
          <CalculatorButton label="<<" onClick={() => applyDelta(-10)} />
        </div>
      </div>
    </div>
  );
}

type CalculatorButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  label: string;
  tall?: boolean;
};

const CalculatorButton = ({ onClick, label, tall }: CalculatorButtonProps) => {
  return (
    <button
      tabIndex={-1}
      className={`w-8  bg-regionLight`}
      style={{ height: tall ? '4.25rem' : '2rem' }}
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

function getParsedValue(value: string): number {
  return parseInt(value, 10);
}

// static getValueWithPrecisionAsString(
//   value: number,
//   valueType: ValueType,
//   precision: number,
//   valueStr?: string
// ): string {
//   if (valueType === 'integer') {
//     return value.toString();
//   }

//   const factor = 10 ** precision;
//   const decimalValueStr = (Math.round(value * factor) / factor).toString();
//   return valueStr && valueStr[valueStr.length - 1] === '.' ? `${decimalValueStr}.` : decimalValueStr;
// }

// function former_buttonry(){
//   return (
//     <div>
//       <div style={{ display: 'flex' }}>
//         <button
//           className="w-10 h-10 bg-blue-500"
//           // size={size}
//           // style={buttonStyle}
//           // type="button"
//           // icon={ButtonUtils.getButtonIconName(buttonType, buttonPlacement)}
//           onClick={() => applyDelta(-10)}
//           // disabled={disabled || ButtonUtils.isDisabledButton(buttonType, this.props)}
//         >
//           {'<<'}
//         </button>
//         <button
//           className="w-10 h-10 bg-blue-500"
//           // size={size}
//           // style={buttonStyle}
//           // type="button"
//           // icon={ButtonUtils.getButtonIconName(buttonType, buttonPlacement)}
//           onClick={() => applyDelta(-1)}
//           // disabled={disabled || ButtonUtils.isDisabledButton(buttonType, this.props)}
//         />
//         {/* {this.getButtonComponent('decrement')} */}
//         <div className={`ui input `}>
//           <ActiveListener onWheel={onWheel}>
//             <input
//               type="text"
//               className="text-center text-3xl w-20 h-10"
//               // maxLength={maxLength}
//               // placeholder={placeholder}
//               value={value}
//               // onChange={this.changeValue}
//               // onBlur={this.onInputBlur}
//               onKeyDown={onKeyDown}
//             />
//           </ActiveListener>
//           <button
//             className="w-10 h-10 bg-blue-500"
//             // size={size}
//             // style={buttonStyle}
//             // type="button"
//             // icon={ButtonUtils.getButtonIconName(buttonType, buttonPlacement)}
//             onClick={() => applyDelta(1)}
//             // disabled={disabled || ButtonUtils.isDisabledButton(buttonType, this.props)}
//           />
//           <button
//             className="w-10 h-10 bg-blue-500"
//             // size={size}
//             // style={buttonStyle}
//             // type="button"
//             // icon={ButtonUtils.getButtonIconName(buttonType, buttonPlacement)}
//             onClick={() => applyDelta(10)}
//             // disabled={disabled || ButtonUtils.isDisabledButton(buttonType, this.props)}
//           />
//         </div>
//       </div>
//     </div>)
// }

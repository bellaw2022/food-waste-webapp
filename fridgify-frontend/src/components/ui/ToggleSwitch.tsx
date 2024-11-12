// import React from 'react';
// import styled from 'styled-components';

// type SwitchProps = {
//   checked: boolean;
//   onChange: (checked: boolean) => void;
// };

// // Styled components for the switch slider
// const SwitchLabel = styled.label`
//   position: relative;
//   display: inline-block;
//   width: 42px;
//   height: 24px;
// `;

// const SwitchInput = styled.input`
//   opacity: 0;
//   width: 0;
//   height: 0;
// `;

// const Slider = styled.span<{ checked: boolean }>`
//   position: absolute;
//   cursor: pointer;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background-color: ${({ checked }) => (checked ? '#4caf50' : '#ccc')};
//   transition: 0.4s;
//   border-radius: 24px;

//   &::before {
//     position: absolute;
//     content: "";
//     height: 18px;
//     width: 18px;
//     left: ${({ checked }) => (checked ? '18px' : '3px')};
//     bottom: 3px;
//     background-color: white;
//     transition: 0.4s;
//     border-radius: 50%;
//   }
// `;

// export const Switch: React.FC<SwitchProps> = ({ checked, onChange }) => {
//   return (
//     <SwitchLabel onClick={() => onChange(!checked)}>
//       <SwitchInput
//         type="checkbox"
//         checked={checked}
//         readOnly
//       />
//       <Slider checked={checked} />
//     </SwitchLabel>
//   );
// };



import { useState, ChangeEvent } from "react";
import styled from "styled-components";

// Styled components for the switch slider
const SwitchLabel = styled.label`
  position: relative;
  display: inline-block;
  width: 42px;
  height: 24px;
`;

const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const Slider = styled.span<{ checked: boolean }>`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ checked }) => (checked ? '#3EA32E' : '#ccc')}; 
  transition: 0.4s;
  border-radius: 24px;

  &::before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: ${({ checked }) => (checked ? '18px' : '3px')};
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

export default function ToggleSwitch() {
  const [switchState, setSwitchState] = useState(false);

  function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    setSwitchState(e.target.checked);
  }

  return (
    <SwitchLabel>
      <SwitchInput
        type="checkbox"
        checked={switchState}
        onChange={handleOnChange}
      />
      <Slider checked={switchState} />
    </SwitchLabel>
  );
}

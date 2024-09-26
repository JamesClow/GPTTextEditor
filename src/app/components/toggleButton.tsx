'use client';
import { css } from '@emotion/react';

interface ToggleButtonProps {
  leftLabel: string, 
  rightLabel: string, 
  leftActive: boolean,
  onChange: (value: boolean) => void
}
export default function ToggleButton({leftLabel, rightLabel, leftActive, onChange}: ToggleButtonProps) {
  return (
    <div css={style} className={"flex items-center inline-flex rounded"} onClick={() => onChange(!leftActive)}>
      <div className={"left-label px-4 py-2 border-r rounded-l " + (leftActive ? "active shadow" : "border")}>
        {leftLabel}  
      </div>
      <div className={"right-label px-4 py-2 rounded-r " + (!leftActive ? "active shadow" : "border")}>
        {rightLabel}
      </div>
    </div>
  );
}

const style = css`
  .active{
    background-color: var(--primary);
    color: #FFF;
  }
  :hover{
    cursor: pointer;
  }
  user-select: none;
`
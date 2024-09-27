import { css } from '@emotion/react';

export enum BUTTON_COLOR {
  primary = 'var(--primary)',
  secondary = 'var(--secondary)',
  success =  'var(--success)',
  danger = 'var(--danger)',
  warning = 'var(--warning)',
  info = 'var(--info)',
  light = 'var(--light)',
  dark = 'var(--dark)',
  white = '#FFF'
}
interface ButtonProps {
  title: string,
  className?: string,
  color?: BUTTON_COLOR,
  onClick?: () => void
}
export default function Button({title, className, color, onClick}: ButtonProps) {
  return (
    <div css={style(color && color || BUTTON_COLOR.white)} className={"button cursor-pointer rounded px-4 py-2 shadow-md border inline-block text-white "+ className} onClick={() => onClick && onClick()}>{title}</div>
  )
}

const style = (color: BUTTON_COLOR) => css`
  background-color: ${color};
  ${color === BUTTON_COLOR.white && `color: rgb(23, 23, 23);`}
`
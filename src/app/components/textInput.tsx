import {KeyboardEvent, useState} from 'react';
import TextareaAutosize from 'react-textarea-autosize';

interface TextInputProps {
  value: string,
  placeholder: string,
  onChange: (value: string) => void;
  onKeyDown?: (e: KeyboardEvent) => void;
}
export default function TexInput({value, placeholder, onChange, onKeyDown}: TextInputProps) {
  return (
    <TextareaAutosize className="rounded flex-1 w-full px-6 py-3 border resize-none bg-gray-100" rows={1} value={value} onChange={e => onChange(e.target.value)} onKeyDown={(e) => onKeyDown && onKeyDown(e)} placeholder={placeholder}/>
  )
}
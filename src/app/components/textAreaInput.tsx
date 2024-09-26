import {useState} from 'react';
import TextareaAutosize from 'react-textarea-autosize';

interface TextAreaInputProps {
  value: string,
  placeholder: string,
  onChange: (value: string) => void;
}
export default function TextAreaInput({value, placeholder, onChange}: TextAreaInputProps) {
  return (
    <TextareaAutosize className="rounded flex-1 w-100 px-6 py-3 outline-none resize-none" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}/>
  )
}
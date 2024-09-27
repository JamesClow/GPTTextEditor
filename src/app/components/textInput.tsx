import {KeyboardEvent, useState} from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import {useEffect} from 'react';

interface TextInputProps {
  value: string,
  placeholder: string,
  onChange: (value: string) => void;
  onKeyDown?: (e: KeyboardEvent) => void;
  isLoading?: boolean;
}
export default function TexInput({value, placeholder, onChange, onKeyDown, isLoading}: TextInputProps) {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setProgress(10); // Reset progress when loading starts
      interval = setInterval(() => {
        setProgress((prevProgress) => Math.min(prevProgress + 5, 100)); // Increment progress
      }, 100); // Progress updates every 100ms
    } else {
      setProgress(100); // Ensure progress is fully 100% when loading is done
      setTimeout(() => setProgress(0), 300); // Optional: Reset after a small delay
    }

    return () => clearInterval(interval); // Clear interval when component unmounts or request finishes
  }, [isLoading]);

  return (
    <div className="relative w-full">
      <TextareaAutosize className="rounded flex-1 w-full px-6 py-3 border resize-none bg-gray-100" rows={1} value={value} onChange={e => onChange(e.target.value)} onKeyDown={(e) => onKeyDown && onKeyDown(e)} placeholder={placeholder}/>
      {isLoading && (
          <div className="absolute left-0 bottom-0 h-1 bg-green-500" style={{ width: `${progress}%`, transition: 'width 0.1s linear' }} />
        )}
    </div>  
  )
}
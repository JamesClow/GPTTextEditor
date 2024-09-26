import {useState} from 'react';

interface CollapsibleSectionProps {
  title: string,
  children: React.ReactNode
}
export default function CollapsibleSection({title, children}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(true);
  return (
    <div className='flex flex-col mb-4'>
      <div className="section-header text-gray-300 mb-1 select-none hover:cursor-pointer flex-1" onClick={() => setOpen(!open)}>
        {title}
      </div>
      {open && (
        <div className="section-body flex-1 w-100">
          {children}
        </div>
      )}
    </div>
  )
};
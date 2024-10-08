import React, { useState, useRef, useEffect } from 'react';
import { Change, diffWords } from 'diff';
import { diff_match_patch, Diff } from 'diff-match-patch';
import { diffSentences } from 'diff';
import { useRecoilState } from 'recoil';
import { clearTextState } from '../store/editor';

interface EditableTextProps {
  newText: string;
  setText: string;
  placeholder?: string,
  onChange: (value: string) => void;
}
export default function EditableText ({newText, setText, placeholder, onChange}:EditableTextProps) {
  const [mounted, setMounted] = useState(false);
  const editableRef = useRef<HTMLDivElement>(null);
  const dmp = new diff_match_patch();

  const [clearText, setClearText] = useRecoilState(clearTextState);

  useEffect(() => {
    if(!mounted){
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    if(editableRef.current && mounted){
      const newHtml = generateDiffHtml(editableRef.current.innerText, newText);
      editableRef.current.innerHTML = newHtml;
      onInput();
    }
  }, [newText]);

  useEffect(() => {
    if(editableRef.current && mounted){
      editableRef.current.innerHTML = setText;
    }
  }, [setText]);

  useEffect(() => {
    if(editableRef.current && mounted){
      editableRef.current.innerHTML = clearText;
      onChange(clearText);
    }
  }, [clearText]);

  function generateDiffHtml(text1: string, text2: string){
    // const diffs = dmp.diff_main(text1, text2);
    // dmp.diff_cleanupSemantic(diffs);
    // let html = '';
    // diffs.forEach((part) => {
    //   const text = part[1].replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    //   if (part[0] === diff_match_patch.DIFF_INSERT) {
    //     html += `<span class="addition bg-green-200">${text}</span>`;
    //   } else if (part[0] === diff_match_patch.DIFF_DELETE) {
    //     html += `<span class="deletion bg-red-200 line-through">${text}</span>`;
    //   } else {
    //     html += text;
    //   }
    // });
    // return html;
    const diffs = diffWords(text1, text2);
    let html = '';
    diffs.forEach((part) => {
      const text = part.value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      if (part.added) {
        html += `<span class="addition bg-green-200">${text}</span>`;
      } else if (part.removed) {
        html += `<span class="deletion bg-red-200">${text}</span>`;
      } else {
        html += text;
      }
    });
    return html;
  };

  function onInput(){
    if(editableRef.current){
      const innerHTMLText = editableRef.current.innerHTML;
      // remove all deletions
      const strippedText = innerHTMLText.replace(/<span class="deletion bg-red-200">(.+?)<\/span>/g, '');
      // remove all tags
      const strippedText2 = strippedText.replace(/<[^>]*>/g, '');
      onChange(strippedText2);
    }
  };

  function onFocus(){
    //remove the placeholder
    if(editableRef.current){
      if(editableRef.current.innerText === placeholder){
        editableRef.current.innerText = '';
      }
    }
  }

  return (
    <div
      ref={editableRef}
      className="rounded flex-1 w-100 px-6 py-3 text-lg outline-none resize-none"
      contentEditable
      onInput={onInput}
      suppressContentEditableWarning={true}
      onFocus={onFocus}
    >{placeholder}</div>
  );
};
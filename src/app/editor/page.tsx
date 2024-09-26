'use client';
import ToggleButton from '../components/toggleButton';
import { editingState, promptState, versionState, wipState, extraStepsState, newTextState, fixedTextState, gptSKState, personalityState } from '../store/editor';
import { useRecoilState } from 'recoil';
import TextAreaInput from '../components/textAreaInput';
import TextInput from '../components/textInput';
import { KeyboardEvent, useEffect, useState } from 'react';
import { updatePrompt, addExtraStep, addPersonality } from '../functions/prompt';
import CollapsibleSection from '../components/collapsibleSection';
import EditableText from '../components/editableText';
import CryptoJS, { enc } from 'crypto-js';

const ENCRYPTED_SK_KEY = 'ENCRYPTED_SK_KEY';
const EXTRA_STEPS_KEY = 'EXTRA_STEPS_KEY';
const PERSONALITIES_KEY = 'PERSONALITIES_KEY';

export default function EditorPage(){
  const [editing, setEditing] = useRecoilState(editingState);
  const [wip, setWip] = useRecoilState(wipState);
  const [prompt, setPrompt] = useRecoilState(promptState);
  const [versions, setVersions] = useRecoilState(versionState);
  const [extraSteps, setExtraSteps] = useRecoilState(extraStepsState);
  const [newText, setNewText] = useRecoilState(newTextState);
  const [fixedText, setFixedText] = useRecoilState(fixedTextState);
  const [gptSK, setGptSK] = useRecoilState(gptSKState);
  const [personalities, setPersonalities] = useRecoilState(personalityState);
  

  const [personalitiesInput, setPersonalitiesInput]= useState("");
  const [extraStepInput, setExtraStepInput]= useState("");
  const [loadedLocalStorage, setLoadedLocalStorage] = useState(false);

  const password = 'password';

  // Run when compoenent mounts
  useEffect(() => {
    if(!loadedLocalStorage){
      // set the GPT SK if it is stored in local storage
      const encryptedSK = localStorage.getItem(ENCRYPTED_SK_KEY);
      if(encryptedSK){
        const decrypted = CryptoJS.AES.decrypt(encryptedSK, password).toString(CryptoJS.enc.Utf8);
        setGptSK(decrypted);
      }

      // set the extra steps if they are stored in local storage
      const extraSteps = localStorage.getItem(EXTRA_STEPS_KEY);
      if(extraSteps){
        setExtraSteps(JSON.parse(extraSteps));
      }

      //set the personalities if they are stored in local storage
      const personalities = localStorage.getItem(PERSONALITIES_KEY);
      if(personalities){
        setPersonalities(JSON.parse(personalities));
      }
      setLoadedLocalStorage(true);
    }
  }, [])

  // store the gpt SK in local storage when it is updated
  useEffect(() => {
    if(gptSK && loadedLocalStorage){
      const encryptedSK = CryptoJS.AES.encrypt(gptSK, password).toString()
      localStorage.setItem(ENCRYPTED_SK_KEY, encryptedSK);
    }
  }, [gptSK])

  // store the extraSteps in local storage when they are updated
  useEffect(() => {
    if(extraSteps && loadedLocalStorage){
      localStorage.setItem(EXTRA_STEPS_KEY, JSON.stringify(extraSteps));
    }
  }, [extraSteps])

  // store the presonalities in local storage when they are updated
  useEffect(() => {
    if(personalities && loadedLocalStorage){
      localStorage.setItem(PERSONALITIES_KEY, JSON.stringify(personalities));
    }
  }, [personalities])

  function onPromptKeyDown(e: KeyboardEvent){
    if(!e.shiftKey && e.key === 'Enter'){
      e.preventDefault();
      if(prompt && prompt.trim()){
        updatePrompt({gptSK, wip, prompt, versions, setNewText, setVersions, extraSteps, setFixedText});
        setPrompt("");
      }
    }
  }

  function onExtraStepKeyDown(e: KeyboardEvent){
    if(!e.shiftKey && e.key === 'Enter'){
      e.preventDefault();
      if(extraStepInput && extraStepInput.trim()){
        addExtraStep({extraStep: extraStepInput, extraSteps, setExtraSteps});
        setExtraStepInput("");
      }
    }
  }

  function onPersonalityKeyDown(e: KeyboardEvent){
    if(!e.shiftKey && e.key === 'Enter'){
      e.preventDefault();
      if(personalitiesInput && personalitiesInput.trim()){
        addPersonality({personality: personalitiesInput, personalities, setPersonalities});
        setPersonalitiesInput("");
      }
    }
  }

  function removeItem(items: any[], indexToRemove: number, setItems: (value: any[]) => void){
    const newItems = [...items];
    newItems.splice(indexToRemove, 1);
    setItems(newItems);
  }

  return (
    <div className='flex'>
      <div className="editor-col flex justify-center h-screen p-4 flex-1 border-r">
        <div className="flex flex-col" style={{flexBasis: "54rem"}}>
          <div>
            <TextInput value={gptSK} onChange={setGptSK} placeholder='GPT SK'></TextInput>
          </div>
          <div className="toggle-container mb-4">
            <ToggleButton leftActive={editing} leftLabel='Edit' rightLabel='Select' onChange={setEditing}></ToggleButton>
          </div>
          {/* <div className="editor-container flex flex-1">
            <TextAreaInput value={wip} onChange={setWip} placeholder='Your text goes here'></TextAreaInput>
          </div> */}
          <div className="editor-container w-full flex flex-1">
            <EditableText newText={newText} setText={fixedText} onChange={setWip} placeholder='Your text goes here'></EditableText>
          </div>
          <div className="prompt-container flex">
            <TextInput value={prompt} onChange={setPrompt} placeholder='Prompt' onKeyDown={onPromptKeyDown}></TextInput>
          </div>
        </div>
      </div>
      <div className="control-col basis-96">
        <div className="control-container p-4">
          <CollapsibleSection title='Personality'>
            <TextInput value={personalitiesInput} onChange={setPersonalitiesInput} placeholder='Add Trait' onKeyDown={onPersonalityKeyDown}></TextInput>
            {personalities.map((personality, index) => (
              <div key={personality.timestamp} className="version-item px-4 py-2 mt-2 border shadow rounded cursor-pointer" onClick={() => removeItem(personalities, index, setPersonalities)}>
                {personality.content}
              </div>
            ))}
          </CollapsibleSection>
          <CollapsibleSection title='Extra Steps'>
            <TextInput value={extraStepInput} onChange={setExtraStepInput} placeholder='Add Prompt' onKeyDown={onExtraStepKeyDown}></TextInput>
            {extraSteps.map((step, index) => (
              <div key={step.timestamp} className="version-item px-4 py-2 mt-2 border shadow rounded cursor-pointer" onClick={() => removeItem(extraSteps, index, setExtraSteps)}>
                {step.content}
              </div>
            ))}
          </CollapsibleSection>
          <CollapsibleSection title='Versions'>
            <div className="versions-container">
              {versions.map(version => (
                <div key={version.timestamp} className="version-item px-4 py-2 mt-2 shadow border rounded">
                  {version.prompt}
                </div>
              ))}
            </div>
          </CollapsibleSection>
          <CollapsibleSection title='Templates'>
            <div className="personality-container">
              
            </div>
          </CollapsibleSection>
        </div>
      </div>
    </div>
  )
}
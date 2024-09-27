import axios from 'axios';
import { Version, ExtraStep, gptSKState, Personality } from '../store/editor';
import { useRecoilState } from 'recoil';

interface updatePromptProps {
  gptSK: string,
  wip: string, 
  prompt: string, 
  personalities: Personality[],
  versions: Version[], 
  extraSteps: ExtraStep[],
  setFixedText: (value:string) => void, 
  setNewText: (value:string) => void, 
  setVersions: (value: Version[]) => void
}
export function updatePrompt({gptSK, wip, prompt, personalities, versions, extraSteps, setNewText, setVersions, setFixedText}: updatePromptProps){
  return new Promise((resolve, reject) => { 
    const message = `
      ${personalities && 
        `You are ${personalities.map(personality => personality.content).join(', ')}.`
      }

      ${prompt}

      ${wip}

      Extra Steps:
      ${extraSteps && extraSteps.map(step => (
        `${step.content}
        `
      ))}
      Please give a direct answer without explanations.
      Please enclose new additons with an <Add> tag.
      Please encolse delection with a <Delete> tag.
    `;
    gptRequest(message, gptSK).then(response => {
      setFixedText(wip);
      setVersions([{
        timestamp: Date.now(), 
        prompt: prompt,
        content: wip
      }, ...versions]);
      const textWithoutAddTags = response.replace(/<\/?Add>/g, '');
      // replace everything betweent <Delete> tags with an empty string
      const textWithDeletionsStripped = textWithoutAddTags.replace(/<Delete>(.+?)<\/Delete>/g, '');
      const textWithAllTagsStripped = textWithDeletionsStripped.replace(/<[^>]*>/g, '');
      setTimeout(() => {
        setNewText(textWithAllTagsStripped);
        resolve(textWithAllTagsStripped);
      }, 100)
    }).catch(reject);
  })
}

export function gptRequest(message: string, sk: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = 'https://api.openai.com/v1/chat/completions';
    const data = {
      "model": "gpt-4o",
      "messages": [{"role": "user", "content": message}],
      "temperature": 0.7
    };
    const config  = {
      headers: { 
        'Authorization': 'Bearer '+sk,
        'Content-Type': 'application/json'
      }
    };
    axios.post(url, data, config).then(response => {
      try{
        resolve(response.data.choices[0].message.content);
      }catch(error){
        reject(error);
      }
    }).catch(reject);
  })
}

interface addExtraStepProps {
  extraStep: string, 
  extraSteps: ExtraStep[], 
  setExtraSteps: (value: ExtraStep[]) => void
}
export function addExtraStep({extraStep, extraSteps, setExtraSteps}: addExtraStepProps){
  setExtraSteps([...extraSteps, {
    timestamp: Date.now(),
    content: extraStep
  }]);
}

interface addPersonalityProps {
  personality: string, 
  personalities: Personality[], 
  setPersonalities: (value: Personality[]) => void
}
export function addPersonality({personality, personalities, setPersonalities}: addPersonalityProps){
  setPersonalities([{
    timestamp: Date.now(),
    content: personality
  }, ...personalities]);
}
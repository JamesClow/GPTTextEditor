import { atom } from 'recoil';

export const editingState = atom({
  key: 'editingState',
  default: true,
})

export const wipState = atom({
  key: 'wipState',
  default: "",
})

export const fixedTextState = atom({
  key: 'fixedTextState',
  default: "",
})

export const newTextState = atom({
  key: 'newTextState',
  default: "",
})

export const promptState = atom({
  key: 'promptState',
  default: "",
})

export const clearTextState = atom({
  key: 'clearTextState',
  default: "",
})

export interface Version {
  timestamp: number,
  prompt: string,
  content: string,
}
export const versionState = atom<Version[]>({
  key: 'versionState',
  default: [],
})

export interface ExtraStep {
  timestamp: number,
  content: string,
}
export const extraStepsState = atom<ExtraStep[]>({
  key: 'extraStepsState',
  default: [],
})

export interface Personality {
  timestamp: number,
  content: string,
}
export const personalityState = atom<Personality[]>({
  key: 'personalityState',
  default: [],
})

export const gptSKState = atom({
  key: 'gptSKState',
  default: '',
})

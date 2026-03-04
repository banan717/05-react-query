// src/types/note.ts
export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;          // тут використовується NoteTag
  createdAt: string;
  updatedAt: string;
}

// Додай тип NoteTag
export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
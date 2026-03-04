import axios from "axios";
import type { Note } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api";
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const config = {
  headers: { Authorization: `Bearer ${TOKEN}` },
};

// Параметри для запиту нотаток
export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

// Відповідь API для нотаток
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

// Отримати нотатки з API з пагінацією та пошуком
export const fetchNotes = async ({
  page,
  perPage,
  search,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = { page, perPage };
  if (search) params.search = search;

  const response = await axios.get<FetchNotesResponse>(`${BASE_URL}/notes`, {
    headers: config.headers,
    params,
  });

  return response.data;
};

// Створити нову нотатку
export const createNote = async (
  note: Omit<Note, "id" | "createdAt" | "updatedAt">
): Promise<Note> => {
  const response = await axios.post<Note>(`${BASE_URL}/notes`, note, config);
  return response.data;
};

// Видалити нотатку та повернути видалену нотатку
export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete<Note>(`${BASE_URL}/notes/${id}`, config);
  return response.data;
};

// Експорт типу Note
export type { Note };
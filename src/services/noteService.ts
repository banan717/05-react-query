import axios from "axios";
import type { Note } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api";
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const config = {
  headers: { Authorization: `Bearer ${TOKEN}` },
};

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async ({
  page,
  perPage,
  search,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = { page, perPage };
  if (search) params.search = search;

  const response = await axios.get(`${BASE_URL}/notes`, { headers: config.headers, params });
  return response.data;
};

export const createNote = async (note: Omit<Note, "id" | "createdAt" | "updatedAt">): Promise<Note> => {
  const response = await axios.post(`${BASE_URL}/notes`, note, config);
  return response.data;
};

export const deleteNote = async (id: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/notes/${id}`, config);
};

// Експорт типу Note
export type { Note };
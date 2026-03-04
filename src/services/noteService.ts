import axios, { AxiosResponse } from "axios";
import { Note } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api";
const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const config = {
  headers: { Authorization: `Bearer ${token}` },
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

export const fetchNotes = async (params: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response: AxiosResponse<FetchNotesResponse> = await axios.get(`${BASE_URL}/notes`, {
    ...config,
    params,
  });
  return response.data;
};

export const createNote = async (
  note: Omit<Note, "id" | "createdAt" | "updatedAt">
): Promise<Note> => {
  const response: AxiosResponse<Note> = await axios.post(`${BASE_URL}/notes`, note, config);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response: AxiosResponse<Note> = await axios.delete(`${BASE_URL}/notes/${id}`, config);
  return response.data;
};
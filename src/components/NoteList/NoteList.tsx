import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Note, deleteNote } from "../../services/noteService";

import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
}

export const NoteList: React.FC<NoteListProps> = ({ notes }) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(deleteNote, {
    onSuccess: () => queryClient.invalidateQueries(["notes"]),
  });

  const handleDelete = (id: string) => {
    mutation.mutate(id);
  };

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button className={css.button} onClick={() => handleDelete(note.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};
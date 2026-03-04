import React, { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useQuery } from "@tanstack/react-query";

import { fetchNotes } from "../../services/noteService";
import type { FetchNotesResponse, FetchNotesParams } from "../../services/noteService";
import { NoteList } from "../NoteList/NoteList";
import { NoteForm } from "../NoteForm/NoteForm";
import Modal from "../Modal/Modal";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";

import css from "./App.module.css";

const PER_PAGE = 12;

export const App: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // debounce для пошуку
  const debounced = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const queryParams: FetchNotesParams = { page, perPage: PER_PAGE, search };

  const { data, isLoading, isError } = useQuery<FetchNotesResponse, Error>({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes(queryParams),
    placeholderData: { notes: [], totalPages: 1 }, // замість keepPreviousData
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {/* передаємо debounce у проп onSearch */}
        <SearchBox onSearch={debounced} />
        <button className={css.button} onClick={() => setModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading notes...</p>}
      {isError && <p>There was an error, please try again...</p>}

      {data?.notes.length ? <NoteList notes={data.notes} /> : null}
      {data?.totalPages && data.totalPages > 1 && (
        <Pagination
          totalPages={data.totalPages}
          page={page}
          onPageChange={setPage}
        />
      )}

      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <NoteForm onClose={() => setModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
};
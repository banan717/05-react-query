import React, { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useQuery } from "@tanstack/react-query";

import { fetchNotes, FetchNotesResponse } from "../../services/noteService";
import { NoteList } from "../NoteList/NoteList";
import { NoteForm } from "../NoteForm/NoteForm";
import { Modal } from "../Modal/Modal";
import { Pagination } from "../Pagination/Pagination";
import { SearchBox } from "../SearchBox/SearchBox";

import css from "./App.module.css";

const PER_PAGE = 12;

export const App: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const debounced = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes({ page, perPage: PER_PAGE, search }),
    keepPreviousData: true,
    placeholderData: { notes: [], totalPages: 1 },
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={debounced} />
        <button className={css.button} onClick={() => setModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading notes...</p>}
      {isError && <p>There was an error, please try again...</p>}

      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
      {data && data.totalPages > 1 && (
        <Pagination
          pageCount={data.totalPages}
          currentPage={page}
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
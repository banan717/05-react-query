import React from "react";
import { useFormik } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Note, NoteTag } from "../../types/note";
import { createNote } from "../../services/noteService";

import css from "./NoteForm.module.css";

interface NoteFormProps {
  onClose: () => void;
}

interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

export const NoteForm: React.FC<NoteFormProps> = ({ onClose }) => {
  const queryClient = useQueryClient();

  const createNoteMutation = useMutation({
    mutationFn: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => createNote(note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const formik = useFormik<NoteFormValues>({
    initialValues: {
      title: "",
      content: "",
      tag: "Todo",
    },
    validationSchema: Yup.object({
      title: Yup.string().min(3).max(50).required(),
      content: Yup.string().max(500),
      tag: Yup.mixed<NoteTag>().oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"]).required(),
    }),
    onSubmit: (values, actions: FormikHelpers<NoteFormValues>) => {
      createNoteMutation.mutate({
        title: values.title,
        content: values.content,
        tag: values.tag,
      });
      actions.resetForm();
      onClose();
    },
  });

  return (
    <form className={css.form} onSubmit={formik.handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input id="title" type="text" {...formik.getFieldProps("title")} className={css.input} />
        {formik.touched.title && formik.errors.title && <span className={css.error}>{formik.errors.title}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea id="content" rows={8} {...formik.getFieldProps("content")} className={css.textarea} />
        {formik.touched.content && formik.errors.content && <span className={css.error}>{formik.errors.content}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select id="tag" {...formik.getFieldProps("tag")} className={css.select}>
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        {formik.touched.tag && formik.errors.tag && <span className={css.error}>{formik.errors.tag}</span>}
      </div>

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className={css.submitButton}>
          Create note
        </button>
      </div>
    </form>
  );
};
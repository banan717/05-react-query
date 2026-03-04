import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService";

import css from "./NoteForm.module.css";

interface NoteFormProps {
  onClose: () => void;
}

interface NoteFormValues {
  title: string;
  content: string;
  tag: string;
}

export const NoteForm: React.FC<NoteFormProps> = ({ onClose }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => queryClient.invalidateQueries(["notes"]),
  });

  const formik = useFormik<NoteFormValues>({
    initialValues: { title: "", content: "", tag: "Todo" },
    validationSchema: Yup.object({
      title: Yup.string().min(3).max(50).required("Required"),
      content: Yup.string().max(500),
      tag: Yup.string().oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"]).required("Required"),
    }),
    onSubmit: (values) => {
      mutation.mutate(values);
      onClose();
    },
  });

  return (
    <form className={css.form} onSubmit={formik.handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input id="title" {...formik.getFieldProps("title")} className={css.input} />
        {formik.touched.title && formik.errors.title ? <span className={css.error}>{formik.errors.title}</span> : null}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea id="content" {...formik.getFieldProps("content")} className={css.textarea} rows={8} />
        {formik.touched.content && formik.errors.content ? <span className={css.error}>{formik.errors.content}</span> : null}
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
        {formik.touched.tag && formik.errors.tag ? <span className={css.error}>{formik.errors.tag}</span> : null}
      </div>

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={onClose}>Cancel</button>
        <button type="submit" className={css.submitButton}>Create note</button>
      </div>
    </form>
  );
};
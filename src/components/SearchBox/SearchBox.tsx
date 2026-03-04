import css from "./SearchBox.module.css";

interface SearchBoxProps {
  callback: (value: string) => void;
}

export default function SearchBox({ callback }: SearchBoxProps) {
  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      onChange={(e) => callback(e.target.value)}
    />
  );
}
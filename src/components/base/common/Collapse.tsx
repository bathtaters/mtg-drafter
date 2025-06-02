import { ReactNode, useState } from "react";
import IconToggle from "./FormElements/IconToggle";

export type Props = {
  button: ReactNode | [ReactNode, ReactNode];
  defaultOpen: boolean;
  children: ReactNode;
  className?: string;
  buttonClass?: string;
  title?: string;
};

export default function CollapseContainer({
  button,
  defaultOpen,
  children,
  className = "",
  buttonClass = "text-xl font-medium",
  title,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <>
      {Array.isArray(button) && button.length === 2 ? (
        <IconToggle
          value={open}
          setValue={setOpen}
          label={title}
          className={`btn z-10 ${buttonClass}`}
        >
          {button}
        </IconToggle>
      ) : (
        <button
          type="button"
          title={title}
          className={`btn z-10 ${buttonClass}`}
          onClick={() => setOpen((o) => !o)}
        >
          {button}
        </button>
      )}
      <div
        className={`collapse ${className} ${open ? "collapse-open" : "collapse-close"} z-0`}
      >
        <div className="collapse-content relative overflow-visible">
          {children}
        </div>
      </div>
    </>
  );
}

export function HorizontalCollapse({
  button,
  defaultOpen,
  children,
  className = "",
  buttonClass = "",
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="flex justify-end items-top">
      <span
        className={`flex-grow transition-transform origin-top-right ${className} ${open ? "mb-4" : "scale-x-0"}`}
      >
        {children}
      </span>
      <a
        className={`btn flex-shrink flex-grow-0 ${buttonClass}`}
        onClick={() => setOpen((o) => !o)}
      >
        {button}
      </a>
    </div>
  );
}

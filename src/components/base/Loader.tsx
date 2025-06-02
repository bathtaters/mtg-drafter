import type { ReactNode } from "react";
import ErrorMessage from "./styles/ErrorMessage";
import Spinner from "./common/Spinner";

type Props = {
  data?: any;
  error?: any;
  message?: ReactNode;
  children: ReactNode;
};

const TextWrapper = ({ children }: { children: ReactNode }) => (
  <div className="py-4 px-6">{children}</div>
);

export default function Loader({ data, error, message, children }: Props) {
  if (error)
    return (
      <TextWrapper>
        <ErrorMessage code={error.code} message={error.message || error} />
      </TextWrapper>
    );
  if (data == null)
    return (
      <TextWrapper>
        <Spinner caption="Connecting" className="opacity-80" />
      </TextWrapper>
    );
  if (typeof data === "number")
    return (
      <TextWrapper>
        <ErrorMessage code={data} />
      </TextWrapper>
    );
  if (message) return <TextWrapper>{message}</TextWrapper>;

  return <>{children}</>;
}

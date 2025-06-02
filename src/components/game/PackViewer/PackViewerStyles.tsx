import type { ReactNode, HTMLProps } from "react";
import Selector, {
  type Props as SelectorProps,
} from "components/base/common/FormElements/Selector";
import RangeInput, {
  type Props as RangeProps,
} from "components/base/common/FormElements/RangeInput";
import { RoundButton } from "../GameBody/GameBodyStyles";

// Wrappers

export const FormContainer = ({ children }: { children?: ReactNode }) => (
  <div className="w-full max-w-md py-8 min-h-80 form-control gap-4">
    {children}
  </div>
);
export const SelectorContainer = ({ children }: { children?: ReactNode }) => (
  <div className="w-full flex flex-row justify-stretch items-start gap-4">
    {children}
  </div>
);

export const ErrorContainer = (props: HTMLProps<HTMLDivElement>) => (
  <div className="badge badge-error" {...props} />
);

// Input elements

export const ViewPackButton = ({
  error,
  isLoading,
  ...props
}: Parameters<typeof RoundButton>["0"] & {
  error?: string;
  isLoading?: boolean;
}) => (
  <div className="flex flex-col items-center">
    <RoundButton {...props} />
    {error && <ErrorContainer>{error}</ErrorContainer>}
    {isLoading && (
      <div className="loading loading-dots loading-sm text-secondary" />
    )}
  </div>
);

export const SelectorStyle = <ID extends string | number>(
  props: SelectorProps<ID>
) => <Selector {...props} wrapperClass="w-full" className="w-full" />;
export const RangeStyle = (props: RangeProps) => (
  <RangeInput
    {...props}
    captionClass="text-secondary text-base"
    boxClass="w-10 text-secondary border-secondary"
  />
);

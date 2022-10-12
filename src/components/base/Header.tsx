import type { ReactNode } from "react";
import { HeaderWrapperStyle } from "./styles/AppStyles";

export default function Header({ children }: { children?: ReactNode }) {
  return <HeaderWrapperStyle>{children}</HeaderWrapperStyle>
}
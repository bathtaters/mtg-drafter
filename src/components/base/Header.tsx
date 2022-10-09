import type { ReactNode } from "react";
import { HeaderWrapperStyle, HeaderTitleStyle, HeaderPartStyle } from "./styles/AppStyles";

type Props = { title?: ReactNode, left?: ReactNode, right?: ReactNode, children?: ReactNode }

export default function Header({ title, left, right, children }: Props) {
  return (
    <HeaderWrapperStyle>
      {children ? children : <>
        <HeaderPartStyle side="left">{left  ? left  : <div /> }</HeaderPartStyle>
        {title && <HeaderTitleStyle>{title}</HeaderTitleStyle>}
        <HeaderPartStyle side="right">{right ? right : <div />}</HeaderPartStyle>
      </>}
    </HeaderWrapperStyle>
  )
}
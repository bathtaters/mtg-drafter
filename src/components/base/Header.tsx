import { ReactNode } from "react";
import { HeaderWrapperStyle, HeaderTitleStyle, HeaderPartStyle } from "./AppStyles";

export default function Header({ title, left, right, children }: { title?: ReactNode, left?: ReactNode, right?: ReactNode, children?: ReactNode }) {
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
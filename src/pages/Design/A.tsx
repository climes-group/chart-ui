import type { AnchorHTMLAttributes, ReactNode } from "react";
import styles from "./A.module.css";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { children?: ReactNode };

function A({ children, ...rest }: Props) {
  return (
    <a className={styles["a-link"]} {...rest}>
      {children}
    </a>
  );
}

export default A;

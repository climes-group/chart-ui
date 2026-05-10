import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  className?: string;
};

function Button({ children, className, ...rest }: Props) {
  return (
    <button className={`${styles.button} ${className || ""}`} {...rest}>
      {children}
    </button>
  );
}

export default Button;

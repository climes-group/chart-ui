import styles from "./A.module.css";

function A({ children, ...rest }) {
  return (
    <a className={styles["a-link"]} {...rest}>
      {children}
    </a>
  );
}

export default A;

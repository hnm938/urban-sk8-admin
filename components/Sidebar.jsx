import { useRef, useEffect, useState } from "react";
import styles from "@/styles/Sidebar.module.scss";

export default function Sidebar({ table, title, subtitle }) {
  return (
    <aside className={styles["Sidebar"]}>
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
      <hr />
      {table}
    </aside>
  );
}
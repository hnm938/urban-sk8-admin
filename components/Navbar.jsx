import Link from "next/link";
import { useRouter } from "next/router";

import { signOut } from "next-auth/react";

import styles from "@/styles/Navbar.module.scss";

export default function Navbar() {
  const inactiveLink = "flex gap-1 p-1 pr-4";
  const activeLink = inactiveLink + " bg-white text-blue-900 rounded-l-lg";

  const router = useRouter();
  const {pathname} = router;

  async function logout() {
    await router.push("/");
    await signOut();
  }

  return (
    <nav className={styles["Navbar"]}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
        />
      </svg>

      <Link href={"/"}>
        <span className={pathname === "/" ? styles["active"] : ""}>
          Overview
        </span>
      </Link>
      <Link href={"/products"}>
        <span
          className={pathname.includes("/products") ? styles["active"] : ""}
        >
          Products
        </span>
      </Link>
      <Link href={"/categories"}>
        <span
          className={pathname.includes("/categories") ? styles["active"] : ""}
        >
          Categories
        </span>
      </Link>
      <Link href={"/orders"}>
        <span className={pathname.includes("/orders") ? styles["active"] : ""}>
          Orders
        </span>
      </Link>
      <Link href={"/settings"}>
        <span
          className={pathname.includes("/settings") ? styles["active"] : ""}
        >
          Settings
        </span>
      </Link>
      <button onClick={logout} className={styles["logout-btn"]}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
          />
        </svg>
      </button>
    </nav>
  );
}
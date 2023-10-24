import Image from "next/image";
import Logo from "@/assets/logo.svg";

import Link from "next/link";
import { useRouter } from "next/router";

import { Button } from "@/components/StyledComponents";

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
      <div className={styles["title"]}>
        <Image src={Logo} />
        <h1>Panel</h1>
      </div>

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
      <div className={styles["navbar-controls"]}>
        <Button onClick={logout} className={styles["logout-button"]}>
          Logout
        </Button>
        <Button className={styles["collapse-button"]} onClick={() => {
          document.querySelector(`.${styles["Navbar"]}`).classList.toggle(styles["opened"]);
        }}>
          <svg
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </Button>
      </div>
    </nav>
  );
}
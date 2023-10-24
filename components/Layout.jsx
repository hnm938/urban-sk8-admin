import Link from "next/link";
import { useSession, signIn } from "next-auth/react";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Navbar from "@/components/Navbar";

import styles from "@/styles/Layout.module.scss";
import Sidebar from "./Sidebar";
import { Button } from "@/components/StyledComponents";

import Swal from "sweetalert2";

import logo from "@/assets/logo.svg";

export default function Layout({children, sidebar, sidebarTitle, sidebarSubtitle, padding }) {
  const { data: session } = useSession();

  async function employerInfo() {
    Swal.fire({
      title: "Employer Access",
      html: `<div style="line-height: 1.75em;">
      Are you an employer and would like admin panel access to this project?
      Just send an email with some company details and your interest in the project
      to recieve access.<br/><br/>
      The admin panel allows you to manage, add or remove products and categories, view orders as well as
      modify front-end settings.
      </div>`,
      confirmButtonColor: "var(--coral-1)",
      reverseButtons: true,
      icon: "question",
    });
  }

  if (!session) {
    return (
      <div className="bg-[var(--white-2)] w-[100vw] h-[100vh]">
        <div className={styles["Login"]}>
          <div className={styles["title-container"]}>
            <div className="flex row gap-x-2">
              <img src={logo.src} alt="" />
              <h1>Urban Sk8</h1>
            </div>
            <h2>Admin Panel</h2>
          </div>
          <div className="text-center w-full flex flex-col items-center gap-y-4">
            <Button
              onClick={() => {
                signIn("google");
              }}
              className={styles["login-button"]}
            >
              Login with Google
            </Button>

            <div className={styles["social-links"]}>
              <Link href="https://github.com/hnm938" target="_blank">
                <Button>
                  <svg
                    className="h-8 w-8 text-red-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                </Button>
              </Link>
              <Link
                href="https://www.linkedin.com/in/abraham-hodos-212985270/"
                target="_blank"
              >
                <Button>
                  <svg
                    className="h-8 w-8 text-red-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />{" "}
                    <rect x="2" y="9" width="4" height="12" />{" "}
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </Button>
              </Link>
              <Link href="https://urban-sk8-front.vercel.app/" target="_blank">
                <Button>
                  <svg
                    className="h-8 w-8 text-red-500"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    fill="none"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" />{" "}
                    <circle cx="12" cy="12" r="9" />{" "}
                    <line x1="3.6" y1="9" x2="20.4" y2="9" />{" "}
                    <line x1="3.6" y1="15" x2="20.4" y2="15" />{" "}
                    <path d="M11.5 3a17 17 0 0 0 0 18" />{" "}
                    <path d="M12.5 3a17 17 0 0 1 0 18" />
                  </svg>
                </Button>
              </Link>
            </div>
          </div>
          <p>
            <span>
              Request employer access
              <svg
                className="h-8 w-8 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                onClick={employerInfo}
              >
                <path
                  strokeWidth="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
            <span>
              Email: 
              <a href="mailto:abrahamhodos@gmail.com?subject=Request Testing Access&body=Company Name: %0D%0ACompany Website: %0D%0AEmail: %0D%0AReason for Access: ">
                abrahamhodos@gmail.com
              </a>
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-blue-900 min-h-screen flex">
      <Navbar />
      <PanelGroup autoSaveId="example" direction="horizontal">
        {sidebar && (
          <>
            <Panel
              className={styles["Panel"]}
              collapsible={true}
              defaultSize={30}
              minSize={25}
              order={1}
            >
              <Sidebar
                title={sidebarTitle}
                subtitle={sidebarSubtitle}
                table={sidebar}
              />
            </Panel>
            <PanelResizeHandle className={styles["ResizeHandle"]}>
              <div></div>
              <div></div>
              <div></div>
            </PanelResizeHandle>
          </>
        )}
        <Panel
          className={styles["Panel"]}
          collapsible={true}
          defaultSize={70}
          minSize={25}
          order={2}
        >
          <div
            className={styles["page-container"]}
            style={{ padding: padding !== undefined ? padding : "0 5cqw" }}
          >
            {children}
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}

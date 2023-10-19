import { useSession, signIn } from "next-auth/react";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Navbar from "@/components/Navbar";

import styles from "@/styles/Layout.module.scss";
import Sidebar from "./Sidebar";

export default function Layout({children, sidebar, sidebarTitle, sidebarSubtitle, padding }) {
  const { data: session } = useSession();
  if (!session) {
    return (
      <div className="bg-blue-900 w-screen h-screen flex items-center">
        <div className="text-center w-full">
          <button
            onClick={() => signIn("google")}
            className="bg-white p-2 px-4 rounded-lg"
          >
            Login with Google
          </button>
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

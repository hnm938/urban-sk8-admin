import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";

import styles from "@/styles/Dashboard.module.scss";

export default function Home() {
  const {data: session} = useSession();
  return (
    <Layout>
      <div className="text-blue-900 flex justify-between">
        <div className={styles["dashboard-links"]}>
          <button style={{ gridRow: "1 / span 2", gridColumn: "1 / span 2", minWidth: "25%" }}>Orders</button>
          <button style={{ gridRow: "1", gridColumn: "3" }}>Products</button>
          <button style={{ gridRow: "1", gridColumn: "4" }}>categories</button>
          <button style={{ gridRow: "2", gridColumn: "3" }}>Settings</button>
        </div>
      </div>
    </Layout>
  );
}

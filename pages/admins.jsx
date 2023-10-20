import { useEffect, useState } from "react";
import Layout from "@/components/Layout";

import axios from "axios";

import Swal from "sweetalert2";
import Popup from "@/components/Popup";

import styles from "@/styles/Admins.module.scss";

export default function Admins() {
  const [email, setEmail] = useState("");
  const [adminEmails, setAdminEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  function addAdmin(ev) {
    ev.preventDefault();
    axios
      .post("/api/admins", { email })
      .then((res) => {
        Popup("Admin Added");
        setEmail("");
        loadAdmins();
      })
      .catch((err) => {
        Swal.fire({
          title: "Error!",
          text: err.response.data.message,
          icon: "error",
          confirmButtonColor: "var(--coral-1",
        });
      });
  }

  function deleteAdmin(_id, email) {
    Swal.fire({
      title: "Are you sure?",
      html: `Remove email from admin list : <br/> <strong>${email}</strong>`,
      showCancelButton: true,
      cancelButtonText: "Cancel",
      cancelButtonColor: "var(--coral-2)",
      confirmButtonText: "Confirm",
      confirmButtonColor: "var(--coral-1)",
      reverseButtons: true,
      icon: "warning",
    })
    .then(async (result) => {
      if (result.isConfirmed) {
        axios.delete("/api/admins?_id=" + _id).then(() => {
          Popup("Removed Admin");
          loadAdmins();
        });
      }
    });
  }

  function loadAdmins() {
    setIsLoading(true);
    axios.get("/api/admins").then((res) => {
      setAdminEmails(res.data);
      setIsLoading(false);
    });
  }

  useEffect(() => {
    loadAdmins();
  }, []);

  return (
    <Layout>
      <div className={styles["Admin"]}>
        <h1>Manage Admins</h1>
        <hr />
        <section className={styles["admins--add-new"]}>
          <h2>Add New Admin</h2>
          <form onSubmit={addAdmin} className="flex row gap-x-2 my-[0.5cqw]">
            <input
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="adminaddress@gmail.com"
            />
            <button filled="">Add</button>
          </form>
        </section>
        <section className={styles["admins--current"]}>
          <h2>Admins</h2>
          <table>
            <thead>
              <tr>
                <td>Google Email Address</td>
                <td></td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {adminEmails.length > 0 &&
                adminEmails.map((adminEmail) => (
                  <tr key={adminEmail._id}>
                    <td>{adminEmail.email}</td>
                    <td>
                      {adminEmail.createdAt && prettyDate(adminEmail.createdAt)}
                    </td>
                    <td>
                      <button
                        onClick={() =>
                          deleteAdmin(adminEmail._id, adminEmail.email)
                        }
                        className="btn-red"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>
      </div>
    </Layout>
  );
}

import { mongooseConnect } from "@/lib/mongoose";
import { Settings } from "@/models/Setting";
import { Product } from "@/models/Product";

import { useEffect, useState } from "react";

import Layout from "@/components/Layout";
import Popup from "@/components/Popup";
import { Button } from "@/components/StyledComponents";

import styles from "@/styles/Settings.module.scss";
import axios from "axios";

import Admins from "./admins";

export default function SettingsPage({ settings }) {
  const [revealCancel, setRevealCancel] = useState("none");
  const [featuredProductId, setFeaturedProductId] = useState("");

  async function saveSettings(e) {
    e.preventDefault();
    const validPID = await axios.post("/api/settings/verifyPID", { _id: featuredProductId }).then(res => {
      return res.data;
    });
    if (validPID) {
      setRevealCancel("none");
      const data = {
        _id: settings._id,
        featuredProduct: featuredProductId,
      };
      axios.post("/api/settings/save", { ...data });
      Popup("Settings Saved");
    } else {
      Popup("Invalid Product ID", "error");
    }
  }

  function init() {
    setFeaturedProductId(settings.featuredProduct);
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <Layout>
      <div className={styles["Settings"]}>
        <section className={styles["settings-container"]}>
          <h1>Settings</h1>
          <hr />
          <form onSubmit={saveSettings}>
            <label htmlFor="featured product">Featured Product: </label>
            <br />
            <input
              onChange={(e) => {
                setRevealCancel("block");
                setFeaturedProductId(e.target.value);
              }}
              value={featuredProductId}
              type="text"
              name="featured product"
            />
            <br />
            <div className={styles["settings-controls"]}>
              <Button>Save</Button>
              <Button
                $filled
                type="button"
                id="cancel-button"
                style={{ display: revealCancel }}
                onClick={() => {
                  setRevealCancel("none");
                  init();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </section>
        <Admins />
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await mongooseConnect();

  const settings = await Settings.find();

  return {
    props: {
      settings: JSON.parse(JSON.stringify(settings[0])),
    },
  };
}

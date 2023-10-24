import axios from "axios";

import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";

import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

import styles from "@/styles/components/ProductForm.module.scss";
import Popup from "./Popup";
import { Button, Splitter } from "./StyledComponents";

export default function ProductForm({
  _id,
  title: existingTitle,
  category: existingCategory,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  properties: assignedProperties,
  containerTitle,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [category, setCategory] = useState(existingCategory || "");
  const [productProperties, setProductProperties] = useState(
    assignedProperties || {}
  );
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImages || []);
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [synchronizedProperties, setSynchronizedProperties] = useState({});

  const [categories, setCategories] = useState([]);
  const [propertiesToFill, setPropertiesToFill] = useState([]);

  const router = useRouter();

  useEffect(() => {
    axios.get("/api/categories").then(
      (res) => {
        setCategories(res.data);
      },
      { timeout: 5000 }
    );
  }, []);

  const getPropertiesRecursively = useCallback(
    (categoryId, properties = []) => {
      const category = categories.find((cat) => cat._id === categoryId);

      if (!category || properties.includes(category)) {
        return properties;
      }

      properties.push(category);

      if (category.parent && category.parent._id) {
        return getPropertiesRecursively(category.parent._id, properties);
      }

      return properties;
    },
    [categories]
  );

  useEffect(() => {
    if (categories.length > 0 && category) {
      const propertiesToFill = getPropertiesRecursively(category, []);
      const properties = propertiesToFill
        .map((category) => category.properties)
        .flat();
      setPropertiesToFill(properties);
    }
  }, [categories, category, getPropertiesRecursively]);

  useEffect(() => {
    saveImage();
  }, [images]);

  async function saveImage() {
    const data = { images };

    if (_id) {
      axios.put("/api/products", { ...data, _id });
    }

    Popup("Images Updated");
  }

  async function saveProduct(e) {
    e.preventDefault();

    if (!title) {
      return Popup("Missing Product Name", "error");
    }
    if (!price) {
      return Popup("Missing Product Price", "error");
    }
    if (images.length === 0) {
      await setTimeout(() => {
        Popup("Missing Product Image", "error");
      }, 2100);
    }

    const data = {
      title,
      category,
      description,
      price,
      images,
      properties: productProperties,
    };
    if (_id) {
      await axios.put("/api/products", { ...data, _id });
      Popup("Product Updated");
    } else {
      await axios.post("/api/products", data);
      window.location.reload();
      Popup("Product Created");
    }
  }

  if (goToProducts) {
    router.push("/products");
  }

  function goBack(e) {
    e.preventDefault();
    router.push("/products");
  }

  async function uploadImages(e) {
    const files = e.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }

      const res = await axios.post("/api/image/upload", data, { timeout: 5000 });
      
      await setImages((oldImages) => {
        return [...oldImages, ...res.data.links];
      });

      setIsUploading(false);
    }
  }

  async function deleteImage(link) {
    await axios.post("/api/image/delete", { link });
    setImages((prevImages) =>
      prevImages.filter((image) => image !== link)
    );
  }

  function updateImagesOrder(images) {
    setImages(images);
  }

  function setProductProp(propName, value) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    });
  }

  return (
    <div className={styles["ProductForm"]}>
      <div style={{ lineHeight: "2.5em" }}>
        <h1>{containerTitle}</h1>
        <h2 className="mb-3 text-sm text-gray-500">PID: {_id}</h2>
      </div>
      <Splitter />
      <form onSubmit={saveProduct}>
        <label>Product name</label>
        <input
          type="text"
          placeholder="product name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Description</label>
        <textarea
          type="text"
          placeholder="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Price (CAD$)</label>
        <input
          type="number"
          placeholder="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <div className="flex gap-2 py-1">
          <Button>Save</Button>
          <Button $filled onClick={goBack}>Cancel</Button>
        </div>

        <label>Photos</label>
        <div className={styles["product-images"]}>
          <ReactSortable
            list={images}
            setList={updateImagesOrder}
            className="flex flex-wrap gap-1"
          >
            {!!images?.length &&
              images.map((link, index) => (
                <div key={index} className={styles["image--container"]}>
                  <img src={link} alt="" />
                  <Button
                    $filled
                    className={styles["image--delete-button"]}
                    onClick={() => {
                      deleteImage(link);
                    }}
                    type="button"
                  >
                    <svg
                      className="h-7 w-7 text-[var(--coral-1)]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {" "}
                      <circle cx="12" cy="12" r="10" />{" "}
                      <line x1="15" y1="9" x2="9" y2="15" />{" "}
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                  </Button>
                </div>
              ))}
          </ReactSortable>
          {isUploading && (
            <div className="h-24 px-4 flex items-center">
              <Spinner />
            </div>
          )}
          <label
            style={{ border: "none" }}
            className={styles["image-placeholder"]}
          >
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
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            <input
              type="file"
              onChange={uploadImages}
              className="hidden"
              multiple
            />
          </label>
        </div>

        <label>Category</label>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
          }}
        >
          <option value="">Uncategorized</option>
          {categories.length > 0 &&
            categories.map((c) => (
              <option key={c.name} value={c._id}>
                {c.name}
              </option>
            ))}
        </select>
        {propertiesToFill.length > 0 &&
          propertiesToFill.map((p) => (
            <div className={styles["property-container"]} key={p._id}>
              <label>{p.name}</label>
              <select
                value={productProperties[p.name]}
                onChange={(e) => setProductProp(p.name, e.target.value)}
              >
                <option value="">None</option>
                {p.values.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          ))}
      </form>
    </div>
  );
}

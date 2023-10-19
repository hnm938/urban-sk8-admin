import React from "react";
import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

import styles from "@/styles/components/CategoryForm.module.scss";

import Swal from "sweetalert2";

export default function Categories() {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState(undefined);
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const response = await axios.get("/api/categories");
    setCategories(response.data);
  }

  async function saveCategory(e) {
    e.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties.map((p) => ({
        name: p.name,
        values: p.values.split(","),
      })),
    };

    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put("/api/categories", data, { timeout: 5000 });
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", data, { timeout: 5000 });
    }

    setName("");
    setParentCategory("");
    setProperties([]);
    fetchCategories();
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);

    if (category.parent?._id === undefined) {
      document.querySelector("#parent-dropdown").value = 0;
    }

    setParentCategory(category.parent?._id);
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(","),
      }))
    );
  }

  async function deleteCategory(category) {
    Swal.fire({
      title: "Confirm Deletion",
      html: `Delete the <strong>${category.name}</strong> Category?`,
      showCancelButton: true,
      cancelButtonText: "Cancel",
      cancelButtonColor: "var(--coral-2)",
      confirmButtonText: "Delete",
      confirmButtonColor: "var(--coral-1)",
      reverseButtons: true,
      icon: "warning",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { _id } = category;
        await axios.delete("/api/categories?_id=" + _id, { timeout: 5000 });
        fetchCategories();
      }
    });
  }

  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  }

  function handlePropertyNameChange(index, property, newName) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }

  function handlePropertyValuesChange(index, property, newValues) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  }

  function removeProperty(indexToRemove) {
    setProperties((prev) => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }

  // Function to render table rows recursively
  const renderCategories = (category, level, index) => {
    const childCategories = categories.filter(
      (c) => c.parent?._id === category._id
    );

    const sortedChildCategories = childCategories.sort((a, b) => {
      if (a.name === b.name) {
        return 0;
      }
      return a.name < b.name ? -1 : 1;
    });

    const bgColorStyle = {
      backgroundColor: level === 0 ? "" : `rgba(150, 150, 150, 0.${level})`,
    };

    return (
      <React.Fragment key={category._id}>
        <tr key={category._id} style={bgColorStyle}>
          <td style={{ color: "var(--coral-1)" }}>
            {index !== undefined ? index + 1 : ""}
          </td>
          <td>{category.name}</td>
          <td>{category?.parent?.name}</td>
          <td>
            <div className="table--action-buttons">
              <button onClick={() => editCategory(category)}>
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
                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
              <button
                className="table--delete-button"
                onClick={() => deleteCategory(category)}
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
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>
            </div>
          </td>
        </tr>
        {sortedChildCategories.map((childCategory) =>
          renderCategories(childCategory, level + 1)
        )}
      </React.Fragment>
    );
  };

  return (
    <Layout
      sidebarTitle="Categories"
      sidebarSubtitle="Edit & Manage Categories"
      sidebar={
        <CategoryTable
          categories={categories}
          renderCategories={renderCategories}
        />
      }
      padding="2cqw 3cqw"
    >
      <div className={styles["CategoryForm"]}>
        <h1 className="mb-2">Categories</h1>
        <label>
          {editedCategory
            ? `Edit category ${editedCategory.name}`
            : "Create new category"}
        </label>
        <form onSubmit={saveCategory}>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder={"Category name"}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <select
              id="parent-dropdown"
              value={parentCategory || "0"}
              onChange={(e) => setParentCategory(e.target.value)}
            >
              <option value="0">No parent category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 py-4">
            {editedCategory && (
              <button
                type="button"
                onClick={() => {
                  setEditedCategory(null);
                  setName("");
                  setParentCategory("");
                  setProperties("");
                }}
              >
                Cancel
              </button>
            )}
            <button>Save</button>
          </div>
          <div>
            <label className="block">Properties</label>
            <button type="button" onClick={addProperty}>
              Add new property
            </button>
            {properties.length > 0 &&
              properties.map((property, index) => (
                <div
                  key={index}
                  className={styles["property-container"]}
                >
                  <input
                    type="text"
                    className="mb-0"
                    value={property.name}
                    onChange={(e) =>
                      handlePropertyNameChange(index, property, e.target.value)
                    }
                    placeholder="property name (ex. color)"
                  />
                  <input
                    type="text"
                    className={`${styles["property-input"]} mb-0`}
                    value={property.values}
                    onChange={(e) =>
                      handlePropertyValuesChange(
                        index,
                        property,
                        e.target.value
                      )
                    }
                    placeholder="values, comma seperated"
                  />
                  <button onClick={() => removeProperty(index)} type="button">
                    Remove
                  </button>
                </div>
              ))}
          </div>
        </form>
      </div>
    </Layout>
  );
}

export const CategoryTable = ({ categories, renderCategories }) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <td style={{ color: "var(--coral-1)" }}>#</td>
            <td>Category</td>
            <td>Parent</td>
            <td> </td>
          </tr>
        </thead>
        <tbody>
          {categories
            .filter((category) => !category.parent)
            .map((category, index) => renderCategories(category, 0, index))}
        </tbody>
      </table>
    </div>
  );
};

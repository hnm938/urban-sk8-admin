import Layout from "@/components/Layout";
import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";

import ProductForm from "@/components/ProductForm";

import styles from "@/styles/Product.module.scss";

import Swal from "sweetalert2";

export default function Products() {
  const [showProductForm, setShowProductForm] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

  return (
    <Layout
      sidebarTitle="Products"
      sidebarSubtitle="Edit & Manage Products"
      sidebar={<ProductTable onEditClick={setEditProductId} />}
      padding="2cqw 3cqw"
    >
      <div className="w-full h-full flex justify-center items-start">
        <ProductForm containerTitle="Create Product" />
      </div>
    </Layout>
  );
}

export function ProductTable() {
  const [categoryFilter, setCategoryFilter] = useState("");

  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("category", categoryFilter);

    const url = "/api/products?" + params.toString();

    axios.get(url).then(
      (res) => {
        setProducts(res.data);
      }
    );

    axios.get("/api/categories").then(
      (res) => {
        setCategories(res.data);
      }
    );
  }, [categoryFilter, currentCategory, products]);

  async function handleDeleteProduct(product) {
    Swal.fire({
      title: "Confirm Deletion",
      html: `Delete the Following Product: <br/> <strong>${product.title}</strong>`,
      showCancelButton: true,
      cancelButtonText: "Cancel",
      cancelButtonColor: "var(--coral-2)",
      confirmButtonText: "Delete",
      confirmButtonColor: "var(--coral-1)",
      reverseButtons: true,
      icon: "warning",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { _id } = product;
        await axios.delete("/api/products?_id=" + _id, { timeout: 5000 });
      }
    });
  };

  return (
    <div className="table-container">
      <div className={styles["table-filters"]}>
        <button
          className={styles["selected"]}
          onClick={(e) => {
            const selectedBtn = e.target.parentElement.querySelector(
              `.${styles["selected"]}`
            );

            if (selectedBtn) {
              selectedBtn.classList.remove(styles["selected"]);
            }

            e.target.classList.toggle(styles["selected"]);
            setCategoryFilter("");
          }}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={(e) => {
              const selectedBtn = e.target.parentElement.querySelector(
                `.${styles["selected"]}`
              );

              if (selectedBtn) {
                selectedBtn.classList.remove(styles["selected"]);
              }

              e.target.classList.toggle(styles["selected"]);
              setCategoryFilter(category._id);
            }}
          >
            {category.name}
          </button>
        ))}
      </div>
      {products.length > 0 ? (
        <table>
          <thead>
            <tr>
              <td style={{ color: "var(--coral-1)" }}>#</td>
              <td>Name</td>
              <td>Price</td>
              <td> </td>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 &&
              products.map((product, index) => (
                <tr key={product._id}>
                  <td style={{ color: "var(--coral-1)" }}>{index + 1}</td>
                  <td>{product.title}</td>
                  <td>
                    {product.price}
                    <span> ($CAD)</span>
                  </td>
                  <td>
                    <div className="table--action-buttons">
                      <Link
                        className="table--edit-button"
                        href={`/products/edit/${product._id}`}
                      >
                        <button>
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
                      </Link>
                      <button
                        onClick={() => {
                          handleDeleteProduct(product);
                        }}
                        className="table--delete-button"
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
              ))}
          </tbody>
        </table>
      ) : (
        <div className={styles["category-empty"]}>
          <h1>Ghost Town</h1>
          <h2>There are no products in this category yet!</h2>
        </div>
      )}
    </div>
  );
}

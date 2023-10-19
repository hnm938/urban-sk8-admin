import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import { ProductTable } from "@/pages/products";
import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function EditProductPage() {
  const [productInfo, setProductInfo] = useState(null);
  const router = useRouter();
  const {id} = router.query;

  useEffect(() => {
    if (!id) { return; }
    axios.get("/api/products?id=" + id).then(
      (res) => {
        setProductInfo(res.data);
      },
      { timeout: 5000 }
    );  
  }, [id])

  return (
    <Layout
      sidebarTitle="Products"
      sidebarSubtitle="Edit & Manage Products"
      sidebar={<ProductTable />}
      padding="2cqw 3cqw"
    >
      <div className="w-full h-full flex justify-center items-start">
        {productInfo && (
          <ProductForm
            {...productInfo}
            containerTitle="Edit Product"
            key={productInfo._id}
          />
        )}
      </div>
    </Layout>
  );
}
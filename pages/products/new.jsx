import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import { ProductTable } from "../products";

export default function NewProduct() {
  return (
    <Layout
      sidebarTitle="Products"
      sidebarSubtitle="Edit & Manage Products"
      sidebar={<ProductTable />}
      padding="2cqw 3cqw"
    >
      <div className="w-full h-full flex justify-center items-start">
        <ProductForm containerTitle="Create Product" />
      </div>
    </Layout>
  );
}

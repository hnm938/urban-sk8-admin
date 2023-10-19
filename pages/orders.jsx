import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("/api/orders").then(
      (res) => {
        setOrders(res.data);
      },
      { timeout: 5000 }
    );
  }, []);
  
  return (
    <Layout>
      <h1>Orders</h1>
      <table>
        <thead>
          <tr>
            <td>Date</td>
            <td>Paid</td>
            <td>Recipient</td>
            <td>Products</td>
            <td> </td>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 &&
            orders.map((order) => (
              <tr key={order._id}>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>{order.paid ? "YES" : "NO"}</td>
                <td>
                  {order.name} {order.email} <br />
                  {order.city} {order.postalCode} {order.country} <br />
                  {order.streetAddress}
                </td>
                <td>
                  {order.line_items.map((l) => (
                    <>
                      {l.price_data.product_data?.name} x {l.quantity}
                      <br />
                    </>
                  ))}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}
import { useEffect, useState } from "react";
import api from "../services/api";

function ProductList() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        api.get("/products")
            .then((response) => {
                setProducts(response.data.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <div>
            <h2>Products</h2>

            {products.map((product) => (
                <div key={product.id}>
                    <h3>{product.name}</h3>
                    <p>₹ {product.price}</p>
                </div>
            ))}
        </div>
    );
}

export default ProductList;

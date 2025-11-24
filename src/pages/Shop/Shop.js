import React, { useState, useEffect } from "react";
import { paginationItems } from "../../constants";

import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import Pagination from "../../components/pageProps/shopPage/Pagination";
import ProductBanner from "../../components/pageProps/shopPage/ProductBanner";
import ShopSideNav from "../../components/pageProps/shopPage/ShopSideNav";

const Shop = () => {
    const [itemsPerPage, setItemsPerPage] = useState(12);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [filteredProducts, setFilteredProducts] = useState(paginationItems);
    const itemsPerPageFromBanner = (itemsPerPage) => {
        setItemsPerPage(itemsPerPage);
    };
    const onSelectCategory = (categoryKey) => {
        setSelectedCategory(categoryKey);
    };

    useEffect(() => {
    let tempProducts = paginationItems;
    if (selectedCategory && selectedCategory.toLowerCase() !== "all") {
        if (searchTerm) {
            tempProducts = tempProducts.filter(item =>
                (item.productName && item.productName.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        tempProducts = tempProducts.filter(item =>
            item.category && item.category.includes(selectedCategory.toLowerCase())
        );

    } else {
        if (searchTerm) {
            tempProducts = tempProducts.filter(item =>
                (item.productName && item.productName.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
    }
    setFilteredProducts(tempProducts);

}, [searchTerm, selectedCategory]);


    return (
        <div className="max-w-container mx-auto px-4">
            <Breadcrumbs title="Products" />
            {/* ================= Products Start here =================== */}
            <div className="w-full h-full flex pb-20 gap-10">
                <div className="w-[20%] lgl:w-[25%] hidden mdl:inline-flex h-full">
                    {/* *** 5. ส่งฟังก์ชัน onSelectCategory ลงไปให้ ShopSideNav *** */}
                    <ShopSideNav onSelectCategory={onSelectCategory} />
                </div>
                <div className="w-full mdl:w-[80%] lgl:w-[75%] h-full flex flex-col gap-10">

                    <ProductBanner itemsPerPageFromBanner={itemsPerPageFromBanner} />

                    {/* *** Search Input Bar (สำหรับ P-1 และ P-3 Test Cases) *** */}
                    <input
                        type="text"
                        placeholder="ค้นหาสินค้า..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        data-testid="search-input"
                        className="border p-2 rounded-md w-full md:w-1/2"
                    />
                    <Pagination
                        itemsPerPage={itemsPerPage}
                        productsData={filteredProducts}
                    />
                </div>
            </div>
            {/* ================= Products End here ===================== */}
        </div>
    );
};

export default Shop;
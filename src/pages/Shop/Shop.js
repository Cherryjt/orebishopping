import React, { useState, useEffect } from "react";
// *** ต้องนำเข้าข้อมูลสินค้าเริ่มต้น (ฐานข้อมูล) ***
import { paginationItems } from "../../constants";

import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import Pagination from "../../components/pageProps/shopPage/Pagination";
import ProductBanner from "../../components/pageProps/shopPage/ProductBanner";
import ShopSideNav from "../../components/pageProps/shopPage/ShopSideNav";

const Shop = () => {
    // 1. Pagination State
    const [itemsPerPage, setItemsPerPage] = useState(12);

    // 2. *** Search/Filter States ***
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    // State สำหรับเก็บรายการสินค้าที่ถูกกรองและแสดงผล (ใช้เป็นฐานข้อมูลเริ่มต้น)
    const [filteredProducts, setFilteredProducts] = useState(paginationItems);

    // 3. *** Filter Functions ที่จะส่งลงไปให้ Component ย่อย ***

    // ฟังก์ชันจัดการ Dropdown Items Per Page
    const itemsPerPageFromBanner = (itemsPerPage) => {
        setItemsPerPage(itemsPerPage);
    };

    // ฟังก์ชันจัดการ Side Nav Category Filter (ถูกเรียกจาก Category.js)
    const onSelectCategory = (categoryKey) => {
        // อัปเดต State เมื่อได้รับค่าจาก Component ย่อย
        setSelectedCategory(categoryKey);
        // ไม่ต้องรีเซ็ต offset ที่นี่ เพราะมันจะถูกรีเซ็ตใน Pagination.js เมื่อ filteredProducts เปลี่ยน
    };


    // 4. *** Logic การกรอง: useEffect (ทำงานทันทีที่ searchTerm หรือ selectedCategory เปลี่ยน) ***
    useEffect(() => {
    // 1. เริ่มจากข้อมูลสินค้าทั้งหมดเสมอ
    let tempProducts = paginationItems;

    // B. กรองตาม Category ที่ถูกเลือก (Side Nav Filter)

    // *** แก้ไขตรงนี้: ตรวจสอบว่า selectedCategory ไม่ใช่ "All" ก่อนทำ Filter ***
    if (selectedCategory && selectedCategory.toLowerCase() !== "all") {

        // กรองตามชื่อสินค้า (Search Term)
        if (searchTerm) {
            tempProducts = tempProducts.filter(item =>
                (item.productName && item.productName.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // กรองตามหมวดหมู่ (Multiple Categories Logic)
        tempProducts = tempProducts.filter(item =>
            // ใช้ .includes() เพื่อตรวจสอบว่า Array category ของ item มี selectedCategory อยู่หรือไม่
            item.category && item.category.includes(selectedCategory.toLowerCase())
        );

    } else {
        // *** ถ้า selectedCategory เป็น "All" ***
        // ทำการกรองเฉพาะ Search Term เท่านั้น (ถ้ามี)
        if (searchTerm) {
            tempProducts = tempProducts.filter(item =>
                (item.productName && item.productName.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        // ถ้าไม่มี Search Term, tempProducts จะคงค่าเป็น paginationItems (แสดงทั้งหมด)
    }

    // อัปเดต State สินค้าที่ถูกกรอง
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

                    {/* *** 6. ส่งข้อมูลที่ถูกกรองแล้ว (filteredProducts) ไปให้ Pagination *** */}
                    <Pagination
                        itemsPerPage={itemsPerPage}
                        // เปลี่ยนชื่อ props ใน Pagination.js ให้สอดคล้อง (เช่น productsData)
                        productsData={filteredProducts}
                    />
                </div>
            </div>
            {/* ================= Products End here ===================== */}
        </div>
    );
};

export default Shop;
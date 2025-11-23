import React, { useState, useEffect } from "react";
// นำเข้าข้อมูลสินค้าหลัก
import { paginationItems } from "../../constants";

import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import Pagination from "../../components/pageProps/shopPage/Pagination"; // <-- ต้องนำเข้า Component Pagination
import ProductBanner from "../../components/pageProps/shopPage/ProductBanner";
import ShopSideNav from "../../components/pageProps/shopPage/ShopSideNav";

const Shop = () => {
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [isLoading] = useState(false); // ไม่ต้องโหลดเพราะใช้ Local Data

  // *** State สำหรับ Search/Filter Logic ***
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  // ฐานข้อมูลเริ่มต้นใช้ paginationItems
  const [filteredProducts, setFilteredProducts] = useState(paginationItems);

  // *** useEffect สำหรับการกรองและค้นหา (Instant Search) ***
  useEffect(() => {
      // 1. กรองตามหมวดหมู่ก่อน โดยใช้ paginationItems เป็นฐานข้อมูลหลัก
      let results = selectedCategory === "All"
          ? paginationItems
          : paginationItems.filter(product => product.category === selectedCategory);
          // (สมมติว่ามี key 'category' ในข้อมูล)

      // 2. กรองตามคำค้นหาต่อ
      if (searchTerm) {
        results = results.filter(product =>
          // ใช้ Key productName และ des (ตามโครงสร้างข้อมูลของคุณ)
          (product.productName && product.productName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (product.des && product.des.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      // *** สิ่งสำคัญ: เมื่อข้อมูลฐานเปลี่ยน ให้รีเซ็ตการแบ่งหน้า ***
      // ถ้าไม่มี itemOffset ใน Shop.js ไม่ต้อง reset
      // ถ้าคุณนำ logic การจัดการ offset มาไว้ที่นี่ ควรใส่ reset offset

      setFilteredProducts(results);
  }, [searchTerm, selectedCategory]);

  // -------------------------------------------------------------------------------------------------

  const itemsPerPageFromBanner = (itemsPerPage) => {
    setItemsPerPage(itemsPerPage);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Products" />
      {/* ================= Products Start here =================== */}
      <div className="w-full h-full flex pb-20 gap-10">
        <div className="w-[20%] lgl:w-[25%] hidden mdl:inline-flex h-full">
          <ShopSideNav onSelectCategory={handleCategorySelect} />
        </div>
        <div className="w-full mdl:w-[80%] lgl:w-[75%] h-full flex flex-col gap-10">
          <ProductBanner itemsPerPageFromBanner={itemsPerPageFromBanner} />

          {/* *** Search Input Bar (ทำงานทันทีที่พิมพ์) *** */}
          <input
              type="text"
              placeholder="ค้นหาสินค้า..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="search-input"
              className="border p-2 rounded-md w-full md:w-1/2"
          />

          {/* 4. ส่งข้อมูลที่ถูกกรองแล้ว (filteredProducts) ไปให้ Pagination */}
          {isLoading ? (
            <p className="text-xl text-center py-10">กำลังโหลดสินค้า...</p>
          ) : (
             <Pagination
                itemsPerPage={itemsPerPage}
                // *** นี่คือการส่งข้อมูลที่ถูกกรองแล้วไปให้ Pagination ***
                productsData={filteredProducts}
             />
          )}

        </div>
      </div>
      {/* ================= Products End here ===================== */}
    </div>
  );
};

export default Shop;
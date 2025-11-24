import React, { useState } from "react";
import { ImPlus } from "react-icons/im";
import NavTitle from "./NavTitle";

const Category = ({ onSelectCategory }) => {
  const [showSubCatOne, setShowSubCatOne] = useState(false);

  const items = [
    {
      _id: 990,
      title: "All",
      key: "all",
      icons: false,
    },
    {
      _id: 991,
      title: "New Arrivals",
      key: "new arrivals",
      icons: true,
    },
    {
      _id: 992,
      title: "Gadgets",
      key: "gadgets",
    },
    {
      _id: 993,
      title: "Accessories",
      key: "accessories",
      icons: true,
    },
    {
      _id: 994,
      title: "Electronics",
      key: "electronics",
    },
    {
      _id: 995,
      title: "Caps",
      key: "cap",
    },
  ];

  // ฟังก์ชันจัดการการคลิก Filter
  const handleFilterClick = (key) => {
    // 1. เรียกใช้ฟังก์ชันที่รับมาจาก props เพื่ออัปเดต State ใน Shop.js
    if (onSelectCategory) {
        onSelectCategory(key);
    }
  };


  return (
    <div className="w-full">
      <NavTitle title="Shop
       by Category" icons={false} />
      <div>
        <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
          {items.map(({ _id, title, icons, key }) => ( // *** ต้อง destructure key ออกมา
            <li
              key={_id}
              // *** 🎯 Logic การคลิก Filter: เรียก handleFilterClick ***
              onClick={() => handleFilterClick(key)}
              // *** 🎯 Playwright Target: ใช้ key เป็น Identifier ***
              data-testid={`filter-category-${key}`}
              className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center justify-between cursor-pointer hover:text-primeColor duration-300"
            >
              {title}
              {icons && (
                <span
                  // ป้องกันการเรียก Filter เมื่อคลิกที่เครื่องหมาย +
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSubCatOne(!showSubCatOne);
                  }}
                  className="text-[10px] lg:text-xs cursor-pointer text-gray-400 hover:text-primeColor duration-300"
                >
                  <ImPlus />
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Category;
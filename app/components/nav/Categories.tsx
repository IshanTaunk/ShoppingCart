'use client';

import { desiredCategories } from "@/app/utils/productHelper";
import Container from "../Container";
import CategoryClient from "./CategoryClient";
import { usePathname, useSearchParams } from "next/navigation";

const Categories = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const selectedCategory = searchParams?.get('category') || 'all';

    const isMainPage = pathname === '/' || pathname === '/products';
    if (!isMainPage) return null;

    return(
        <div>
      <Container>
        <div className="hidden sm:flex sm:flex-col justify-start">
            <button
            className="bg-gray-200 rounded-md pt-2 w-10"
            onClick={() => {
              const menu =
                document.getElementById('category-menu');
              if (menu) {
                menu.classList.toggle('hidden');
              }
            }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
          <div
            id="category-menu"
            className="grid grid-cols-3 mt-1">
            {desiredCategories.map((item) => (
              <CategoryClient
                key={item.label}
                label={item.label}
                icon={item.icon}
                selected={selectedCategory === item.label}
              />
            ))}
          </div>
        </div>
        <div
          className="pt-4 grid grid-cols-3 lg:grid lg:grid-cols-11 items-center justify-between
         md:grid md:grid-cols-5 sm:hidden gap-4 md:gap-8 lg:gap-0 lg:ml-[-4rem]">
          {desiredCategories.map((item) => (
            <CategoryClient
              key={item.label}
              label={item.label}
              icon={item.icon}
              selected={selectedCategory === item.label}
            />
          ))}
        </div>
      </Container>
      </div>
    )
}

export default Categories;

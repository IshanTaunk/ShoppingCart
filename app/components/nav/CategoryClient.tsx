import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconType } from "react-icons";
import queryString from 'query-string';

interface CategoryProps {
  label: string;
  icon: IconType;
  selected: boolean;
}

const Category: React.FC<CategoryProps> = ({
  label,
  icon: Icon,
  selected,
})=>{
    const router = useRouter();
    const params = useSearchParams();
    const pathname = usePathname();

    const handleCategoryChange = (newCategory: string) => {
        const searchParams = new URLSearchParams(
        params ?? undefined,
        );
        const query = searchParams?.get('q');
        if (query) {
        searchParams.delete('q');
        }
        if (newCategory === 'all') {
        searchParams.delete('category');
        } else {
        searchParams.delete('category');
        searchParams.set('category', newCategory);
        }

        if (pathname === '/products') {
            if (newCategory === 'all') {
            router.push('/');
            } else {
            const currentQuery = queryString.parse(
            searchParams.toString(),
            );
            const updateQuery = {
            ...currentQuery,
            category: newCategory,
            };
            const url = queryString.stringifyUrl(
            {
                url: '/products',
                query: updateQuery,
            },
            {
                skipNull: true,
            },
            );

            router.push(url);
            }
        } else {
        router.push(
            `${pathname}products/?${searchParams.toString()}`,
        );
        }
    }

    return (
        <div
        onClick={() => handleCategoryChange(label)}
        className={`flex items-center justify-center text-center gap-1 p-2 border-b-2 sm:border-transparent hover:text-slate-800 transition
        cursor-pointer ${selected ? 'border-b-slate-800 text-slate-800' : 'border-transparent text-slate-500 sm:border-transparent'}`}>
        <Icon size={20} />
        <div className="font-medium text-sm sm:font-thin sm:text-xs lg:font-thin">
            {label.charAt(0).toUpperCase() + label.slice(1)}
        </div>
        </div>
    )
};

export default Category;
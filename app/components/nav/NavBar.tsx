import Link from "next/link"
import Container from "../Container"
import logo from '../../assets/images/Logo.png';
import { Redressed } from "next/font/google";
import Image from "next/image";
import CartCount from "./CartCount";
import UserMenu from "./UserMenu";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { Suspense } from "react";
import SearchBar from "./SearchBar";
import Categories from "./Categories";

const redressed = Redressed({
  subsets: ['latin'],
  weight: ['400'],
});

export const NavBar = async() => {
    const currentUser = await getCurrentUser();
    return (
        <div className="sticky top-0 w-full bg-slate-200 z-30 shadow-sm pl-2 pr-2">
            <div className="py-4 border-b-[1px]">
                <Container>
                    <div className="flex flex-wrap md:flex-nowrap items-center md:gap-8 justify-between gap-3">
                        <Link
                            href="/"
                            className={`${redressed.className} font-bold flex shrink-0`}>
                            <Image
                                className="md:w-7 md:h-7 w-5 h-5"
                                src={logo.src}
                                width={logo.width}
                                height={logo.height}
                                alt="eshopLogo"
                            />
                            fingerhut
                        </Link>

                        <div className="order-last w-full min-w-0 md:order-none md:flex md:w-80 md:shrink">
                            <Suspense
                                fallback={<div>Loading Search..</div>}>
                                <SearchBar />
                            </Suspense>
                        </div>
                            
                        <div className="flex shrink-0 items-center gap-4 md:gap-8 lg:ml-48">
                            <CartCount />
                            <UserMenu currentUser={currentUser}/>
                        </div>
                    </div>
                    <Suspense
                        fallback={<div>Loading Categories..</div>}>
                        <Categories />
                    </Suspense>
                </Container>
            </div>
        </div>
    )
}
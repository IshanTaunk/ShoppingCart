import Link from "next/link"
import Container from "../Container"
import logo from '../../assets/Logo.png';
import { Redressed } from "next/font/google";
import Image from "next/image";
import CartCount from "./CartCount";

const redressed = Redressed({
  subsets: ['latin'],
  weight: ['400'],
});

export const NavBar = () => {
    return (
        <div className="sticky top-0 w-full bg-slate-200 z-30 shadow-sm pl-2 pr-2">
            <div className="py-4 border-b-[1px]">
                <Container>
                    <div className="md:flex items-center md:gap-8 grid grid-cols-6 sm:grid justify-between gap-2 sm:grid-cols-5 sm:gap-1">
                        <Link
                            href="/"
                            className={`${redressed.className} font-bold flex sm:col-span-1`}>
                            <Image
                                className="md:w-7 md:h-7 w-5 h-5"
                                src={logo.src}
                                width={logo.width}
                                height={logo.height}
                                alt="eshopLogo"
                            />
                            fingerhut
                        </Link>
                        <div className="flex items-center gap-4  ml-48 md:gap-8 sm:col-span-1 sm:gap-4 sm:ml-40">
                            <CartCount />
                        </div>
                    </div>
                </Container>
            </div>
        </div>
    )
}
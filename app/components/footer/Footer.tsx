import Container from '../Container';
import Link from 'next/link';
import { FooterList } from './FooterList';
import { MdFacebook } from 'react-icons/md';
import { AiFillInstagram, AiFillTwitterCircle, AiFillYoutube } from 'react-icons/ai';

const Footer = () => {
  return (
    <footer className="text-black-200 text-sm mt-16 bg-footer">
      <Container>
        <div className="flex flex-col md:flex-row justify-between pt-16 pb-8">
          <FooterList>
            <h3 className="text-base font-bold mb-2">Shop Categories</h3>
            <Link href="#">Woman</Link>
            <Link href="#">Man</Link>
            <Link href="#">Home & Furniture</Link>
            <Link href="#">Asseccories</Link>
            <Link href="#">Phones & Electronics</Link>
            <Link href="#">Sports & Outdoor</Link>
            <Link href="#">Sale</Link>
          </FooterList>
          <FooterList>
            <h3 className="text-base font-bold mb-2">Customer Service</h3>
            <Link href="#">Contact Us</Link>
            <Link href="#">Shipping Policy</Link>
            <Link href="#">Returns & Exahcnges</Link>
            <Link href="#">FAQs</Link>
            <Link href="#">Privacy Policy</Link>
          </FooterList>
          <div className="w-1/2 sm:w-full md:w-1/4 lg:w-1/6 mb-6 md:mr-4 flex flex-col ">
            <h3 className="text-base font-bold mb-2">About Us</h3>
            <p className="mb-2">
              At our store, we are dedicated to providing the latest and gratest items in each category to our
              customers. With a wide selection of Men/Women clothings, Home & Furnitures, Electronics and Accessories.
            </p>
            <p>&copy; {new Date().getFullYear()} Fingernut online store. All rights reserved</p>
          </div>
          <FooterList>
            <h3 className="text-base font-bold mb-2">Follow Us</h3>
            <div className="flex gap-2 ">
              <Link href="#">
                <MdFacebook size={24} />
              </Link>
              <Link href="#">
                <AiFillTwitterCircle size={24} />
              </Link>
              <Link href="#">
                <AiFillInstagram size={24} />
              </Link>
              <Link href="#">
                <AiFillYoutube size={24} />
              </Link>
            </div>
          </FooterList>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

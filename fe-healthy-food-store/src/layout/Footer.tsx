import imgFooter from "../assets/image-footer.png";
import imgFB from "../assets/imgFB.png";
import imgIns from "../assets/imgIns.png";

const Footer = () => {
  return (
    <footer className="bg-[#546658] mt-10 py-5">
      <div className="pb-4 border-b border-b-white">
        <div className="w-[1200px] mx-auto flex justify-between items-center px-5">
          <h1 className="text-2xl font-semibold text-white">
            Follow us on social network
          </h1>
          <div className="flex gap-x-1">
            <img
              src={imgFB}
              alt=""
              className="w-[50px] h-[50px] object-cover"
            />
            <img
              src={imgIns}
              alt=""
              className="w-[50px] h-[50px] object-cover"
            />
          </div>
        </div>
      </div>
      <div className="pb-4 border-b border-b-white">
        <div className="w-[800px] mx-auto pt-5">
          <h1 className="text-2xl font-semibold text-center text-white">
            STORE INFORMATION
          </h1>
          <div className="flex items-center text-white">
            <div className="w-[33.33%] flex flex-col gap-y-2 items-center">
              <p>HEALTHY FOOD STORE</p>
              <p>Lien Chieu District, Da Nang City</p>
              <p>Tel: +84 234 56789</p>
              <p>Hotline: +84 (0) 909 123 456</p>
              <p>danang@healthyfoodstore.site</p>
              <p>Vietnam</p>
            </div>
            <div className="w-[33.33%] flex flex-col gap-y-2 items-center">
              <p>Privacy and Data Protection</p>
              <p>Terms and conditions of use</p>
              <p>Delivery & Return Policy</p>
              <p>Secure Payment</p>
              <p>FAQ</p>
              <p>Contact us</p>
            </div>
            <div className="w-[33.33%]">
              <img
                src={imgFooter}
                alt=""
                className="object-cover w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
      <p className="pt-5 text-center text-white">© 2024 - Healthy Food Store</p>
    </footer>
  );
};

export default Footer;

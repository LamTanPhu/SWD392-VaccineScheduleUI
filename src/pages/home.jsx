import Product from "../components/product";
import { PRODUCTS } from "../utils/constants";
import Banner from "./../assets/images/banner.png";
import Service1 from "./../assets/images/s1.png";
import Service2 from "./../assets/images/s2.png";
import Service3 from "./../assets/images/s3.png";
import Service4 from "./../assets/images/s4.png";

export default function Home() {
  return (
    <>
      <div className="h-[80vh]">
        <img className="w-full h-full object-cover" src={Banner} alt="banner" />
      </div>
      <div className="container mx-auto py-10">
        <h5 className="font-bold text-xl mb-5">
          DANH MỤC VẮC XIN TẠI CÁC CƠ SỞ
        </h5>
        <div className="flex justify-between items-start flex-wrap gap-y-3">
          {PRODUCTS.map((item, index) => (
            <div className="w-1/3 px-10" key={index}>
              <Product item={item}/> 
            </div>
          ))}
        </div>
      </div>
      <div className="bg-secondary py-15">
        <h1 className="text-center font-bold text-2xl mb-10">
          CÁC DỊCH VỤ CỦA CHÚNG TÔI
        </h1>
        <div className="container flex items-center justify-between mx-auto">
          <div className="w-fit bg-gray p-7 rounded-xl flex flex-col justify-center items-center gap-2">
            <div>
              <img src={Service1}></img>
            </div>
            <p className="text-center">TIÊM CHỦNG TẠI CƠ SỞ</p>
          </div>
          <div className="w-fit bg-gray p-7 rounded-xl flex flex-col justify-center items-center gap-2">
            <div>
              <img src={Service2}></img>
            </div>
            <p className="text-center">TIÊM CHỦNG THEO COMBO</p>
          </div>
          <div className="w-fit bg-gray p-7 rounded-xl flex flex-col justify-center items-center gap-2">
            <div>
              <img src={Service3}></img>
            </div>
            <p className="text-center">TIÊM CHỦNG THEO YÊU CẦU</p>
          </div>
          <div className="w-fit bg-gray p-7 rounded-xl flex flex-col justify-center items-center gap-2">
            <div>
              <img src={Service4}></img>
            </div>
            <p className="text-center">TIÊM CHỦNG VIP</p>
          </div>
        </div>
      </div>
      <hr className="bg-white text-white" />
    </>
  );
}

import Banner from "./assets/images/banner.png";
import Service1 from "./assets/images/s1.png";
import Service2 from "./assets/images/s2.png";
import Service3 from "./assets/images/s3.png";
import Service4 from "./assets/images/s4.png";
import Product1 from "./assets/images/p1_1.png";
import Product2 from "./assets/images/p1.png";
import Product3 from "./assets/images/p3.png";
import Product4 from "./assets/images/p4.png";
import Product5 from "./assets/images/p5.png";
import Product6 from "./assets/images/p6.png";

const products = [
    { image: Product1, name: "VẮC XIN SỐT XUẤT HUYẾT" },
    { image: Product2, name: "VẮC XIN PHẾ CẦU 23" },
    { image: Product3, name: "VẮC XIN PHẾ CẦU 13" },
    { image: Product4, name: "VẮC XIN ZONA THẦN KINH" },
    { image: Product5, name: "VẮC XIN NÃO MÔ CẦU A" },
    { image: Product6, name: "VẮC XIN NÃO MÔ CẦU B" },
];

const services = [
    { image: Service1, name: "TIÊM CHỦNG TẠI CƠ SỞ" },
    { image: Service2, name: "TIÊM CHỦNG THEO COMBO" },
    { image: Service3, name: "TIÊM CHỦNG THEO YÊU CẦU" },
    { image: Service4, name: "TIÊM CHỦNG VIP" },
];

function ProductList({ products }) {
    return (
        <div className='flex justify-between items-start flex-wrap gap-y-3'>
        {products.map((product, index) => (
            <div key={index} className='w-1/3 px-10'>
            <div>
                <img className='w-full h-full object-contain' src={product.image} alt={product.name}/>
            </div>
            <p className='text-center mt-2 font-bold'>{product.name}</p>
            </div>
        ))}
        </div>
    );
}

function ServiceList({ services }) {
    return (
        <div className='container flex items-center justify-between mx-auto'>
        {services.map((service, index) => (
            <div key={index} className="w-fit bg-gray p-7 rounded-xl flex flex-col justify-center items-center gap-2">
            <div>
                <img src={service.image} alt={service.name} />
            </div>
            <p className="text-center">{service.name}</p>
            </div>
        ))}
        </div>
    );
}

export default function HomePage() {
    return (
        <>
        <div className='h-[80vh]'>
            <img className='w-full h-full object-cover' src={Banner} alt='banner'/>
        </div>
        <div className='container mx-auto py-10'>
            <h5 className='font-bold text-xl mb-5'>DANH MỤC VẮC XIN TẠI CÁC CƠ SỞ</h5>
            <ProductList products={products} />
        </div>
        <div className='bg-secondary py-15'>
            <h1 className='text-center font-bold text-2xl mb-10'>CÁC DỊCH VỤ CỦA CHÚNG TÔI</h1>
            <ServiceList services={services} />
        </div>
        <hr className="bg-white text-white"/>
        </>
    );
}

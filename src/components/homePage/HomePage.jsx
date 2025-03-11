import { Link } from 'react-router-dom';
import Banner from "/assets/images/banner.png";
import Product2 from "/assets/images/p1.png";
import Product1 from "/assets/images/p1_1.png";
import Product3 from "/assets/images/p3.png";
import Product4 from "/assets/images/p4.png";
import Product5 from "/assets/images/p5.png";
import Product6 from "/assets/images/p6.png";
import Service1 from "/assets/images/s1.png";
import Service2 from "/assets/images/s2.png";
import Service3 from "/assets/images/s3.png";
import Service4 from "/assets/images/s4.png";

const vaccines = [
    { id: 1, image: Product1, name: "Vắc xin Sốt Xuất Huyết", description: "Bảo vệ khỏi sốt xuất huyết" },
    { id: 2, image: Product2, name: "Vắc xin Phế Cầu 23", description: "Ngăn ngừa viêm phổi" },
    { id: 3, image: Product3, name: "Vắc xin Phế Cầu 13", description: "Phòng bệnh phế cầu khuẩn" },
    { id: 4, image: Product4, name: "Vắc xin Zona Thần Kinh", description: "Ngăn ngừa bệnh zona" },
    { id: 5, image: Product5, name: "Vắc xin Não Mô Cầu A", description: "Phòng viêm màng não" },
    { id: 6, image: Product6, name: "Vắc xin Não Mô Cầu B", description: "Bảo vệ khỏi viêm màng não" },
];

const services = [
    { image: Service1, name: "Đặt lịch tại cơ sở", description: "Chọn thời gian tiêm tại trung tâm" },
    { image: Service2, name: "Gói vắc xin combo", description: "Tiết kiệm với gói nhiều mũi" },
    { image: Service3, name: "Tiêm theo yêu cầu", description: "Linh hoạt theo nhu cầu cá nhân" },
    { image: Service4, name: "Dịch vụ VIP", description: "Ưu tiên phục vụ cao cấp" },
];

function VaccineList({ vaccines }) {
    // Add to Cart function, adapted from your allies' Product component
    const addToCart = (item) => {
        const cart = JSON.parse(localStorage.getItem("cart")) ?? [];

        let itemIndex = cart.findIndex((x) => x.id === item.id);
        if (itemIndex === -1) {
            cart.push({ ...item, quantity: 1 });
        } else {
            cart[itemIndex].quantity += 1;
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`${item.name} đã được thêm vào giỏ hàng!`); // Optional: Feedback to user
    };

    return (
        <div className="row row-cols-1 row-cols-md-3 g-4">
            {vaccines.map((vaccine) => (
                <div key={vaccine.id} className="col">
                    <div className="card h-100 shadow-sm">
                        <img className="card-img-top p-3" src={vaccine.image} alt={vaccine.name} />
                        <div className="card-body">
                            <h5 className="card-title">{vaccine.name}</h5>
                            <p className="card-text text-muted">{vaccine.description}</p>
                        </div>
                        <div className="card-footer bg-white border-0">
                            <button
                                className="bg-transparent border border-primary px-5 py-1 rounded-md hover:bg-primary hover:text-white transition-all cursor-pointer w-100"
                                onClick={() => addToCart(vaccine)}
                            >
                                Thêm nhanh
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function ServiceList({ services }) {
    return (
        <div className="row row-cols-1 row-cols-md-4 g-4">
            {services.map((service, index) => (
                <div key={index} className="col">
                    <div className="card h-100 text-center shadow-sm">
                        <img className="card-img-top mx-auto mt-3" style={{width: '100px'}} src={service.image} alt={service.name} />
                        <div className="card-body">
                            <h6 className="card-title fw-bold">{service.name}</h6>
                            <p className="card-text text-muted small">{service.description}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function HomePage() {
    return (
        <>
            {/* Banner Section */}
            <div className="position-relative" style={{ height: "60vh" }}>
                <img className="w-100 h-100 object-fit-cover" src={Banner} alt="banner" />
                <div className="position-absolute top-50 start-50 translate-middle text-center text-white">
                    <h1 className="display-4 fw-bold">LỊCH TIÊM VẮC XIN DỄ DÀNG</h1>
                    <p className="lead">Đặt lịch nhanh chóng - An toàn - Tiện lợi</p>
                    <Link to="/schedule" className="btn btn-primary btn-lg mt-3">Đặt lịch ngay</Link>
                </div>
            </div>

            {/* Vaccine List Section */}
            <div className="container py-5">
                <h2 className="text-center fw-bold mb-4">CÁC LOẠI VẮC XIN PHỔ BIẾN</h2>
                <p className="text-center text-muted mb-5">Chọn vắc xin phù hợp và đặt lịch ngay hôm nay</p>
                <VaccineList vaccines={vaccines} />
            </div>

            {/* Services Section */}
            <div className="bg-light py-5">
                <div className="container">
                    <h2 className="text-center fw-bold mb-4">DỊCH VỤ TIÊM CHỦNG</h2>
                    <ServiceList services={services} />
                </div>
            </div>

            {/* Call to Action Section */}
            <div className="bg-primary text-white py-4">
                <div className="container text-center">
                    <h3 className="fw-bold mb-3">SẴN SÀNG BẢO VỆ SỨC KHỎE?</h3>
                    <p className="mb-4">Đặt lịch tiêm vắc xin ngay hôm nay để đảm bảo sức khỏe cho bạn và gia đình</p>
                    <Link to="/schedule" className="btn btn-light btn-lg">Bắt đầu ngay</Link>
                </div>
            </div>
        </>
    );
}
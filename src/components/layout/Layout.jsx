import React from 'react';
import { Link } from 'react-router-dom';

const locations = {
    north: ["Bắc Giang", "Hà Nội", "Hải Phòng", "Yên Bái", "Hải Dương", "Phú Thọ"],
    central: ["Thanh Hóa", "Nghệ An", "Hà Tĩnh", "Quảng Bình", "Huế", "Đà Nẵng"],
    south: ["Hồ Chí Minh", "Bình Dương", "Đồng Nai", "Cần Thơ", "Vũng Tàu", "Long An"]
};

const Header = () => (
    <header className="py-6 text-lg border-b">
        <div className="container mx-auto flex items-center justify-between">
            <div>Logo</div>
            <nav className="flex gap-5">
                <Link to="/">Trang chủ</Link>
                <Link to="/about">Giới thiệu</Link>
                <Link to="/vaccines">Các loại vắc xin</Link>
                <Link to="/packages">Gói vắc xin</Link>
                <Link to="/pricing">Bảng giá</Link>
            </nav>
            <div className="flex items-center gap-3">
                <Link to="/search">Search</Link>
                <Link to="/login" className="bg-primary text-white px-3 py-1">Sign In</Link>
            </div>
        </div>
    </header>
);

const Footer = () => (
    <footer className="bg-primary text-lg text-white px-3 pt-2 pb-5">
        <div className="container mx-auto">
            <div>
                <div>Logo</div>
                <p className="font-bold">VACCINE SCHEDULE FOR KIDS</p>
                <span className="text-sm">Mở cửa từ 7:30 - 17:00 (Không nghỉ trưa)</span>
            </div>
            <div className="flex justify-between mt-4">
                {Object.entries(locations).map(([region, cities]) => (
                    <div key={region}>
                        <h5 className="font-bold">HỆ THỐNG {region.toUpperCase()}</h5>
                        <ul className="ml-7 list-disc">
                            {cities.map((city) => (
                                <li key={city}>{city}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <hr className="mt-3 mb-3" />
            <div className="flex justify-between">
                <div className="flex flex-col">
                    <Link to="/privacy">Chính sách bảo mật</Link>
                    <Link to="/survey">Khảo sát tiêm chủng</Link>
                    <Link to="/payment-policy">Chính sách thanh toán</Link>
                </div>
                <div>
                    <p className="font-bold">CÔNG TY CỔ PHẦN VẮC XIN VIỆT NAM</p>
                    <a href="mailto:vaccineschedulevip@gmail.com">vaccineschedulevip@gmail.com</a>
                </div>
            </div>
        </div>
    </footer>
);

const Layout = ({ children }) => (
    <div>
        <Header />
        <main className="container mx-auto py-6">{children}</main>
        <Footer />
    </div>
);

export default Layout;
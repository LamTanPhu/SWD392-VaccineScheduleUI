export default function Header() {
    return <header className="py-6 text-lg">
          <div className="container flex items-center justify-between mx-auto">
            <div>Logo</div>
            <nav className="flex gap-5">
                <a href="#">Trang chủ</a>
                <a href="/about">Giới thiệu</a>
                <a href="#">Các loại vắc xin</a>
                <a href="#">Gói vắc xin</a>
                <a href="#">Bảng giá</a>
            </nav>
            <div className="flex items-center justify-end gap-3">
                <a>
                    Search
                </a>
                <a href="/login" className="bg-primary text-white px-3 py-1">
                    Sign In
                </a>
            </div>
          </div>
    </header>
}
import Header from "./header"
import Footer from "./footer"

export default function Layout({ children }) {
  return (
    <>
      <Header />
        <main className="min-h-[calc(100vh-597px)]">{children}</main>
      <Footer />
    </>
  );
}

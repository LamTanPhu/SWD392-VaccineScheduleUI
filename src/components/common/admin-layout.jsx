import Sidebar from "./sidebar";

export default function AdminLayout({ children }) {
  return <div>
    <main className="grid grid-cols-[300px_1fr]">
        <aside>
            <Sidebar />
        </aside>
        <div>
            <header className="bg-white p-4">
              <div className="flex justify-end items-center">
                Hello, admin!
              </div>
            </header>
            <div className="p-4 bg-gray-100 min-h-[calc(100vh-60px)]">
              {children}
            </div>
        </div>
    </main>
  </div>;
}
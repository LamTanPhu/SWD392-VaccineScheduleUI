import { Link } from "react-router";
import IconCalendar from "../icons/IconCalendar";
import IconHome from "../icons/IconHome";
import IconInfo from "../icons/IconInfo";
import IconUser from "../icons/IconUser";
import IconVaccine from "../icons/IconVaccine";

export default function Sidebar() {
    const menu = [
        {
            name: "Dashboard",
            path: "/admin/dashboard",
            icon: <IconHome color={"#fff"} />
        },
        {
            name: "Vaccines",
            path: "/admin/vaccines",
            icon: <IconVaccine color={"#fff"} />
        },
        {
            name: "Schedules",
            path: "/admin/vaccines",
            icon: <IconCalendar color={"#fff"} />
        },
        {
            name: "Users",
            path: "/admin/users",
            icon: <IconUser color={"#fff"} />
        },
        {
            name: "Settings",
            path: "/admin/settings",
            icon: <IconInfo color={"#fff"} />
        }
    ];
    return (
        <div className="w-[300px] h-full bg-primary text-white p-4 fixed top-0 left-0">
            <h1 className="text-2xl font-bold text-white text-center mb-5 border-b border-white pb-5">
                Vaccine Management
            </h1>
            <div className="flex flex-col gap-5">
                {menu.map((item) => (
                    <Link to={item.path} key={item.name}>
                        <div className="flex items-center gap-4 cursor-pointer">
                            {item.icon}
                            <span className="text-lg">{item.name}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
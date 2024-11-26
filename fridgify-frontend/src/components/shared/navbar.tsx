import { Button } from "../ui/button";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import logo from "@/logo.png";
import { useEffect } from "react";

const buttonRoutes = [
    { name: "Inventory", path: "/inventory" },
    { name: "Recipes", path: "/recipe" },
    { name: "Profile", path: "/profile" },
]

export const Navbar = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.pathname !== "/") {
            const userIdString = localStorage.getItem('user_id');
            if (!userIdString) {
                window.location.href = "/"; // Prompt user to login
            }
        }
    }, [location.pathname]);

    if (location.pathname.startsWith("/scan")) return null;

    return (
        <div className="m-3 flex flex-row items-center justify-between">
            <Link to="/inventory">
                <Button className="p-0 h-fit w-fit" variant="ghost">
                    <img src={logo} width={50} />
                </Button>
            </Link>
            <div className="flex flex-row items-center justify-center gap-1 w-full">
                {buttonRoutes.map((route) => (
                    <Link key={route.path} to={route.path}>
                        <Button variant="outline"
                            className={cn("px-3", route.path === location.pathname ? "border-black" : "",
                            "bg-lightGreen-100 hover:bg-lightGreen-200 text-lightGreen-800")}
                        >
                            {route.name}
                        </Button>
                    </Link>
                ))}
            </div>
        </div>
    );
}
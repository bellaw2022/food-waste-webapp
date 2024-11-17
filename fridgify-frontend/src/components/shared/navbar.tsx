import { Share2Icon } from "lucide-react";
import { Button } from "../ui/button";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import logo from "@/logo.png";

const buttonRoutes = [
    { name: "Inventory", path: "/inventory" },
    { name: "Recipes", path: "/recipe" },
    { name: "Profile", path: "/profile" },
]

export const Navbar = () => {
    const location = useLocation();

    if (location.pathname.startsWith("/scan")) return null;

    return (
        <div className="m-3 flex flex-row items-center justify-between">
            <Link to="/">
                <Button className="p-0 h-fit w-fit" variant="ghost">
                    <img src={logo} width={50} />
                </Button>
            </Link>
            <div className="flex flex-row items-center justify-center gap-1">
                {buttonRoutes.map((route) => (
                    <Link key={route.path} to={route.path}>
                        <Button variant="outline"
                            className={cn("px-3", route.path === location.pathname ? "border-black" : "")}
                        >
                            {route.name}
                        </Button>
                    </Link>
                ))}
            </div>
            <Link to="/profile/#share">
                <Button className="px-2 w-fit h-fit rounded-sm bg-[green]/50" variant="outline">
                    <Share2Icon size={18} />
                </Button>
            </Link>
        </div>
    );
}
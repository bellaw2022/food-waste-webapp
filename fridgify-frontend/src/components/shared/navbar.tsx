import { PlusCircleIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Link, useLocation } from "react-router-dom";

const buttonRoutes = [
    { name: "Home", path: "/" },
    { name: "Inventory", path: "/inventory" },
    { name: "Recipe Rec", path: "/recipe" },
]

export const Navbar = () => {
    const location = useLocation();

    if (location.pathname === "/scan") return null;

    return (
        <div className="m-3 flex flex-row items-center justify-between">
            <Link to="/scan">
                <Button className="p-2 h-fit w-fit rounded-full bg-[green]" variant="outline">
                    <PlusCircleIcon size={32} color="white" />
                </Button>
            </Link>
            <div className="flex flex-row items-center justify-center gap-1">
                {buttonRoutes.map((route) => (
                    <Link to={route.path}>
                        <Button variant="outline"
                            className={route.path === location.pathname ? "border-black" : ""}
                        >
                            {route.name}
                        </Button>
                    </Link>
                ))}
            </div>
        </div>
    );
}
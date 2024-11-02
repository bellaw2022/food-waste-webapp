import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useScanningCart } from "@/store/scanning-cart"
import { XIcon } from "lucide-react"

export const ManualInputModal = () => {
    const { isModalOpen, closeModal } = useScanningCart();

    if (!isModalOpen) return null;

    return (
        <div 
            className="z-[99] absolute top-0 left-0 w-[100vw] h-[100vh] bg-black/50
            flex flex-col justify-center items-center"
        >
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        Manual Selection
                        <Button onClick={closeModal} variant="ghost"
                            className="p-0"
                        >
                            <XIcon />
                        </Button>
                    </CardTitle>
                    <CardDescription>Deploy your new project in one-click.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Name of your project" />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="framework">Framework</Label>
                        <Select>
                            <SelectTrigger id="framework">
                            <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                            <SelectItem value="next">Next.js</SelectItem>
                            <SelectItem value="sveltekit">SvelteKit</SelectItem>
                            <SelectItem value="astro">Astro</SelectItem>
                            <SelectItem value="nuxt">Nuxt.js</SelectItem>
                            </SelectContent>
                        </Select>
                        </div>
                    </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button>Deploy</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
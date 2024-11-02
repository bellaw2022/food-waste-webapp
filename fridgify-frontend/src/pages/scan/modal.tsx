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
import { useScanningCart } from "@/store/scanning-cart"
import { XIcon } from "lucide-react"
import { useState } from "react"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  
  const invoices = [
    {
      invoice: "INV001",
      paymentStatus: "Paid",
      totalAmount: "$250.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV002",
      paymentStatus: "Pending",
      totalAmount: "$150.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV003",
      paymentStatus: "Unpaid",
      totalAmount: "$350.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV004",
      paymentStatus: "Paid",
      totalAmount: "$450.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV005",
      paymentStatus: "Paid",
      totalAmount: "$550.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV006",
      paymentStatus: "Pending",
      totalAmount: "$200.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV007",
      paymentStatus: "Unpaid",
      totalAmount: "$300.00",
      paymentMethod: "Credit Card",
    },
  ]
  
const ItemsTable = () => {
    return (
        <Table>
            {/* <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Invoice</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                </TableRow>
            </TableHeader> */}
            <TableBody>
                {invoices.map((invoice) => (
                    <TableRow key={invoice.invoice}>
                        <TableCell className="font-medium">{invoice.invoice}</TableCell>
                        <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
};  

export const ManualInputModal = () => {
    const { isModalOpen, closeModal } = useScanningCart();
    const [searchQuery, setSearchQuery] = useState("");

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
                    <CardDescription>Enter your item(s) below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Input placeholder="Search by Item Name" type="search"
                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="mt-5 h-[280px] border-[1px] border-black/10 rounded-md shadow-sm overflow-y-scroll">
                        <ItemsTable />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button>Update</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
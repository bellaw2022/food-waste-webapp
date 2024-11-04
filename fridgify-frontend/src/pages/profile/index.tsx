import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChartBarIcon } from "lucide-react";

export const ProfilePage = () => {
    return (
        <div className="mx-4 mb-10">
            <h1 className="text-3xl font-bold mb-3">Profile</h1>
            <Card>
                <CardHeader className="flex flex-row items-center justify-center">
                    <div className="w-[120px] h-[120px] rounded-full bg-[gray]/50 text-center
                        flex flex-row items-center justify-center"
                    >
                        Profile Photo
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="border-2 border-black/10 rounded-md">
                        <Table>
                            <TableBody className="bg-[gray]/10">
                               <NotificationSection />
                               <PrivacySection />
                               <FoodSection />
                               <ProgressSection />
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

const NotificationSection = () => {
    return (
        <>
            <TableRow className="h-10 bg-white">
                <TableCell className="text-large font-bold">Notification Preferences</TableCell>
            </TableRow>
            <TableRow className="h-10">
                <TableCell className="font-medium">
                    <div className="ml-2">Expiration Alerts</div>
                </TableCell>
                <TableCell className="text-right">
                    <Checkbox
                        className="mr-5" 
                        defaultChecked={false}
                        onCheckedChange={(e) => {}} 
                    />
                </TableCell>
            </TableRow>
            <TableRow className="h-10">
                <TableCell className="font-medium">
                    <div className="ml-2">Recipe Suggestions</div>
                </TableCell>
                <TableCell className="text-right">
                    <Checkbox
                        className="mr-5" 
                        defaultChecked={false}
                        onCheckedChange={(e) => {}} 
                    />
                </TableCell>
            </TableRow>
            <TableRow className="h-10">
                <TableCell className="font-medium">
                    <div className="ml-2">Waste Reduction Report</div>
                </TableCell>
                <TableCell className="text-right">
                    <Checkbox
                        className="mr-5" 
                        defaultChecked={false}
                        onCheckedChange={(e) => {}} 
                    />
                </TableCell>
            </TableRow>
        </>
    )
}

const PrivacySection = () => {
    return (
        <>
            <TableRow className="h-10 bg-white">
                <TableCell className="text-large font-bold">Privacy</TableCell>
            </TableRow>
            <TableRow className="h-10">
                <TableCell className="font-medium">
                    <div className="ml-2">Anonymize Data</div>
                </TableCell>
                <TableCell className="text-right">
                    <Checkbox
                        className="mr-5" 
                        defaultChecked={false}
                        onCheckedChange={(e) => {}} 
                    />
                </TableCell>
            </TableRow>
        </>
    )
}

const FoodSection = () => {
    return (
        <>
            <TableRow className="h-10 bg-white">
                <TableCell className="text-large font-bold">Food Preferences</TableCell>
            </TableRow>
            <TableRow className="h-10">
                <TableCell className="font-medium">
                    <div className="ml-2">Diet Restrictions</div>
                </TableCell>
                <TableCell className="text-right">
                    <Select defaultValue="none">
                        <SelectTrigger id="diet-selection" className="bg-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent position="popper">
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="vegetarian">Vegetarian</SelectItem>
                            <SelectItem value="vegan">Vegan</SelectItem>
                        </SelectContent>
                    </Select>
                </TableCell>
            </TableRow>
        </>
    )
}

const ProgressSection = () => {
    return (
        <>
            <TableRow className="h-10 bg-white">
                <TableCell className="text-large font-bold">Progress Tracking</TableCell>
            </TableRow>
            <TableRow className="h-10">
                <TableCell className="font-medium">
                    <div className="ml-2">1</div>
                </TableCell>
                <TableCell className="text-right">
                    <ChartBarIcon />
                </TableCell>
            </TableRow>
        </>
    )
}
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/ToggleSwitch";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChartBarIcon } from "lucide-react";
import { useState } from "react";
import ToggleSwitch from "@/components/ui/ToggleSwitch"; 

export const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("Your Name");
    const [email, setEmail] = useState("youremail@example.com");
    const [profilePic, setProfilePic] = useState(null);

    // Toggle states for notification and privacy options
    const [expirationAlerts, setExpirationAlerts] = useState(false);
    const [recipeSuggestions, setRecipeSuggestions] = useState(false);
    const [wasteReductionReport, setWasteReductionReport] = useState(false);
    const [anonymizeData, setAnonymizeData] = useState(false);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(URL.createObjectURL(file));
        }
    };

    return (
        <div className="mx-4 mb-10">
            <h1 className="text-3xl font-bold mb-3 text-magenta">Profile</h1>
            <Card className="bg-lightGray shadow-lg rounded-md border border-magenta">
                <CardHeader className="flex flex-col items-center">
                    <div className="w-[120px] h-[120px] rounded-full bg-magenta text-center flex items-center justify-center mb-4 text-white overflow-hidden">
                        {profilePic ? (
                            <img src={profilePic} alt="Profile" className="object-cover w-full h-full" />
                        ) : (
                            "Profile Photo"
                        )}
                    </div>
                    {isEditing && (
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePicChange}
                            className="mb-4"
                        />
                    )}
                    <div className="w-full max-w-xs flex flex-col items-center space-y-3 mb-4">
                        <input
                            type="text"
                            className={`text-xl font-semibold text-center ${
                                isEditing ? "border-b border-magenta" : "bg-lightGray"
                            }`}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            readOnly={!isEditing}
                            placeholder="Enter your name"
                        />
                        <input
                            type="email"
                            className={`text-md text-center ${
                                isEditing ? "border-b border-magenta" : "bg-lightGray"
                            }`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            readOnly={!isEditing}
                            placeholder="Enter your email"
                        />
                    </div>
                    <button
                        onClick={handleEditToggle}
                        className="px-4 py-2 mt-2 bg-magenta text-white rounded-md hover:bg-pink-500 transition duration-150"
                    >
                        {isEditing ? "Save" : "Edit"}
                    </button>
                </CardHeader>
                <CardContent>
                    <div className="border-2 border-magenta rounded-md">
                        <Table>
                            <TableBody className="bg-lightGray">
                                <NotificationSection
                                    expirationAlerts={expirationAlerts}
                                    setExpirationAlerts={setExpirationAlerts}
                                    recipeSuggestions={recipeSuggestions}
                                    setRecipeSuggestions={setRecipeSuggestions}
                                    wasteReductionReport={wasteReductionReport}
                                    setWasteReductionReport={setWasteReductionReport}
                                />
                                <PrivacySection
                                    anonymizeData={anonymizeData}
                                    setAnonymizeData={setAnonymizeData}
                                />
                                <FoodSection />
                                <ProgressSection />
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};


const NotificationSection = ({ expirationAlerts, setExpirationAlerts, recipeSuggestions, setRecipeSuggestions, wasteReductionReport, setWasteReductionReport }) => (
    <>
        <TableRow className="h-10 bg-lightGray">
            <TableCell className="text-lg font-bold text-magenta">Notification Preferences</TableCell>
        </TableRow>
        {[
            { label: "Expiration Alerts", value: expirationAlerts, setValue: setExpirationAlerts },
            { label: "Recipe Suggestions", value: recipeSuggestions, setValue: setRecipeSuggestions },
            { label: "Waste Reduction Report", value: wasteReductionReport, setValue: setWasteReductionReport },
        ].map((item, index) => (
            <TableRow key={index} className="h-12">
                <TableCell className="font-medium text-gray-700">
                    <div className="ml-2">{item.label}</div>
                </TableCell>
                <TableCell className="text-right">
                    <ToggleSwitch
                        className="mr-5 bg-magenta"
                        checked={item.value}
                        onChange={item.setValue}
                    />
                </TableCell>
            </TableRow>
        ))}
    </>
);

const PrivacySection = ({ anonymizeData, setAnonymizeData }) => (
    <>
        <TableRow className="h-10 bg-lightGray">
            <TableCell className="text-lg font-bold text-magenta">Privacy</TableCell>
        </TableRow>
        <TableRow className="h-12">
            <TableCell className="font-medium text-gray-700">
                <div className="ml-2">Anonymize Data</div>
            </TableCell>
            <TableCell className="text-right">
                <ToggleSwitch
                    className="mr-5 bg-magenta"
                    checked={anonymizeData}
                    onChange={setAnonymizeData}
                />
            </TableCell>
        </TableRow>
    </>
);

const FoodSection = () => {
    return (
        <>
            <TableRow className="h-10 bg-lightGray">
                <TableCell className="text-lg font-bold text-magenta">Food Preferences</TableCell>
            </TableRow>
            <TableRow className="h-12">
                <TableCell className="font-medium text-gray-700">
                    <div className="ml-2">Diet Restrictions</div>
                </TableCell>
                <TableCell className="text-right">
                    <Select defaultValue="none">
                        <SelectTrigger id="diet-selection" className="bg-white border border-magenta">
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
};


const ProgressSection = () => {
    return (
        <>
            <TableRow className="h-10 bg-lightGray">
                <TableCell className="text-lg font-bold text-magenta">Progress Tracking</TableCell>
            </TableRow>
            <TableRow className="h-12">
                <TableCell className="font-medium text-gray-700">
                    <div className="ml-2">1</div>
                </TableCell>
                <TableCell className="text-right">
                    <ChartBarIcon className="text-magenta" />
                </TableCell>
            </TableRow>
        </>
    )
};

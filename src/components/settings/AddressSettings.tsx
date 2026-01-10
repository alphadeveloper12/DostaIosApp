import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Country, State } from "country-state-city";
import { toast } from "sonner";

const baseUrl = import.meta.env.VITE_API_URL;

interface Address {
    id: number;
    label: string;
    address_line_1: string;
    address_line_2: string;
    city: string;
    country: string;
    zone: string;
    is_default: boolean;
}

export default function AddressSettings() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [newAddress, setNewAddress] = useState({
        label: "",
        address_line_1: "",
        address_line_2: "",
        city: "",
        country: "",
        zone: "",
        is_default: false,
    });
    const [loading, setLoading] = useState(false);

    const authToken = sessionStorage.getItem("authToken");

    // Get all countries from the library
    const countries = Country.getAllCountries();

    // Get states/zones based on selected country
    const selectedCountry = countries.find((c) => c.name === newAddress.country);
    const zones = selectedCountry
        ? State.getStatesOfCountry(selectedCountry.isoCode)
        : [];

    // Fetch saved addresses on mount
    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const res = await axios.get(`${baseUrl}/api/addresses/`, {
                headers: { Authorization: `Token ${authToken}` },
            });
            setAddresses(res.data);
        } catch (error) {
            console.error("Failed to fetch addresses:", error);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        // If country changes, reset zone
        if (name === "country") {
            setNewAddress((prev) => ({ ...prev, [name]: value, zone: "" }));
        } else {
            setNewAddress((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleAddAddress = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`${baseUrl}/api/addresses/`, newAddress, {
                headers: { Authorization: `Token ${authToken}` },
            });
            setAddresses((prev) => [...prev, res.data]);
            setNewAddress({
                label: "",
                address_line_1: "",
                address_line_2: "",
                city: "",
                country: "",
                zone: "",
                is_default: false,
            });
            toast.success("Address added successfully!");
        } catch (error) {
            console.error("Failed to add address:", error);
            toast.error("Failed to add address.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-2">
            <h1 className="text-[20px] leading-[28px] font-[600] tracking-[0.1px] text-neutral-black">
                Address
            </h1>
            <div className="border border-[#EDEEF2] px-4 pt-6  md:p-0 rounded-[16px]">
                {/* Existing Addresses */}
                <section className="bg-neutral-white rounded-[16px] py-2 md:px-[16px] md:py-[24px] sm:p-8 shadow-sm">
                    <h2 className="text-lg md:font-semibold font-[700] md:mb-6 mb-4  text-foreground">
                        Existing address
                    </h2>
                    <div className="flex flex-wrap items-center md:flex-row gap-4">
                        {addresses.length === 0 && <p>No saved addresses.</p>}
                        {addresses.map((addr) => (
                            <div
                                key={addr.id}
                                className="h-[106px] w-[222px] border border-[#C7C8D2] rounded-[8px] p-[12px]">
                                <h3 className="text-[16px] leading-[24px] font-[700] tracking-[0.1px] text-neutral-black pb-[2px]">
                                    {addr.label}
                                </h3>
                                <p className="text-neutral-gray text-[12px] font-[400] leading-[16px] pb-0">
                                    {addr.city}, {addr.country}
                                </p>
                                <p className="text-[14px] font-[400] leading-[20px] text-neutral-gray-dark">
                                    {addr.address_line_1}, {addr.address_line_2}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* New Address Form */}
                <section className="bg-neutral-white rounded-[16px] py-2 md:px-[16px] md:py-[24px] sm:p-8 shadow-sm">
                    <h2 className="text-lg font-semibold md:mb-6 mb-4 max-md:pt-[48px] text-foreground">New address</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {["label", "address_line 1", "address_line 2", "city"].map((field) => (
                            <div className="space-y-2" key={field}>
                                <label className="text-[0.75rem] text-neutral-gray-dark font-[600] leading-[1rem]">
                                    {field.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                                </label>
                                <input
                                    type="text"
                                    name={field}
                                    value={(newAddress as any)[field]}
                                    onChange={handleChange}
                                    placeholder={`Enter ${field.replace("_", " ")}`}
                                    className="w-full py-[0.625rem] px-[0.75rem] outline-none border border-[#C7C8D2] rounded-[0.5rem]"
                                />
                            </div>
                        ))}

                        {/* Country Dropdown */}
                        <div className="space-y-2">
                            <label className="text-[0.75rem] text-neutral-gray-dark font-[600] leading-[1rem]">
                                Country
                            </label>
                            <select
                                name="country"
                                value={newAddress.country}
                                onChange={handleChange}
                                className="w-full bg-transparent py-[0.625rem] px-[0.75rem] outline-none border border-[#C7C8D2] rounded-[0.5rem] appearance-none">
                                <option value="">Select country</option>
                                {countries.map((country) => (
                                    <option key={country.isoCode} value={country.name}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Zone/State Dropdown */}
                        <div className="space-y-2">
                            <label className="text-[0.75rem] text-neutral-gray-dark font-[600] leading-[1rem]">
                                Zone
                            </label>
                            <select
                                name="zone"
                                value={newAddress.zone}
                                onChange={handleChange}
                                disabled={!newAddress.country}
                                className="w-full bg-transparent py-[0.625rem] px-[0.75rem] outline-none border border-[#C7C8D2] rounded-[0.5rem] appearance-none disabled:opacity-50">
                                <option value="">Select zone</option>
                                {zones.map((zone) => (
                                    <option key={zone.isoCode} value={zone.name}>
                                        {zone.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>

                <div className="gap-4 py-5 px-4 flex justify-end">
                    <Button
                        variant="outline"
                        className="w-full sm:w-auto"
                        onClick={handleAddAddress}
                        disabled={loading}>
                        {loading ? "Adding..." : "Add new address"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

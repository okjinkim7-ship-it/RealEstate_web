"use client";

import DaumPostcodeEmbed from "react-daum-postcode";

interface AddressSearchProps {
    onComplete: (data: any) => void;
}

export default function AddressSearch({ onComplete }: AddressSearchProps) {
    const handleComplete = (data: any) => {
        let fullAddress = data.address;
        let extraAddress = "";

        if (data.addressType === "R") {
            if (data.bname !== "") {
                extraAddress += data.bname;
            }
            if (data.buildingName !== "") {
                extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
            }
            fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
        }

        onComplete({
            ...data,
            fullAddress,
        });
    };

    return (
        <div className="border border-gray-300 rounded-md overflow-hidden">
            <DaumPostcodeEmbed onComplete={handleComplete} style={{ height: "400px" }} />
        </div>
    );
}

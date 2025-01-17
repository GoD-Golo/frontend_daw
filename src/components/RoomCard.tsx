"use client";
import Image from "next/image";
import { Room } from "@/types/types";

type RoomCardProps = {
  id: number;
  floor: number;
  room_number: number;
  availability: "available" | "occupied";
  type: "premium" | "normal";
  breakfast: boolean;
  image: string;
  handleBookNow: (roomNumber: Room) => void; // Pass function to trigger booking modal
};

const RoomCard: React.FC<RoomCardProps> = ({
  id,
  floor,
  room_number,
  availability,
  type,
  breakfast,
  image,
  handleBookNow,
}) => {
  const room: Room = {
    id: id,
    floor: floor,
    room_number: room_number,
    availability: availability,
    type: type,
    breakfast: breakfast,
    image: image,
  };

  return (
    <div className="border rounded-lg shadow p-4 bg-white">
      <Image
        width={400}
        height={200}
        src={image}
        alt={`Room ${room_number}`}
        className="w-full h-40 object-cover rounded mb-4"
      />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        Room {room_number}
      </h3>
      <ul className="text-gray-600 space-y-1">
        <li>
          <strong>Floor:</strong> {floor}
        </li>
        <li>
          <strong>Type:</strong> {type.charAt(0).toUpperCase() + type.slice(1)}
        </li>
        <li>
          <strong>Availability:</strong>{" "}
          <span
            className={`${
              availability === "available" ? "text-green-600" : "text-red-600"
            } font-medium`}
          >
            {availability.charAt(0).toUpperCase() + availability.slice(1)}
          </span>
        </li>
        <li className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={`breakfast-${room_number}`}
            checked={breakfast}
            readOnly
            className="form-checkbox text-blue-600"
          />
          <label htmlFor={`breakfast-${room_number}`} className="text-sm">
            Breakfast Included
          </label>
        </li>
      </ul>
      {availability === "available" && (
        <button
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
          onClick={() => handleBookNow(room)} // Trigger the modal
        >
          Book Now
        </button>
      )}
    </div>
  );
};

export default RoomCard;

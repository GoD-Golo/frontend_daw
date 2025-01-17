"use client";

import { useState, useEffect } from "react";

import type { Room } from "@/types/types";

import Filter from "@/components/Filter";
import RoomCard from "@/components/RoomCard";
import NavBar from "@/components/NavBar";

const RoomsPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [filter, setFilter] = useState({
    floor: "",
    availability: "",
    type: "",
    breakfast: "",
  });
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [newBooking, setNewBooking] = useState({
    user_id: "", // Replace this with the logged-in user's ID
    room_id: "",
    check_in: "",
    check_out: "",
  });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("/api/rooms.php"); // Replace with your API URL
        if (!response.ok) {
          throw new Error("Failed to fetch rooms");
        }
        const data = await response.json();
        if (data.success && Array.isArray(data.rooms)) {
          setRooms(data.rooms);
          setFilteredRooms(data.rooms);
        }
        //eslint-disable-next-line
      } catch (error: any) {
        console.error("Error fetching rooms:", error.message);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      const filtered = rooms.filter((room) => {
        return (
          (filter.floor === "" || room.floor === Number(filter.floor)) &&
          (filter.availability === "" ||
            room.availability === filter.availability) &&
          (filter.type === "" || room.type === filter.type) &&
          (filter.breakfast === "" ||
            room.breakfast === (filter.breakfast === "true"))
        );
      });
      setFilteredRooms(filtered);
    };

    applyFilters();
  }, [filter, rooms]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const handleBookNow = (room: Room) => {
    setSelectedRoom(room);
    setNewBooking({
      ...newBooking,
      room_id: room.id.toString(),
    });
    setBookingModalOpen(true);
  };

  const handleAddBooking = async () => {
    try {
      const response = await fetch("/api/bookings.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          user_id: newBooking.user_id,
          room_id: newBooking.room_id,
          check_in: newBooking.check_in,
          check_out: newBooking.check_out,
        }),
      });
      const result = await response.json();

      if (result.success) {
        alert("Booking added successfully!");
        setBookingModalOpen(false);
        setSelectedRoom(null);
        setNewBooking({
          user_id: "",
          room_id: "",
          check_in: "",
          check_out: "",
        });
      } else {
        alert("Failed to add booking: " + result.message);
      }
    } catch (error) {
      console.error("Error adding booking:", error);
      alert("An error occurred while adding the booking.");
    }
  };

  return (
    <>
      <NavBar />
      <div className="p-8 bg-gray-100 min-h-screen">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Rooms
        </h2>

        {/* Filter Section */}
        <div className="bg-white shadow p-4 rounded-lg mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Filter Rooms
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Filter
              id="floor"
              name="floor"
              label="Floor"
              options={[
                { label: "All", value: "" },
                ...[...new Set(rooms.map((room) => room.floor))].map(
                  (floor) => ({
                    label: floor.toString(),
                    value: floor.toString(),
                  })
                ),
              ]}
              value={filter.floor}
              onChange={handleFilterChange}
            />
            <Filter
              id="availability"
              name="availability"
              label="Availability"
              options={[
                { label: "All", value: "" },
                { label: "Available", value: "available" },
                { label: "Occupied", value: "occupied" },
              ]}
              value={filter.availability}
              onChange={handleFilterChange}
            />
            <Filter
              id="type"
              name="type"
              label="Type"
              options={[
                { label: "All", value: "" },
                { label: "Normal", value: "normal" },
                { label: "Premium", value: "premium" },
              ]}
              value={filter.type}
              onChange={handleFilterChange}
            />
            <Filter
              id="breakfast"
              name="breakfast"
              label="Breakfast"
              options={[
                { label: "All", value: "" },
                { label: "Yes", value: "true" },
                { label: "No", value: "false" },
              ]}
              value={filter.breakfast}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        {/* Room List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room, index) => (
            <RoomCard key={index} {...room} handleBookNow={handleBookNow} />
          ))}
          {filteredRooms.length === 0 && (
            <p className="text-center text-gray-600 col-span-full">
              No rooms match the selected filters.
            </p>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {bookingModalOpen && selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded shadow-lg w-full max-w-lg">
            <h3 className="text-lg font-bold mb-4">
              Booking Room {selectedRoom.room_number}
            </h3>
            <input
              type="text"
              placeholder="User ID"
              value={newBooking.user_id}
              onChange={(e) =>
                setNewBooking({ ...newBooking, user_id: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
            />
            <input
              type="date"
              placeholder="Check-In Date"
              value={newBooking.check_in}
              onChange={(e) =>
                setNewBooking({ ...newBooking, check_in: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
            />
            <input
              type="date"
              placeholder="Check-Out Date"
              value={newBooking.check_out}
              onChange={(e) =>
                setNewBooking({ ...newBooking, check_out: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleAddBooking}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Confirm Booking
              </button>
              <button
                onClick={() => setBookingModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RoomsPage;

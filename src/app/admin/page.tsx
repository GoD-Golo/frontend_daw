"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NavBar from "../../components/NavBar";

type Room = {
  id: number;
  room_number: string;
  type: string;
  price: number | string | typeof NaN;
  availability: string;
};

type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
};

type Booking = {
  id: number;
  user_id: string;
  room_id: string;
  start_date: string;
  end_date: string;
  status: string;
};

type Stats = {
  totalRooms: number;
  totalUsers: number;
  totalBookings: number;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const fetchRooms = async (): Promise<Room[]> => {
  const response = await fetch(`${apiBaseUrl}/rooms.php`, {
    method: "GET",
    credentials: "include",
  });
  const result = await response.json();
  return result.rooms || [];
};

const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch(`${apiBaseUrl}/users.php?get_users=true`, {
    method: "GET",

    credentials: "include",
  });
  const result = await response.json();
  return result.users || [];
};

const fetchBookings = async (): Promise<Booking[]> => {
  const response = await fetch(`${apiBaseUrl}/bookings.php`, {
    method: "GET",
    credentials: "include",
  });
  const result = await response.json();
  return result.bookings || [];
};

const fetchStats = async (): Promise<Stats> => {
  // Replace with backend stats endpoint if available
  return {
    totalRooms: 50,
    totalUsers: 200,
    totalBookings: 120,
  };
};

export default function AdminDashboard() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalRooms: 0,
    totalUsers: 0,
    totalBookings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>("rooms");
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [newRoom, setNewRoom] = useState<Partial<Room>>({
    room_number: "",
    type: "",
    price: 0,
    availability: "Available",
  });
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: "",
    email: "",
    role: "",
    password: "",
  });
  const [newBooking, setNewBooking] = useState<Partial<Booking>>({
    user_id: "",
    room_id: "",
    start_date: "",
    end_date: "",
    status: "",
  });

  const checkAdminAccess = async (): Promise<void> => {
    const response = await fetch(`${apiBaseUrl}/admin.php`, {
      credentials: "include",
    });
    const result = await response.json();
    if (result.success !== true) {
      alert("Access denied");
      router.push("/");
    }
  };

  const loadDashboard = async (): Promise<void> => {
    try {
      await checkAdminAccess();
      const [fetchedRooms, fetchedUsers, fetchedBookings, fetchedStats] =
        await Promise.all([
          fetchRooms(),
          fetchUsers(),
          fetchBookings(),
          fetchStats(),
        ]);
      setRooms(fetchedRooms);
      setUsers(fetchedUsers);
      setBookings(fetchedBookings);
      setStats(fetchedStats);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleAddRoom = async (): Promise<void> => {
    // console.log("Adding room:", newRoom);
    try {
      const response = await fetch(`${apiBaseUrl}/rooms.php`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          room_number: newRoom.room_number || "0",
          type: newRoom.type || "normal",
          price: newRoom.price?.toString() || "0",
          availability: newRoom.availability || "Available",
        }),
      });
      const result = await response.json();
      if (result.success) {
        alert("Room added successfully!");
        setNewRoom({
          room_number: "",
          type: "",
          price: 0,
          availability: "Available",
        });
        loadDashboard();
      } else {
        alert("Failed to add room: " + result.message);
      }
    } catch (error) {
      console.error("Error adding room:", error);
    }
  };

  const handleDeleteRoom = async (roomId: number): Promise<void> => {
    try {
      const response = await fetch(`${apiBaseUrl}/rooms.php`, {
        method: "DELETE",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ room_id: roomId.toString() }),
      });
      // console.log(roomId);
      const result = await response.json();
      if (result.success) {
        alert("Room deleted successfully!");
        loadDashboard(); // Refresh the rooms list
      } else {
        alert("Failed to delete room: " + result.message);
      }
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  const handleSaveRoom = async (): Promise<void> => {
    if (!editingRoom) return; // Ensure there's an active room being edited

    try {
      const response = await fetch(`${apiBaseUrl}/rooms.php`, {
        method: "PUT",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          room_id: editingRoom.id.toString(),
          type: editingRoom.type,
          price: editingRoom.price.toString(),
          availability: editingRoom.availability,
        }),
      });
      const result = await response.json();
      if (result.success) {
        alert("Room updated successfully!");
        setEditingRoom(null); // Close the editing form
        loadDashboard(); // Refresh the rooms list
      } else {
        alert("Failed to update room: " + result.message);
      }
    } catch (error) {
      console.error("Error updating room:", error);
    }
  };

  const handleAddUser = async (): Promise<void> => {
    try {
      const response = await fetch(`${apiBaseUrl}/users.php`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          name: newUser.name || "",
          email: newUser.email || "",
          password: newUser.password || "",
          role: newUser.role || "",
        }),
      });
      const result = await response.json();
      if (result.success) {
        alert("User added successfully!");
        setNewUser({ name: "", email: "", role: "" });
        loadDashboard();
      } else {
        alert("Failed to add user: " + result.message);
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleDeleteUser = async (userId: number): Promise<void> => {
    try {
      const response = await fetch(`${apiBaseUrl}/users.php`, {
        method: "DELETE",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ user_id: userId.toString() }),
      });
      const result = await response.json();
      if (result.success) {
        alert("User deleted successfully!");
        loadDashboard();
      } else {
        alert("Failed to delete user: " + result.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleSaveUser = async (): Promise<void> => {
    if (!editingUser) return;

    try {
      const response = await fetch(`${apiBaseUrl}/users.php`, {
        method: "PUT",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          user_id: editingUser.id.toString(),
          name: editingUser.name,
          email: editingUser.email,
          role: editingUser.role,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("User updated successfully!");
        setEditingUser(null);
        loadDashboard();
      } else {
        alert(`Failed to update user: ${result.message}`);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("An error occurred while updating the user.");
    }
  };

  const handleAddBooking = async (): Promise<void> => {
    try {
      const response = await fetch(`${apiBaseUrl}/bookings.php`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          user_id: newBooking.user_id?.toString() || "",
          room_id: newBooking.room_id || "",
          start_date: newBooking.start_date || "",
          end_date: newBooking.end_date || "",
          status: newBooking.status || "Confirmed",
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Booking added successfully!");
        setNewBooking({
          user_id: "",
          room_id: "",
          start_date: "",
          end_date: "",
          status: "",
        });
        loadDashboard(); // Refresh bookings list
      } else {
        alert("Failed to add booking: " + result.message);
      }
    } catch (error) {
      console.error("Error adding booking:", error);
      alert("An error occurred while adding the booking.");
    }
  };

  const handleSaveBooking = async (): Promise<void> => {
    if (!editingBooking) return;
    console.log(editingBooking);

    try {
      const response = await fetch(`${apiBaseUrl}/bookings.php`, {
        method: "PUT",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          booking_id: editingBooking.id.toString(),
          user_id: editingBooking.user_id.toString(),
          room_id: editingBooking.room_id,
          start_date: editingBooking.start_date,
          end_date: editingBooking.end_date,
          status: editingBooking.status,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Booking updated successfully!");
        setEditingBooking(null); // Close modal
        loadDashboard(); // Refresh bookings
      } else {
        alert("Failed to update booking: " + result.message);
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("An error occurred while updating the booking.");
    }
  };

  const handleDeleteBooking = async (bookingId: number): Promise<void> => {
    try {
      const response = await fetch(`${apiBaseUrl}/bookings.php`, {
        method: "DELETE",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ booking_id: bookingId.toString() }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Booking deleted successfully!");
        loadDashboard();
      } else {
        alert("Failed to delete booking: " + result.message);
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("An error occurred while deleting the booking.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <NavBar />
      <div className="bg-gray-100 min-h-screen">
        <div className="flex">
          <aside className="w-64 bg-gray-800 text-white min-h-screen">
            <div className="p-4 text-center font-bold text-lg">
              Admin Dashboard
            </div>
            <nav>
              <ul className="space-y-4 px-4">
                <li>
                  <button
                    onClick={() => setActiveSection("rooms")}
                    className="w-full text-left bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
                  >
                    Rooms
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection("users")}
                    className="w-full text-left bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
                  >
                    Users
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection("bookings")}
                    className="w-full text-left bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
                  >
                    Bookings
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => setActiveSection("stats")}
                    className="w-full text-left bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
                  >
                    Stats
                  </button>
                </li>
              </ul>
            </nav>
          </aside>

          <main className="flex-1 p-6 text-slate-800">
            {activeSection === "rooms" && (
              <section className="space-y-6">
                {editingRoom && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="p-6 bg-white rounded shadow-lg w-full max-w-lg">
                      <h3 className="text-lg font-bold mb-4">
                        Edit Room {editingRoom.room_number}
                      </h3>
                      <input
                        type="text"
                        value={editingRoom.type}
                        onChange={(e) =>
                          setEditingRoom({
                            ...editingRoom,
                            type: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
                        placeholder="Room Type"
                      />
                      <input
                        type="number"
                        value={editingRoom.price}
                        onChange={(e) =>
                          setEditingRoom({
                            ...editingRoom,
                            price: parseFloat(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
                        placeholder="Price"
                      />
                      <select
                        value={editingRoom.availability}
                        onChange={(e) =>
                          setEditingRoom({
                            ...editingRoom,
                            availability: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
                      >
                        <option value="Available">Available</option>
                        <option value="Occupied">Occupied</option>
                      </select>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={handleSaveRoom}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingRoom(null)}
                          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-4 bg-gray-100 rounded shadow space-y-4">
                  <h3 className="text-lg font-bold">Add New Room</h3>
                  <input
                    type="text"
                    placeholder="Room Number"
                    value={newRoom.room_number}
                    onChange={(e) =>
                      setNewRoom({ ...newRoom, room_number: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Room Type"
                    value={newRoom.type}
                    onChange={(e) =>
                      setNewRoom({ ...newRoom, type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={newRoom.price}
                    onChange={(e) =>
                      setNewRoom({
                        ...newRoom,
                        price: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                  <select
                    value={newRoom.availability}
                    onChange={(e) =>
                      setNewRoom({ ...newRoom, availability: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  >
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                  </select>
                  <button
                    onClick={handleAddRoom}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Add Room
                  </button>
                </div>
                <h2 className="text-2xl font-bold">Rooms</h2>
                <table className="w-full border-collapse border border-gray-300 text-left shadow-lg">
                  <thead>
                    <tr className="bg-gray-200 text-gray-700">
                      <th className="border border-gray-300 px-4 py-2">
                        Number
                      </th>
                      <th className="border border-gray-300 px-4 py-2">Type</th>
                      <th className="border border-gray-300 px-4 py-2">
                        Price
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Status
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map((room) => (
                      <tr key={room.id} className="hover:bg-gray-100">
                        <td className="border border-gray-300 px-4 py-2">
                          {room.room_number}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {room.type}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {room.price}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {room.availability}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 space-x-2">
                          <button
                            onClick={() => setEditingRoom(room)}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteRoom(room.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            {activeSection === "users" && (
              <section className="space-y-6">
                {editingUser && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="p-6 bg-white rounded shadow-lg w-full max-w-lg">
                      <h3 className="text-lg font-bold mb-4">
                        Edit User {editingUser.name}
                      </h3>
                      <input
                        type="text"
                        value={editingUser.name}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
                        placeholder="Name"
                      />
                      <input
                        type="email"
                        value={editingUser.email}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
                        placeholder="Email"
                      />
                      <input
                        type="text"
                        value={editingUser.role}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            role: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
                        placeholder="Role"
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={handleSaveUser}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingUser(null)}
                          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-4 bg-gray-100 rounded shadow space-y-4">
                  <h3 className="text-lg font-bold">Add New User</h3>
                  <input
                    type="text"
                    placeholder="Name"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                  <input
                    type="password"
                    placeholder="************"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Role"
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                  <button
                    onClick={handleAddUser}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Add User
                  </button>
                </div>

                <h2 className="text-2xl font-bold">Users</h2>
                <table className="w-full border-collapse border border-gray-300 text-left shadow-lg">
                  <thead>
                    <tr className="bg-gray-200 text-gray-700">
                      <th className="border border-gray-300 px-4 py-2">Name</th>
                      <th className="border border-gray-300 px-4 py-2">
                        Email
                      </th>
                      <th className="border border-gray-300 px-4 py-2">Role</th>
                      <th className="border border-gray-300 px-4 py-2">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-100">
                        <td className="border border-gray-300 px-4 py-2">
                          {user.name}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {user.email}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {user.role}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 space-x-2">
                          <button
                            onClick={() => setEditingUser(user)}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}
            {activeSection === "bookings" && (
              <section className="space-y-6">
                <h2 className="text-2xl font-bold">Bookings</h2>
                <div className="p-4 bg-gray-100 rounded shadow space-y-4">
                  <h3 className="text-lg font-bold">Add New Booking</h3>
                  <input
                    type="text"
                    placeholder="User ID"
                    value={newBooking.user_id}
                    onChange={(e) =>
                      setNewBooking({ ...newBooking, user_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Room ID"
                    value={newBooking.room_id}
                    onChange={(e) =>
                      setNewBooking({ ...newBooking, room_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                  <input
                    type="date"
                    placeholder="Start Date"
                    value={newBooking.start_date}
                    onChange={(e) =>
                      setNewBooking({
                        ...newBooking,
                        start_date: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                  <input
                    type="date"
                    placeholder="End Date"
                    value={newBooking.end_date}
                    onChange={(e) =>
                      setNewBooking({ ...newBooking, end_date: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                  <input
                    type="status"
                    placeholder="confirmed / cancelled"
                    value={newBooking.status}
                    onChange={(e) =>
                      setNewBooking({ ...newBooking, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                  <button
                    onClick={handleAddBooking}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Add Booking
                  </button>
                </div>

                <table className="w-full border-collapse border border-gray-300 text-left shadow-lg">
                  <thead>
                    <tr className="bg-gray-200 text-gray-700">
                      <th className="border border-gray-300 px-4 py-2">User</th>
                      <th className="border border-gray-300 px-4 py-2">
                        Room Number
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Check-In
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Check-Out
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Status
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-100">
                        <td className="border border-gray-300 px-4 py-2">
                          {booking.user_id}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {booking.room_id}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {booking.start_date}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {booking.end_date}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {booking.status}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 space-x-2">
                          <button
                            onClick={() => setEditingBooking(booking)}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBooking(booking.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {editingBooking && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="p-6 bg-white rounded shadow-lg w-full max-w-lg">
                      <h3 className="text-lg font-bold mb-4">
                        Edit Booking for User {editingBooking.user_id}
                      </h3>
                      <input
                        type="text"
                        value={editingBooking.user_id}
                        onChange={(e) =>
                          setEditingBooking({
                            ...editingBooking,
                            user_id: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
                        placeholder="User ID"
                      />
                      <input
                        type="text"
                        value={editingBooking.room_id}
                        onChange={(e) =>
                          setEditingBooking({
                            ...editingBooking,
                            room_id: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
                        placeholder="Room ID"
                      />
                      <input
                        type="date"
                        value={editingBooking.start_date}
                        onChange={(e) =>
                          setEditingBooking({
                            ...editingBooking,
                            start_date: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
                        placeholder="Start Date"
                      />
                      <input
                        type="date"
                        value={editingBooking.end_date}
                        onChange={(e) =>
                          setEditingBooking({
                            ...editingBooking,
                            end_date: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
                        placeholder="End Date"
                      />
                      <select
                        value={editingBooking.status}
                        onChange={(e) =>
                          setEditingBooking({
                            ...editingBooking,
                            status: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Pending">Pending</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={handleSaveBooking}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingBooking(null)}
                          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            )}

            {activeSection === "stats" && (
              <section>
                <h2>Statistics</h2>
                <div>
                  <p>Total Rooms: {stats.totalRooms}</p>
                  <p>Total Users: {stats.totalUsers}</p>
                  <p>Total Bookings: {stats.totalBookings}</p>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

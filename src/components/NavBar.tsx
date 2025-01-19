"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function NavBar() {
  interface User {
    name: string;
    role: string;
  }
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null); // Holds user information
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/check_access`, {
          method: "POST",
          credentials: "include", // cookies
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user); // `data.user` should contain user details like name and role
        } else {
          setUser(null); // User is not logged in or unauthorized
          // throw new Error("User not logged in");
          return;
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchUser();
  }, []);

  const handleSignOut = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/signout.php`, {
        method: "POST",
        credentials: "include", // cookies
      });

      if (response.ok) {
        setUser(null); // Clear user state
        // router.push("/rooms"); // Redirect to sign-in page
      } else {
        console.error("Failed to sign out.");
        alert("An error occurred during sign out. Please try again.");
      }
    } catch (error) {
      console.error("Error during sign out:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  if (loading) {
    // Optionally render a loading state
    return (
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Hotel DAW</h1>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Hotel DAW</h1>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link
                href={"/#about"}
                className="text-gray-600 hover:text-gray-800"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href={"/rooms"}
                className="text-gray-600 hover:text-gray-800"
              >
                Rooms
              </Link>
            </li>
            <li>
              <Link
                href={"/#contact"}
                className="text-gray-600 hover:text-gray-800"
              >
                Contact
              </Link>
            </li>
            {user ? (
              <>
                <li className="text-gray-600">Hello, {user.name}</li>
                {user.role === "admin" && (
                  <li>
                    <button
                      onClick={() => router.push("/admin")}
                      className="text-blue-600 hover:underline"
                    >
                      Admin Dashboard
                    </button>
                  </li>
                )}
                <li>
                  <button
                    onClick={handleSignOut}
                    className="text-red-600 hover:underline"
                  >
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={() => router.push("/auth/signin")}
                  className="text-blue-600 hover:underline"
                >
                  Sign In
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

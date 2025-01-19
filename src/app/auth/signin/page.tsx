"use client";
import { useState } from "react";
import Input from "../../../components/Input";
import { useRouter } from "next/navigation";
import NavBar from "../../../components/NavBar";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function SignIn() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiBaseUrl}/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // cookies
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Sign-in successful!");
        router.push("/rooms");
      } else {
        alert(result.message || "Invalid credentials.");
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      alert(`An unexpected error occurred. Please try again later. ${error}`);
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Sign In to Your Account
          </h2>
          <form onSubmit={handleSubmit}>
            <Input
              id="email"
              name="email"
              type="email"
              label="Email Address"
              placeholder="example@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
            >
              Sign In
            </button>
          </form>
          <p className="text-sm text-gray-600 text-center mt-4">
            Don&apos;t have an account?{" "}
            <a href="/auth/signup" className="text-blue-600 hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

import Link from "next/link";
import NavBar from "@/components/NavBar";

export default function Home() {
  return (
    <>
      <NavBar />
      <div className="bg-gray-100 min-h-screen">
        {/* Hero Section */}
        <section
          className="relative bg-cover bg-center"
          style={{ backgroundImage: "url('/hotel-hero.jpg')" }}
        >
          <div className="bg-black bg-opacity-50 min-h-[60vh] flex flex-col items-center justify-center text-center text-white px-4">
            <h2 className="text-4xl font-extrabold mb-4">
              Welcome to Hotel DAW
            </h2>
            <p className="text-lg mb-6">
              Efficiently manage rooms, bookings, and guest experiences with
              ease.
            </p>
            <Link
              href={"/rooms"}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold"
            >
              Explore Rooms
            </Link>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 bg-gray-100">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              About the Us
            </h2>
            <p className="text-gray-600 text-center max-w-3xl mx-auto">
              Our Hotel DAW is a modern hotel with a touch of elegance. We offer
              a pleasant stay with a variety of rooms to choose from. Our hotel
              is the best in town with affordable prices.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 bg-gray-100">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Contact Us
            </h2>
            <form className="max-w-lg mx-auto">
              <div className="mb-4">
                <label className="block text-gray-600 mb-2" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Your Name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Your Email"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-2" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Your Message"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
              >
                Send Message
              </button>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-6">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p>
              &copy; {new Date().getFullYear()} Hotel DAW. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

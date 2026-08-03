import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  const services = [
    {
      title: "Premium Hotel Booking",
      desc: "Find luxury hotels, comfortable stays and budget friendly rooms with a seamless booking experience.",
      icon: "🏨",
    },
    {
      title: "Smart Ride Services",
      desc: "Travel anywhere easily with reliable rides and convenient transportation solutions.",
      icon: "🚗",
    },
    {
      title: "Emergency SOS Assistance",
      desc: "Your safety is our priority with instant emergency support whenever required.",
      icon: "🚑",
    },
    {
      title: "AI Travel Assistant",
      desc: "Get smart recommendations, travel plans and personalized guidance using AI.",
      icon: "🤖",
    },
  ];

  const stats = [
    {
      number: "10K+",
      text: "Happy Travelers",
    },
    {
      number: "500+",
      text: "Premium Hotels",
    },
    {
      number: "24/7",
      text: "Travel Support",
    },
    {
      number: "100%",
      text: "Secure Booking",
    },
  ];

  const features = [
    "Safe and Secure Travel Experience",
    "Easy Hotel & Ride Booking",
    "24/7 Emergency Assistance",
    "Smart Technology Integration",
    "AI Based Travel Suggestions",
  ];

  return (
    <div className="pt-24">
      {/* HERO */}

      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <img
          src={assets.heroImage}
          alt="travel"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div
          className="
absolute inset-0 
bg-gradient-to-r 
from-black/80 
via-teal-900/70 
to-black/40
"
        ></div>

        <div className="relative text-center text-white max-w-5xl px-6">
          <h1
            className="
text-5xl 
md:text-7xl 
font-playfair 
font-bold
leading-tight
"
          >
            Explore The World With
            <span className="text-yellow-400"> Travixy</span>
          </h1>

          <p
            className="
mt-8 
text-xl 
text-gray-200
"
          >
            Your complete travel companion for hotels, rides, safety and smart
            journeys.
          </p>

          <button
            onClick={() => (window.location.href = "/")}
            className="
mt-8
px-8
py-3
bg-yellow-400
text-black
rounded-full
font-semibold
hover:bg-yellow-300
transition
"
          >
            Start Your Journey
          </button>
        </div>
      </section>

      {/* STATS */}

      <section
        className="
relative
-mt-16
px-6
md:px-20
"
      >
        <div
          className="
bg-white
rounded-3xl
shadow-2xl
grid
grid-cols-2
md:grid-cols-4
gap-6
p-8
"
        >
          {stats.map((item, index) => (
            <div key={index} className="text-center">
              <h2
                className="
text-4xl
font-bold
text-teal-700
"
              >
                {item.number}
              </h2>

              <p className="text-gray-500 mt-2">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}

      <section
        className="
py-24
px-6
md:px-20
text-center
"
      >
        <h2
          className="
text-4xl
md:text-5xl
font-playfair
text-teal-900
"
        >
          Who We Are
        </h2>

        <div
          className="
w-24
h-1
bg-yellow-400
mx-auto
mt-5
"
        ></div>

        <p
          className="
max-w-4xl
mx-auto
mt-8
text-gray-600
text-lg
leading-8
"
        >
          Travixy is a modern travel platform designed to make every journey
          easier, safer and memorable. From hotel booking to emergency support,
          we connect every travel requirement in one powerful platform.
        </p>
      </section>

      {/* SERVICES */}

      <section
        className="
bg-gray-50
py-24
px-6
md:px-20
"
      >
        <h2
          className="
text-center
text-5xl
font-playfair
text-teal-900
"
        >
          Our Services
        </h2>

        <div
          className="
grid
md:grid-cols-2
lg:grid-cols-4
gap-8
mt-14
"
        >
          {services.map((item, index) => (
            <div
              key={index}
              className="
bg-white
rounded-3xl
p-8
shadow-lg
hover:shadow-2xl
hover:-translate-y-3
transition-all
duration-300
border
border-gray-100
"
            >
              <div className="text-6xl">{item.icon}</div>

              <h3
                className="
mt-6
text-xl
font-bold
text-teal-800
"
              >
                {item.title}
              </h3>

              <p
                className="
mt-4
text-gray-500
leading-7
"
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}

      <section
        className="
py-24
px-6
md:px-20
bg-gradient-to-br
from-teal-50
via-white
to-emerald-50
"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h2
              className="
text-4xl
md:text-5xl
font-playfair
text-teal-900
font-bold
"
            >
              Why Choose Travixy?
            </h2>

            <div
              className="
w-24
h-1
bg-yellow-400
mx-auto
mt-5
rounded-full
"
            ></div>

            <p
              className="
mt-6
max-w-3xl
mx-auto
text-gray-600
text-lg
leading-8
"
            >
              We combine travel, technology and safety to provide a complete
              travel experience. From booking hotels to emergency support,
              Travixy makes every journey simple and secure.
            </p>
          </div>

          <div
            className="
grid
md:grid-cols-2
lg:grid-cols-3
gap-8
mt-14
"
          >
            <div
              className="
bg-white
rounded-3xl
p-8
shadow-lg
hover:shadow-2xl
transition
hover:-translate-y-2
"
            >
              <div
                className="
text-4xl
bg-teal-100
w-16
h-16
rounded-2xl
flex
items-center
justify-center
"
              >
                🔒
              </div>

              <h3
                className="
text-xl
font-bold
text-teal-800
mt-6
"
              >
                Safe & Secure
              </h3>

              <p
                className="
text-gray-500
mt-3
leading-7
"
              >
                Your safety is our priority with secure bookings and emergency
                assistance.
              </p>
            </div>

            <div
              className="
bg-white
rounded-3xl
p-8
shadow-lg
hover:shadow-2xl
transition
hover:-translate-y-2
"
            >
              <div
                className="
text-4xl
bg-yellow-100
w-16
h-16
rounded-2xl
flex
items-center
justify-center
"
              >
                ⚡
              </div>

              <h3
                className="
text-xl
font-bold
text-teal-800
mt-6
"
              >
                Fast & Easy Booking
              </h3>

              <p
                className="
text-gray-500
mt-3
leading-7
"
              >
                Book hotels and rides quickly with a smooth user experience.
              </p>
            </div>

            <div
              className="
bg-white
rounded-3xl
p-8
shadow-lg
hover:shadow-2xl
transition
hover:-translate-y-2
"
            >
              <div
                className="
text-4xl
bg-blue-100
w-16
h-16
rounded-2xl
flex
items-center
justify-center
"
              >
                🌍
              </div>

              <h3
                className="
text-xl
font-bold
text-teal-800
mt-6
"
              >
                Complete Travel Solutions
              </h3>

              <p
                className="
text-gray-500
mt-3
leading-7
"
              >
                Hotels, rides, emergency support and travel services available
                at one place for a hassle-free journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}

      <section
        className="
py-24
bg-gradient-to-r
from-teal-700
to-emerald-600
text-white
text-center
px-6
"
      >
        <h2
          className="
text-5xl
font-playfair
"
        >
          Ready For Your Next Adventure?
        </h2>

        <p
          className="
mt-6
text-lg
text-gray-200
max-w-3xl
mx-auto
"
        >
          With Travixy, every journey becomes safer, smarter and unforgettable.
        </p>

        <button
          className="
mt-8
bg-yellow-400
text-black
px-10
py-3
rounded-full
font-semibold
hover:bg-yellow-300
"
        >
          Book Your Journey
        </button>
      </section>
    </div>
  );
};

export default About;

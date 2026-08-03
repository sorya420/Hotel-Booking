import React from "react";
import Hero from "../components/Hero";

import FeaturedDestination from "../components/FeaturedDestination";
import ExclusiveOffer from "../components/ExclusiveOffer";
import Testimonial from "../components/Testimonial";
import NewsLetter from "../components/NewsLetter";
import RecommendedHotel from "../components/RecomendedHotel";

const Home = () => {
  return (
    <>
      <Hero />
      <RecommendedHotel />
      <FeaturedDestination />
      <ExclusiveOffer />
      <Testimonial />
      <NewsLetter />
    </>
  );
};

export default Home;

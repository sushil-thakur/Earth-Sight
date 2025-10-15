import React from "react";
import { IoEarthOutline } from "react-icons/io5";
import {
  FaBuilding,
  FaChevronLeft,
  FaChevronRight,
  FaFigma,
  FaNodeJs,
  FaPython,
  FaReact,
} from "react-icons/fa";
import { SiFramer } from "react-icons/si";
import { BsBarChartFill } from "react-icons/bs";
import { RiTailwindCssFill } from "react-icons/ri";
import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Members } from "../constants";
import Footer from "../components/Footer";

const About = () => {
  const WhatWeDO = [
    {
      icon: <IoEarthOutline size={24} />,
      title: "Environmental Monitoring",
      des: "We analyze satellite imagery to track deforestation, land degradation, and urban expansion, enabling early detection of environmental risks.",
    },
    {
      icon: <BsBarChartFill size={24} />,
      title: "Data Driven Insights",
      des: "Our interactive dashboards translate complex datasets into clear visual insights, supporting researchers, policymakers, and investors in their decision-making processes.",
    },
    {
      icon: <FaBuilding size={24} />,
      title: "Real State",
      des: "We leverage AI to forecast property trends, integrating environmental and socio-economic factors to help investors make informed decisions.",
    },
  ];
  const Technology = [
    { icon: <FaReact className="text-blue-300" />, name: "React" },
    {
      icon: <RiTailwindCssFill className="text-blue-400" />,
      name: "Tailwind Css",
    },
    { name: "XGBoost" },
    { icon: <FaPython />, name: "Python" },
    { name: "Google Earth Engine(GEE)" },
    { icon: <FaNodeJs />, name: "Node Js" },
    { icon: <SiFramer className="text-white" />, name: "Framer Motion" },
    { name: "Green Sock Animation(GSAP)" },
    { icon: <FaFigma />, name: "Figma" },
  ];
  const repeatedTech = [...Technology, ...Technology];

  return (
    <div className="text-emerald-400">
      <div className="h-[600px] w-full relative">
        <video
          src="/videos/hero-1.mp4"
          loop
          playsInline
          autoPlay
          muted
          className="h-full w-full rounded-xl object-cover"
        />
        <div className="absolute inset-0 bg-black/50">
          <div className="flex flex-col items-center justify-center h-full w-full text-white space-y-3">
            <h1 className="text-4xl md:text-6xl font-bold font-zentry text-center">
              Turning Satellite Data Into
              <br /> Actionable Insights
            </h1>
            <p className="text-sm md:text-base text-center">
              We combine satellite imagery and AI-powered analytics
              <br className="md:hidden inline" /> to monitor{" "}
              <br className="hidden md:inline" />
              environmental changes and predict real
              <br className="md:hidden inline" /> estate trends,
              <br className="hidden md:inline" /> enabling smarter decisions for
              a
              <br className="md:hidden inline" />
              sustainable future.
            </p>
          </div>
        </div>
      </div>
      <div className="px-8 py-6 md:py-8">
        <div className="flex flex-col py-6">
          {/* Mission */}
          <div className="bg-white border border=[#1e1b4b] rounded-3xl p-12 shadow-sm">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              Our Mission
            </h2>
            <p className="text-base md:text-xl text-black leading-relaxed text-center">
              To empower researchers, policymakers, and investors with reliable,
              actionable insights derived from satellite imagery. By bridging
              environmental monitoring and real estate prediction, we strive to
              support sustainable development and informed decision-making.
            </p>
          </div>
          {/* Mission */}

          {/* What We Do */}
          <div className="py-14">
            <div className="text-center pb-10">
              <h2 className="text-2xl md:text-4xl font-bold mb-4">
                What We Do?
              </h2>
              <p className="text-lg text-black">
                Comprehensive solutions for environmental and real estate
                intelligence
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {WhatWeDO.map((weDo, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: 50, scale: 1 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    ease: "easeInOut",
                  }}
                  whileHover={{
                    scale: 1.03,
                    transition: { ease: "easeOut" },
                  }}
                  viewport={{ once: true }}
                  key={idx}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-8 shadow-lg hover:shadow-xl"
                >
                  <div className="flex gap-3 items-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 text-black">
                      {weDo.icon}
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-black">
                      {weDo.title}
                    </h3>
                  </div>
                  <p className="text-black leading-relaxed text-lg">
                    {weDo.des}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
          {/* What we do? */}

          {/* Technology */}
          <section className="flex flex-col space-y-4">
            <h2 className="text-center text-2xl md:text-4xl font-bold mb-4">
              Technology Stack Used?
            </h2>
            <Marquee speed={50}>
              <div className="flex items-center gap-5 pr-5">
                {repeatedTech.map((tech, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xl font-circular-web font-light text-black"
                  >
                    <div>{tech.icon}</div>
                    {tech.name}
                  </div>
                ))}
              </div>
            </Marquee>
          </section>
          {/* Technology */}
        </div>

        {/* Team and expertise */}
        <section className="py-8 md:py-10">
          <h2 className="text-center text-2xl md:text-4xl font-bold mb-4">
            Team Members
          </h2>
          <div className="relative px-9 md:px-36 pt-5">
            <button className="custom-prev absolute left-0 md:left-10 top-1/2 -translate-y-1/2 z-10 text-base md:text-2xl text-white bg-blue-300/50 rounded-full p-2">
              <FaChevronLeft />
            </button>
            <button className="custom-next absolute right-0 md:right-10 top-1/2 -translate-y-1/2 z-10 text-base md:text-2xl text-white bg-blue-300/50 rounded-full p-2">
              <FaChevronRight />
            </button>
            <Swiper
              modules={[Navigation]}
              spaceBetween={10}
              navigation={{ nextEl: ".custom-next", prevEl: ".custom-prev" }}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  spaceBetween: 10,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 10,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 10,
                },
              }}
            >
              {Members.map((member, idx) => (
                <SwiperSlide key={idx}>
                  <div className="h-[350px] w-full bg-white flex flex-col items-center justify-center gap-3 rounded-xl border border-[#1e1b4b]">
                    <img
                      src={member.img}
                      alt="No Member Image"
                      className="h-[250px] w-[250px] rounded-full  object-cover"
                    />
                    <div className="flex flex-col items-center gap-1">
                      <h2 className="text-lg font-bold">{member.name}</h2>
                      <h3 className="text-base font-semibold">{member.role}</h3>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
        {/* Team and expertise */}
      </div>
      <Footer />
    </div>
  );
};

export default About;

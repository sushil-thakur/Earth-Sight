import React from "react";

const About = () => {
  return (
    <div className="px-8 py-8">
      <div className="flex items-center w-full">
        <div className=" space-y-4 w-[40%]">
          <section></section>
          {/* Intro */}
          <section className="space-y-3">
            <h1 className="text-2xl font-semibold">
              Turning Satellite Data into Actionable Insights
            </h1>
            <h2>
              We combine satellite imagery and AI-powered analytics to monitor
              <br />
              environmental changes and predict real estate trends, enabling
              smarter
              <br />
              decisions for a sustainable future.
            </h2>
          </section>
          {/* Intro */}

          {/* Mission */}
          <section className="space-y-1">
            <h1 className="text-2xl font-semibold">Our Mission</h1>
            <p>
              To empower researchers, policymakers, and investors with reliable,
              <br />
              actionable insights derived from satellite imagery. By bridging
              <br />
              environmental monitoring and real estate prediction, we strive to
              <br />
              support sustainable development and informed decision-making.
            </p>
          </section>
          {/* Mission */}

          {/* What we do? */}
          <section className="space-y-2">
            <h1 className="text-2xl font-semibold">What do we do?</h1>
            <ul className="list-disc space-y-1">
              <li>
                <strong>Environmental Monitoring</strong>
                <p>
                  We analyze satellite imagery to track deforestation, land
                  degradation,
                  <br /> and urban expansion, enabling early detection of
                  environmental risks.
                </p>
              </li>
              <li>
                <strong>Real Estate Prediction</strong>
                <p>
                  We leverage AI to forecast property trends, integrating
                  environmental
                  <br /> and socio-economic factors to help investors make
                  informed decisions.
                </p>
              </li>
              <li>
                <strong>Data-Driven Insights</strong>
                <p>
                  Our interactive dashboards translate complex datasets into
                  clear visual
                  <br /> insights, supporting researchers, policymakers, and
                  investors in their
                  <br /> decision-making processes.
                </p>
              </li>
            </ul>
          </section>
          {/* What we do? */}
        </div>
        <div className="h-[550px] w-[60%] bg-white rounded-xl">
          <iframe
            width="560"
            height="315"
            className="h-full w-full rounded-xl"
            src="https://www.youtube.com/embed/ztVV54sPOns?si=YLh5ClkrnoNXVeUr"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Technology */}
      <section></section>
      {/* Technology */}

      {/* Team and expertise */}
      <section></section>
      {/* Team and expertise */}

      {/* Call to action */}
      <section></section>
      {/* Call to action */}
    </div>
  );
};

export default About;

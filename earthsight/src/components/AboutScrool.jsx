import React from 'react'
import ScrollStack, { ScrollStackItem } from './ScrollStack'

const AboutScrool = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-b from-black via-slate-900 to-black py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
            About <span className="text-emerald-400">Earth Sight</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Transforming satellite imagery into actionable environmental insights
          </p>
        </div>

        <ScrollStack
          itemDistance={120}
          itemScale={0.05}
          itemStackDistance={40}
          stackPosition="30%"
          useWindowScroll={true}
        >
          <ScrollStackItem itemClassName="bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 backdrop-blur-lg">
            <div className="flex flex-col h-full justify-center">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white">Our Mission</h3>
              </div>
              <p className="text-lg text-slate-200 leading-relaxed">
                We leverage cutting-edge satellite imagery and AI technology to monitor environmental changes in real-time. 
                Our platform empowers governments, NGOs, and communities to make data-driven decisions for a sustainable future.
              </p>
            </div>
          </ScrollStackItem>

          <ScrollStackItem itemClassName="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 backdrop-blur-lg">
            <div className="flex flex-col h-full justify-center">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white">Environmental Monitoring</h3>
              </div>
              <p className="text-lg text-slate-200 leading-relaxed">
                Track deforestation, land degradation, urban expansion, and climate change impacts with precision. 
                Our advanced analytics provide early detection of environmental risks, enabling proactive intervention.
              </p>
            </div>
          </ScrollStackItem>

          <ScrollStackItem itemClassName="bg-gradient-to-br from-violet-500/20 to-pink-500/20 border border-violet-500/30 backdrop-blur-lg">
            <div className="flex flex-col h-full justify-center">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white">Real Estate Insights</h3>
              </div>
              <p className="text-lg text-slate-200 leading-relaxed">
                Combine environmental data with socio-economic factors to forecast property trends and market dynamics. 
                Our AI-powered predictions help investors and developers make informed decisions with confidence.
              </p>
            </div>
          </ScrollStackItem>

          <ScrollStackItem itemClassName="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 backdrop-blur-lg">
            <div className="flex flex-col h-full justify-center">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white">Impact & Vision</h3>
              </div>
              <p className="text-lg text-slate-200 leading-relaxed">
                Join us in protecting our planet's ecosystems and building sustainable communities. 
                Together, we can create a future where technology and nature work in harmony for generations to come.
              </p>
            </div>
          </ScrollStackItem>
        </ScrollStack>

        <div className="scroll-stack-end h-20"></div>
      </div>
    </section>
  )
}

export default AboutScrool
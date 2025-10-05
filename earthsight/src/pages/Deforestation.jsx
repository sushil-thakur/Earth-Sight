import React from 'react'

const Deforestation = () => {
  return (
    <section className="min-h-screen w-screen p-8">
      <h1 className="text-4xl font-bold mb-4">Deforestation</h1>
      <p className="mb-6 max-w-3xl">This page will present deforestation insights, maps, and analytics. You can populate it with your existing environmental components or widgets.</p>

      {/* Placeholder: embed any map or cards here */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg bg-white/10 p-6">Map or widget placeholder</div>
        <div className="rounded-lg bg-white/10 p-6">Statistics or chart placeholder</div>
      </div>
    </section>
  )
}

export default Deforestation

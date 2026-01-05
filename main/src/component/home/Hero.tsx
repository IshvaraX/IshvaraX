const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 pt-20">
      <div className="w-full max-w-5xl mx-auto">
        
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-black dark:text-white mb-4">
            IshvaraX
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Decoding human consciousness through Brain-Computer Interfaces and Predictive AI.
          </p>
        </div>

        <hr className="border-gray-300 dark:border-zinc-700 mb-12" />

        {/* 3-Column Grid like Google Play */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          
          {/* Column 1: Research */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-black dark:text-white">
              Research
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Advanced neuroscience and AI research focused on brain-computer interfaces and neural pattern analysis.
            </p>
            <div>
              <span className="inline-block px-3 py-1 text-sm font-medium bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 rounded">
                Neural Synthesis AI
              </span>
            </div>
          </div>

          {/* Column 2: Technology */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-black dark:text-white">
              Technology
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Developing PINAKA platform for brainwave prediction and neural activity analysis using AI models.
            </p>
            <div>
              <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded">
                PINAKA Platform
              </span>
            </div>
          </div>

          {/* Column 3: Impact */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-black dark:text-white">
              Impact
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Ethical AI development and public service initiatives through Jan-Seva for accessible technology.
            </p>
            <div>
              <span className="inline-block px-3 py-1 text-sm font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 rounded">
                Jan-Seva AI
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default Hero
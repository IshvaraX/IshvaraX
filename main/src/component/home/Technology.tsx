
const Technology = () => {
  return (
    <section id="technology" className="px-8 py-24 bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl space-y-12">
        <h2 className="text-2xl font-medium text-black dark:text-white">
          Core Technology
        </h2>

        <div>
          <h3 className="text-lg font-medium">Neural Synthesis AI</h3>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Training AI systems on EEG data to map brainwave patterns to intent
            and action.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium">Colony Pattern Analytics</h3>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Modeling collective human behavior to predict movement, resource
            demand, and societal trends.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Technology

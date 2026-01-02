
const Footer = () => {
  return (
    <footer className="px-8 py-12 border-t border-black/10 dark:border-white/10">
      <div className="mx-auto max-w-4xl text-sm text-zinc-500">
        © {new Date().getFullYear()} IshvaraX · Proprietary Technology
      </div>
    </footer>
  )
}

export default Footer

'use client'

import Image from 'next/image'
import { SiGithub } from 'react-icons/si'

const founders = [
  {
    name: 'Vivek Thakur',
    designation: 'CEO & AI Leader',
    image: '/founder1.jpeg',
    github: 'https://github.com/vivek09thakur'
  },
  {
    name: 'Nandini Thakur',
    designation: 'VP & Lead',
    image: '/founder1.jpeg',
    github: 'https://github.com/vivek09thakur'
  },
  {
    name: 'Mayank Sinha',
    designation: 'Business Lead & Co-Founder',
    image: '/founder2.jpeg',
    github: 'https://github.com/Mayanksinha12'
  },
  {
    name: 'Abhishek Prasad Verma',
    designation: 'Design & Development',
    image: '/founder3.jpeg',
    github: 'https://github.com/avi-verma01'
  },
  {
    name: 'Suraj Kumar Gupta',
    designation: 'Product & Research',
    image: '/founder4.jpeg',
    github: 'https://github.com/spature'
  }
]

const FounderCard = ({
  name,
  designation,
  image,
  github,
}: (typeof founders)[0]) => (
  <div className="group text-center">
    <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-[var(--surface)]">
      <Image
        src={image}
        alt={name}
        fill
        sizes="96px"
        className="object-cover"
      />
    </div>

    <h3 className="text-[0.95rem] font-medium mb-1 text-[var(--foreground)]">
      {name}
    </h3>
    <p className="gdm-body text-[0.8rem] mb-3">
      {designation}
    </p>

    <a
      href={github}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center w-8 h-8 rounded-full text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors"
      aria-label={`${name} on GitHub`}
    >
      <SiGithub size={16} />
    </a>
  </div>
)

export default function Founders() {
  return (
    <section
      id="founders"
      className="w-full py-16 md:py-24 px-4 border-t border-[var(--border)]"
    >
      <div className="max-w-6xl mx-auto mb-12 text-center">
        <span className="gdm-eyebrow block mb-3">Our team</span>
        <h2 className="gdm-heading-xl text-2xl md:text-4xl">Founders</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 max-w-4xl mx-auto">
        {founders.map((founder) => (
          <FounderCard key={founder.name} {...founder} />
        ))}
      </div>
    </section>
  )
}
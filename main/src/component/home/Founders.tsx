'use client'

import Image from 'next/image'
import { SiGithub } from 'react-icons/si'

const founders = [
  {
    name: 'Vivek Thakur',
    designation: 'CEO & AI Leader',
    image: '/IshvaraX/founder1.jpeg', // Remove /IshvaraX prefix
    github: 'https://github.com/vivek09thakur'
  },
  {
    name: 'Mayank Sinha',
    designation: 'Business Lead & Co-Founder',
    image: '/IshvaraX/founder2.jpeg',
    github: 'https://github.com/Mayanksinha12'
  },
  {
    name: 'Abhishek Prasad Verma',
    designation: 'Design & Development',
    image: '/IshvaraX/founder3.jpeg',
    github: 'https://github.com/avi-verma01'
  },
  {
    name: 'Suraj Kumar Gupta',
    designation: 'Product & Research',
    image: '/IshvaraX/founder4.jpeg',
    github: 'https://github.com/spature'
  }
]

export default function Founders() {
  return (
    <section className="w-full py-16">
      <h2 className="text-3xl font-semibold text-center mb-12">
        Meet Our Founders
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-4">
        {founders.map((f) => (
          <div
            key={f.name}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 text-center hover:scale-[1.02] transition"
          >
            <div className="relative w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden">
              <Image
                src={f.image}
                alt={f.name}
                fill
                className="object-cover"
                unoptimized // Required for static export
              />
            </div>

            <h3 className="text-lg font-medium">{f.name}</h3>
            <p className="text-sm opacity-70 mb-3">{f.designation}</p>

            <a
              href={f.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm opacity-80 hover:opacity-100"
            >
              <SiGithub size={18} />
              GitHub
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}
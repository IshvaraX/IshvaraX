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
    name: 'Nandini Thakur',
    designation: 'VP & Lead',
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

const FounderCard = ({ name, designation, image, github }: typeof founders[0]) => (
  <div className="border-2 border-zinc-900 dark:border-white p-4 text-center">
    <div className="relative w-20 h-20 mx-auto mb-4 border-2 border-zinc-900 dark:border-white overflow-hidden">
      <Image
        src={image}
        alt={name}
        fill
        className="object-fill"
        unoptimized
      />
    </div>
    <h3 className="text-sm font-bold mb-1 uppercase tracking-tight">{name}</h3>
    <p className="text-zinc-700 dark:text-zinc-300 text-xs mb-3 font-medium uppercase tracking-widest">{designation}</p>
    <a
      href={github}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-2 border-zinc-900 dark:border-white px-3 py-2 hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-zinc-900 transition-colors"
    >
      <SiGithub size={14} />
      GitHub
    </a>
  </div>
)

export default function Founders() {
  return (
    <section className="w-full py-12 px-4 border-t-2 border-zinc-900 dark:border-white border-b-2">
      <h2 className="text-2xl font-black text-center mb-8 uppercase tracking-tighter">Meet Our Founders</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
        {founders.map((founder) => (
          <FounderCard key={founder.name} {...founder} />
        ))}
      </div>
    </section>
  )
}

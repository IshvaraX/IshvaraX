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

const FounderCard = ({ name, designation, image, github }: typeof founders[0]) => (
  <div className="rounded-xl p-6 text-center ">
    <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border">
      <Image
        src={image}
        alt={name}
        fill
        className="object-fill"
        unoptimized
      />
    </div>
    <h3 className="text-m font-semibold mb-1">{name}</h3>
    <p className="text-gray-600 text-sm mb-3">{designation}</p>
    <a
      href={github}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-sm text-white-600 hover:text-blue-800"
    >
      <SiGithub size={16} />
      GitHub
    </a>
  </div>
)

export default function Founders() {
  return (
    <section className="w-full py-12 px-4">
      <h2 className="text-2xl font-bold text-center mb-8">Meet Our Founders</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {founders.map((founder) => (
          <FounderCard key={founder.name} {...founder} />
        ))}
      </div>
    </section>
  )
}
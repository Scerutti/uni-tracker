/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  /** `/carrera` era la única carrera antes de que hubiera varias: los links viejos siguen andando. */
  async redirects() {
    return [
      { source: "/carrera", destination: "/carrera/lic-sistemas", permanent: true },
    ]
  },
}

export default nextConfig

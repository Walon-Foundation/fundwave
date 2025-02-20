import Link from "next/link";

function Hero() {
  return (
    <section className="my-">
      <div className="flex flex-col items-center justify-center py-6 bg-blue-100">
        <h1 className="text-5xl lg:text-7xl font-extrabold mb-1 text-center">
          Empower Dreams Across Salone
        </h1>
        <h1 className="text-5xl lg:text-7xl text-blue-500 font-extrabold mb-4 text-center">
          Fund the Future with FundWave
        </h1>
        <p className="text-3xl lg:text-3xl tracking-tighter font-thin lg:w-[900px] text-center mx-2 text-black/50 mt-2 mb-2">
          Join the movement to support innovative projects, local businesses, and community initiatives throughout Sierra Leone.
        </p>
        <div className="flex gap-4 my-16">
          <Link href='/campaign/create'>
          <button
            className="border-2 border-blue-500 shadow-2xl bg-blue-500 text-white px-4 py-2 rounded-md md:text-xl font-bold"
          >
            Start Fundraising
          </button>
          </Link>
          
          
            <Link href='/campaign'><button className="border-2 mx-2 border-white bg-white shadow-xl py-2 px-4 rounded-md md:text-xl font-bold">
              Explore Projects
            </button></Link>
          
        </div>
      </div>
    </section>
  );
}

export default Hero;

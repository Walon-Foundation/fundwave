import { FaRegMoneyBillAlt } from "react-icons/fa"
import { GoPeople } from "react-icons/go"


function Impact() {
  return (
    <section className="my-24">
        <p className="mb-4 text-center font-extrabold text-5xl">FundWave Impact</p>
        <div className="flex flex-col gap-20 items-center md:flex-row  my-16  justify-between md:gap-4 mx-10 border-2 border-black/50 rounded-xl py-4"> 
            <div className=" flex-1  flex flex-col items-center justify-center h-[200px] w-[250px]">
                <div className="flex flex-col md:flex-row items-center gap-2 justify-center">
                  <GoPeople className="w-10 h-10 text-blue-500"/>
                  <h1 className="font-bold my-2 underline text-2xl tracking-tight">Projects Funded</h1>
                </div>
                <p className="text-3xl font-extrabold my-2">1,234</p>
            </div>
            <div className=" hidden md:flex md:border-l-2 border-black/50 py-20 text-transparent">
              h
            </div>
            <div className="flex border-t-2 px-24 text-transparent border-black/50  md:hidden">
              h 
            </div>
            <div className=" flex-1 flex flex-col h-[200px] w-[250px] justify-center items-center ">
                <div className="flex flex-col md:flex-row items-center gap-2 justify-center">
                  <FaRegMoneyBillAlt className="w-10 h-10 text-blue-500"/>
                  <h1 className="font-bold my-2 underline text-2xl tracking-tight">Total Amount Raised</h1>
                </div>
                <p className="font-extrabold text-md text-3xl my-2">NLe500,000</p>
            </div>
        </div>
    </section>
  )
}

export default Impact
import Banner from "./assets/images/banner.png"
import Service1 from "./assets/images/s1.png"
import Service2 from "./assets/images/s2.png"
import Service3 from "./assets/images/s3.png"
import Service4 from "./assets/images/s4.png"
import Product1 from "./assets/images/p1_1.png"
import Product2 from "./assets/images/p1.png"
import Product3 from "./assets/images/p3.png"
import Product4 from "./assets/images/p4.png"
import Product5 from "./assets/images/p5.png"
import Product6 from "./assets/images/p6.png"

function App() {

  return (
    <>
       <div className='h-[80vh]'>
        <img className='w-full h-full object-cover' src={Banner} alt='banner'/>
      </div>
      <div className='container mx-auto py-10'>
        <h5 className='font-bold text-xl mb-5'>DANH MỤC VẮC XIN TẠI CÁC CƠ SỞ</h5>
        <div className='flex justify-between items-start flex-wrap gap-y-3'>
          <div className='w-1/3 px-10'>
            <div>
              <img className='w-full h-full object-contain' src={Product1}/>
            </div>
            <p className='text-center mt-2 font-bold'>VẮC XIN SỐT XUẤT HUYẾT</p>
          </div>
          <div className='w-1/3 px-10'>
            <div>
              <img className='w-full h-full object-contain' src={Product2}/>
            </div>
            <p className='text-center mt-2 font-bold'>VẮC XIN PHẾ CẦU 23</p>
          </div>
          <div className='w-1/3 px-10'>
            <div>
              <img className='w-full h-full object-contain' src={Product3}/>
            </div>
            <p className='text-center mt-2 font-bold'>VẮC XIN PHẾ CẦU 13</p>
          </div>
          <div className='w-1/3 px-10'>
            <div>
              <img className='w-full h-full object-contain' src={Product4}/>
            </div>
            <p className='text-center mt-2 font-bold'>VẮC XIN ZONA THẦN KINH</p>
          </div>
          <div className='w-1/3 px-10'>
            <div>
              <img className='w-full h-full object-contain' src={Product5}/>
            </div>
            <p className='text-center mt-2 font-bold'>VẮC XIN NÃO MÔ CẦU A</p>
          </div>
          <div className='w-1/3 px-10'>
            <div>
              <img className='w-full h-full object-contain' src={Product6}/>
            </div>
            <p className='text-center mt-2 font-bold'>VẮC XIN NÃO MÔ CẦU B</p>
          </div>
        </div>
      </div>
      <div className='bg-secondary py-15'>
        <h1 className='text-center font-bold text-2xl mb-10'>CÁC DỊCH VỤ CỦA CHÚNG TÔI</h1>
        <div className='container flex items-center justify-between mx-auto'>
          <div className="w-fit bg-gray p-7 rounded-xl flex flex-col justify-center items-center gap-2">
            <div>
              <img src={Service1}></img>
            </div>
            <p className="text-center">
              TIÊM CHỦNG TẠI CƠ SỞ
            </p>
          </div>
          <div className="w-fit bg-gray p-7 rounded-xl flex flex-col justify-center items-center gap-2">
            <div>
              <img src={Service2}></img>
            </div>
            <p className="text-center">
              TIÊM CHỦNG THEO COMBO
            </p>
          </div>
          <div className="w-fit bg-gray p-7 rounded-xl flex flex-col justify-center items-center gap-2">
            <div>
              <img src={Service3}></img>
            </div>
            <p className="text-center">
              TIÊM CHỦNG THEO YÊU CẦU
            </p>
          </div>
          <div className="w-fit bg-gray p-7 rounded-xl flex flex-col justify-center items-center gap-2">
            <div>
              <img src={Service4}></img>
            </div>
            <p className="text-center">
              TIÊM CHỦNG VIP
            </p>
          </div>
        </div>
      </div>
      <hr className="bg-white text-white"/>
    </>
  )
}

export default App;
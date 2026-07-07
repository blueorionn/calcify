import Header from '@/components/Header'
import BMICalculator from '@/calc/BMICalculator'

export default function Page() {
  return (
    <>
      <Header />
      <main className='bg-muted dark:bg-background h-full w-full pb-12'>
        <section
          className={`flex h-full w-full flex-col items-center justify-center p-4`}
        >
          <div className='my-8 mt-6 w-xs md:w-xl lg:w-5xl'>
            <div className='relative h-3 overflow-hidden rounded-full'>
              <div className='flex h-full'>
                <div className='w-[18.5%] bg-blue-500'></div>
                <div className='w-[25%] bg-green-500'></div>
                <div className='w-[20%] bg-yellow-500'></div>
                <div className='flex-1 bg-red-500'></div>
              </div>
            </div>

            <div className='text-muted-foreground mt-2 flex justify-between text-xs'>
              <span>0</span>
              <span>18.5</span>
              <span>25</span>
              <span>30</span>
              <span>40+</span>
            </div>
          </div>
          <BMICalculator />
        </section>
      </main>
    </>
  )
}

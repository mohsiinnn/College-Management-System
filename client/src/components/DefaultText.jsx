import { useSelector } from 'react-redux'
import { assets } from '../assets/assets'

const DefaultText = () => {
  const { user } = useSelector((state) => state.auth)

    return (
        <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
            <img src={assets.header_img} className='w-36 h-36 rounded-full mb-6' />

            <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>
                Hey {user ? user.name : "Developer"}!
                <img src={assets.hand_wave} className='w-8 aspect-square' />
            </h1>
            <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to our App</h2>
            <p className='mb-8 max-w-md'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus delectus perspiciatis ducimus dolore.</p>
            <button className='border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all'>Get Started</button>
        </div>
    )
}

export default DefaultText
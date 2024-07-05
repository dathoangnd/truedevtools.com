import { Typography } from 'antd'
import SingleColumnLayout from '../../layouts/SingleColumnLayout/SingleColumnLayout.component'

const Home = () => {
  return (
    <SingleColumnLayout
      View={
      <div className='text-xl'>
        <Typography.Title level={2} className='mb-8'>Hello developer 👋</Typography.Title>

        <p className='text-gray-800 dark:text-gray-300 mb-6'>True Devtools is a free collection of 45+ carefully crafted tools useful for development. Stop pasting your code on various random websites, True Devtools centralizes all your go-to utilities in one convenient location. Just select the tool you need on the left sidebar to get the task done quick.</p>
        <p className='text-gray-800 dark:text-gray-300 mb-6'>The app is lightweight and run entirely on your client-side, ensures a seamless experience without compromising on security (no user data is stored). It also fully supports PWA, you can <Typography.Link href='https://support.google.com/chrome/answer/9658361' target='_blank' className='text-xl'>install it</Typography.Link> for offline usage.</p>
        <p className='text-gray-800 dark:text-gray-300 mb-6'>If you find any bugs, or have any feature improvement ideas, please let me know by <Typography.Link href='https://github.com/dathoangnd/truedevtools.com/issues' target='_blank' className='text-xl'>reporting an issue</Typography.Link>.</p>

        <p className='text-gray-800 dark:text-gray-300'>Built with ❤️ and ☕️ by <Typography.Link href='https://facebook.com/dathoangnd' target='_blank' className='text-xl'>Dat Hoang</Typography.Link></p>
      </div>
      }
    />
  )
}

export default Home
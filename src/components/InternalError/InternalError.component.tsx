import { Result } from 'antd'

const InternalError = () => {
	return (
		<div className='h-full flex justify-center items-center'>
			<Result
				status='500'
				title='500'
				subTitle='Something went wrong.'
			/>
		</div>
	)
}

export default InternalError
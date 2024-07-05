import { Button, Result } from 'antd'
import { useNavigate } from 'react-router'

const NotFound = () => {
	const navigate = useNavigate()

	return (
		<div className='h-full flex justify-center items-center'>
			<Result
				status='404'
				title='404'
				subTitle='This page does not exist.'
				extra={<Button size='large' type="primary" onClick={() => navigate('/')}>Back home</Button>}
			/>
		</div>
	)
}

export default NotFound
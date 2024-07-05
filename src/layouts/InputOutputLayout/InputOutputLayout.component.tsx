import { FC, ReactElement } from 'react'
import { Divider, Typography } from 'antd'

interface IInputOutputLayoutProps {
	InputToolbar?: ReactElement,
	InputView?: ReactElement,
	OutputToolbar?: ReactElement,
	OutputView?: ReactElement
}

const InputOutputLayout: FC<IInputOutputLayoutProps> = ({InputToolbar, InputView, OutputToolbar, OutputView}) => {
	return (
		<div className='flex flex-col lg:flex-row h-full'>
			<div className='basis-0 flex-grow h-auto lg:h-full flex flex-col'>
				<div className='shrink-0 flex flex-wrap justify-between items-center px-8 py-4 basis-20'>
					<Typography.Title className='mb-0' level={4}>Input:</Typography.Title>
					{ InputToolbar }
				</div>

				<div className='flex-grow overflow-y-auto px-8 pb-8'>
					{ InputView }
				</div>
			</div>
			<Divider type='vertical' className='h-full border-l-2 m-0 hidden lg:block' />
			<div className='basis-0 flex-grow h-auto lg:h-full flex flex-col'>
				<div className='shrink-0 flex justify-between items-center px-8 basis-20'>
					<Typography.Title className='mb-0' level={4}>Output:</Typography.Title>
					{ OutputToolbar }
				</div>
				<div className='flex-grow overflow-y-auto px-8 pb-8 flex flex-col'>
					{ OutputView }
				</div>
			</div>
		</div>
	)
}

export default InputOutputLayout
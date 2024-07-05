import { FC, ReactElement } from 'react'

interface IInputOutputLayoutProps {
	Toolbar?: ReactElement,
	View?: ReactElement
}

const SingleColumnLayout: FC<IInputOutputLayoutProps> = ({Toolbar, View}) => {
	return (
		<div className='flex h-full'>
			<div className='basis-0 flex-grow h-full flex flex-col'>
				<div className={`shrink-0 flex justify-end items-center px-8 ${!Toolbar ? 'basis-8' : 'basis-20'}`}>					
					{Toolbar}
				</div>

				<div className='flex-grow overflow-y-auto px-8 pb-8 scroll-smooth'>
					{View}
				</div>
			</div>
		</div>
	)
}

export default SingleColumnLayout
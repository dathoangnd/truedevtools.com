import React, { FC, useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import { App, Button, Divider, Empty, Input, Layout, Switch, message } from 'antd'
import { SearchOutlined, GithubOutlined, SunOutlined, MoonOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Menu, Typography } from 'antd'
import { HelmetProvider, Helmet } from 'react-helmet-async'
import { description } from '../../../package.json'

import iconImageUrl from '../../assets/images/icon.png'
import { Link } from 'react-router-dom'
import { IToolRoute, TOOL_ROUTES } from '../../routes/routes'
import { ItemType, MenuItemGroupType } from 'antd/es/menu/hooks/useItems'
import { fuzzyMatch } from '../../utils/fuzzyMatch.utils'
import { setMessageInstance } from '../../store/message/message.slice'
import { useAppDispatch } from '../../store/hooks'
import LoadingBar from '../../components/LoadingBar/LoadingBar.component'

import styles from './AppLayout.module.scss'
import { useSelector } from 'react-redux'
import { selectTheme } from '../../store/theme/theme.selector'
import { toggleTheme } from '../../store/theme/theme.slice'

const AppLayout: FC = () => {
	const location = useLocation()
	const dispatch = useAppDispatch()

	const theme = useSelector(selectTheme())

	const onToggleTheme = () => {
		dispatch(toggleTheme())
	}

	const [messageInstance, contextHolder] = message.useMessage({
		maxCount: 5
	})
	dispatch(setMessageInstance(messageInstance))

	const [selectedKey, setSelectedKey] = useState<string|null>(null)

	useEffect(() => {
		setSelectedKey(location.pathname)
	}, [location])

	const toolRoute = useMemo(() => {
		let toolRoute: IToolRoute|null = null

		outer:
		for (const toolRouteGroup of TOOL_ROUTES) {
			for (const route of toolRouteGroup.routes) {
				if (route.path === location.pathname) {
					toolRoute = route
					break outer
				}
			}
		}

		return toolRoute
	}, [location])

	const routeLabel = useMemo(() => {
		if (location.pathname === '/') return ''

		if (!toolRoute) return 'Page Not Found'

		return toolRoute.label
	}, [location, toolRoute])

	const routeTitle = useMemo(() => {
		if (!routeLabel) return `True Devtools - All-in-one Toolkit for Developers`

		return `${routeLabel} | True Devtools`
	}, [routeLabel])

	const routeDescription = useMemo(() => {
		if (toolRoute && toolRoute.description) return toolRoute.description

		return `Stop pasting your code on random websites, True Devtools centralizes all your go-to utilities in one convenient location with 45+ carefully crafted tools.`
	}, [toolRoute])

	const [searchQuery, setSearchQuery] = useState('')
	
	const menuItems: MenuProps['items'] = useMemo(() => {
		const createMenuItem = (toolRoute: IToolRoute): ItemType => ({
			label: <Link to={toolRoute.path}>{toolRoute.label}</Link>,
			key: toolRoute.path,
			icon: React.createElement(toolRoute.icon)
		})
		
		const menuItemGroups: MenuItemGroupType[] = TOOL_ROUTES.map(toolRouteGroup => ({
			type: 'group',
			label: toolRouteGroup.label,
			children: toolRouteGroup.routes
				.filter(route => {
					if (fuzzyMatch(route.label, searchQuery)) return true
					if (route.alias) {
						for (const aliasLabel of route.alias) {
							if (fuzzyMatch(aliasLabel, searchQuery)) return true
						}
					}
				})
				.map(route => createMenuItem(route))
		}))

		return menuItemGroups.filter((menuItemGroup: MenuItemGroupType) => menuItemGroup.children?.length)
	}, [searchQuery])

	useEffect(() => {
		const triggerButton: HTMLElement|null = document.querySelector('.ant-layout-sider-below:not(.ant-layout-sider-collapsed) .ant-layout-sider-zero-width-trigger')
		if (triggerButton) {
			triggerButton.click()
		}
	}, [location])

	return (
		<App>
			<LoadingBar />
			<HelmetProvider>
				<Helmet>
					<title>{routeTitle}</title>
					<meta name="description" content={routeDescription}></meta>
				</Helmet>
			</HelmetProvider>
			{contextHolder}
			<Layout className='flex flex-col h-lvh'>
				<Layout.Header className={`${theme === 'light' ? 'bg-white' : ''} p-0 z-10 shadow-sm flex items-center`}>
					<Link to='/' className='items-center gap-2 w-[310px] p-7 hidden xl:flex'>
						<img className='w-10' src={iconImageUrl} alt={description} />
						<Typography.Title level={2} className='text-xl mb-0'>True Devtools</Typography.Title>
					</Link>
					<Divider type='vertical' className='h-6 m-0 hidden xl:block' />
					<div className='grow flex items-center justify-between'>
						<Typography.Title className='text-2xl font-normal p-8 mb-0'>{routeLabel}</Typography.Title>
						<div className='mx-8 flex items-center gap-4'>
							<Button className='hidden sm:block' icon={<GithubOutlined />} type='text' size='large' href='https://github.com/dathoangnd/truedevtools.com/issues' target='_blank'>Report an issue</Button>
							<Switch
								checkedChildren={<MoonOutlined />}
								unCheckedChildren={<SunOutlined />}
								value={theme === 'dark'}
								onClick={onToggleTheme}
							/>
						</div>
					</div>
				</Layout.Header>
				<Layout className='flex-grow overflow-hidden'>
					<Layout.Sider
						width="310"
						breakpoint="xl" 
						collapsedWidth="0"
						defaultCollapsed={true}
						className={styles.sidebar}
					>
						<div className={`${theme === 'light' ? 'bg-white' : ''} flex flex-col h-full`}>
							<div className='px-4 pt-8 pb-4'>
								<Input
									placeholder='Search tools...'
									prefix={<SearchOutlined className='text-gray-300' />}
									value={searchQuery}
									onChange={(value) => setSearchQuery(value.target.value)}
									allowClear
								/>
							</div>
							{
							menuItems.length === 0 ?
							<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='No tools match your query' /> :
							<Menu
								theme={theme}
								style={{flexBasis: 0}}
								className='flex-grow overflow-y-auto pb-8'
								mode="inline"
								selectedKeys={!selectedKey ? [] : [selectedKey]}
								items={menuItems}
							/>
							}
						</div>
					</Layout.Sider>
						
					<Layout.Content className='p-8'>
						<div className={`${theme === 'light' ? 'bg-white' : ''} rounded-lg h-full overflow-y-auto`}>
							<Outlet />
						</div>
					</Layout.Content>
				</Layout>
			</Layout>
		</App>
	)
}

export default AppLayout
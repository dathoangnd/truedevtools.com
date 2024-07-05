import { useRef, useState } from 'react'
import { Button, Empty, List, Space, Typography } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'
import * as monaco from 'monaco-editor'
import {Name, X509Certificate} from '@peculiar/x509'
import { useAppDispatch } from '../../store/hooks'
import { error, success } from '../../store/message/message.slice'
import InputOutputLayout from '../../layouts/InputOutputLayout/InputOutputLayout.component'
import CodeEditor from '../../components/CodeEditor/CodeEditor.component'
import certificateSample from '../../data/certificate-sample.crt?raw'

export interface IOptionTypes {
  certificate: string
}

interface IOrganization {
	commonName: string,
	organization: string,
	organizationUnit: string,
	country: string,
	state: string,
	city: string
}

interface IParsedCertificate {
	serialNumber: string,
	validFrom: string,
	validTo: string,
	subject: IOrganization,
	issuer: IOrganization
}

const DigitalCertificateDecoder = () => {
	const dispatch = useAppDispatch()

	const codeEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null)

	const options = useRef<IOptionTypes>({
		certificate: ''
	})

	const generateSample = () => {
		onCertificateChange(certificateSample)
		codeEditorRef.current?.setValue(certificateSample)
	}

	const [parsedCertificate, setParsedCertificate] = useState<IParsedCertificate|null>(null)

	const parse = () => {
		try {
			const certificate = new X509Certificate(options.current.certificate)
			const parsedCertificate: IParsedCertificate = {
				serialNumber: certificate.serialNumber,
				validFrom: certificate.notBefore.toString(),
				validTo: certificate.notAfter.toString(),
				subject: parseOrganization(certificate.subjectName),
				issuer: parseOrganization(certificate.issuerName)
			}
			setParsedCertificate(parsedCertificate)
			dispatch(success())
		} catch (err) {
			dispatch(error('Invalid certificate'))
		}
	}

	const onCertificateChange = (certificate: string) => {
		options.current.certificate = certificate
	}

	return (
		<InputOutputLayout
			InputToolbar={
				<Space>
					<Button size='large' onClick={generateSample}>
						Sample
					</Button>
					<Button type="primary" icon={<ArrowRightOutlined />} size='large' onClick={parse}>
						Parse
					</Button>
				</Space>
			}

			InputView={
				<CodeEditor ref={codeEditorRef} code={options.current.certificate} onChange={onCertificateChange} />
			}

			OutputView={
				parsedCertificate === null ? (
					<div className='h-full min-h-[250px] flex items-center justify-center border border-solid border-gray-300'>
						<Empty />
					</div>
				) : (
					<>
						<Typography.Title level={5}>General</Typography.Title>
						<List
							bordered
							className='mt-2 mb-8'
							dataSource={[
								{
									label: 'Serial number',
									value: parsedCertificate.serialNumber
								},
								{
									label: 'Valid from',
									value: parsedCertificate.validFrom
								},
								{
									label: 'Valid to',
									value: parsedCertificate.validTo
								}
							]}
							renderItem={({label, value}) => (
								<List.Item>
									<div>
										<div className='font-semibold'>{label}:</div>
										{
										value ? 
										<Typography.Text copyable>{value}</Typography.Text> :
										<></>
										}
									</div>
								</List.Item>
							)}
						/>

						<Typography.Title level={5}>Subject</Typography.Title>
						<List
							bordered
							className='mt-2 mb-8'
							dataSource={[
								{
									label: 'Common name',
									value: parsedCertificate.subject.commonName
								},
								{
									label: 'Organization',
									value: parsedCertificate.subject.organization
								},
								{
									label: 'Organization unit',
									value: parsedCertificate.subject.organizationUnit
								},
								{
									label: 'Country',
									value: parsedCertificate.subject.country
								},
								{
									label: 'State',
									value: parsedCertificate.subject.state
								},
								{
									label: 'City',
									value: parsedCertificate.subject.city
								}
							]}
							renderItem={({label, value}) => (
								<List.Item>
									<div>
										<div className='font-semibold'>{label}:</div>
										{
										value ? 
										<Typography.Text copyable>{value}</Typography.Text> :
										<></>
										}
									</div>
								</List.Item>
							)}
						/>

						<Typography.Title level={5}>Issuer</Typography.Title>
						<List
							bordered
							className='mt-2 mb-8'
							dataSource={[
								{
									label: 'Common name',
									value: parsedCertificate.issuer.commonName
								},
								{
									label: 'Organization',
									value: parsedCertificate.issuer.organization
								},
								{
									label: 'Organization unit',
									value: parsedCertificate.issuer.organizationUnit
								},
								{
									label: 'Country',
									value: parsedCertificate.issuer.country
								},
								{
									label: 'State',
									value: parsedCertificate.issuer.state
								},
								{
									label: 'City',
									value: parsedCertificate.issuer.city
								}
							]}
							renderItem={({label, value}) => (
								<List.Item>
									<div>
										<div className='font-semibold'>{label}:</div>
										{
										value ? 
										<Typography.Text copyable>{value}</Typography.Text> :
										<></>
										}
									</div>
								</List.Item>
							)}
						/>
					</>
				)
			}
		/>
	)
}

const parseOrganization = (organization: Name): IOrganization => {
	return {
		commonName: organization.getField('CN')[0] || '',
		organization: organization.getField('O')[0] || '',
		organizationUnit: organization.getField('OU')[0] || '',
		country: organization.getField('C')[0] || '',
		state: organization.getField('ST')[0] || '',
		city: organization.getField('L')[0] || ''
	}
}

export default DigitalCertificateDecoder
import { FC, lazy } from 'react'
import {
	MenuUnfoldOutlined,
	CompressOutlined,
	EyeOutlined,
	RetweetOutlined,
	BgColorsOutlined,
	ClockCircleOutlined,
	FieldBinaryOutlined,
	NumberOutlined,
	ConsoleSqlOutlined,
	SyncOutlined,
	KeyOutlined,
	FieldNumberOutlined,
	FileImageOutlined,
	PictureOutlined,
	LockOutlined,
	LinkOutlined,
	FileZipOutlined,
	SortAscendingOutlined,
	TrademarkCircleOutlined,
	OrderedListOutlined,
	BuildOutlined,
	FieldStringOutlined,
	PercentageOutlined
} from '@ant-design/icons'

export interface IToolRoute {
	label: string,
	path: string,
	component: FC,
	icon: FC,
	alias?: string[],
	description?: string
}

export interface IToolRouteGroup {
	label: string,
	routes: IToolRoute[]
}

export const TOOL_ROUTES: IToolRouteGroup[] = [
	{
		label: 'HTML / CSS / Js tools',
		routes: [
			{
				label: 'HTML Formatter',
				path: '/html-formatter',
				component: lazy(() => import('./HtmlFormatter/HtmlFormatter.component')),
				icon: MenuUnfoldOutlined,
				alias: ['HTML Beautifier', 'HTML Beautify'],
				description: 'Clean and beautify HTML code, making it easy to read and maintain. Boost readability, spot errors faster with perfectly formatted HTML.'
			},
			{
				label: 'HTML Minifier',
				path: '/html-minifier',
				component: lazy(() => import('./HtmlMinifier/HtmlMinifier.component')),
				icon: CompressOutlined,
				alias: ['HTML Minify', 'HTML Uglifier', 'HTML Uglify'],
				description: 'Shrink your HTML code. Trim whitespaces and unnecessary tags for faster loading times and better SEO.'
			},
			{
				label: 'HTML Viewer',
				path: '/html-viewer',
				component: lazy(() => import('./HtmlViewer/HtmlViewer.component')),
				icon: EyeOutlined,
				alias: ['HTML Previewer', 'HTML Sandbox'],
				description: 'See your HTML code come to life. Instantly renders your HTML code, letting you visualize changes effortlessly.'
			},
			{
				label: 'HTML Entity Encoder / Decoder',
				path: '/html-entity-encoder-decoder',
				component: lazy(() => import('./HtmlEntityEncoderDecoder/HtmlEntityEncoderDecoder.component')),
				icon: PercentageOutlined,
				alias: ['HTML Entity Parser'],
				description: 'Convert characters & symbols easily. Translate between text & HTML entities for flawless web development.'
			},
			{
				label: 'CSS Formatter',
				path: '/css-formatter',
				component: lazy(() => import('./CssFormatter/CssFormatter.component')),
				icon: MenuUnfoldOutlined,
				alias: ['CSS Beautifier', 'CSS Beautify'],
				description: 'Untidy CSS got you down? CSS Formatter beautifies & organizes your CSS code for readability & maintainability.'
			},
			{
				label: 'CSS Minifier',
				path: '/css-minifier',
				component: lazy(() => import('./CssMinifier/CssMinifier.component')),
				icon: CompressOutlined,
				alias: ['CSS Minify', 'CSS Uglifier', 'CSS Uglify'],
				description: 'Supercharge website speed with CSS Minifier! Minify CSS code to optimize file size, boost loading times & improve SEO.'
			},
			{
				label: 'JavaScript Formatter',
				path: '/javascript-formatter',
				component: lazy(() => import('./JavaScriptFormatter/JavaScriptFormatter.component')),
				icon: MenuUnfoldOutlined,
				alias: ['JavaScript JS Formatter', 'JavaScript JS Beautifier', 'JavaScript JS Beautify'],
				description: 'Unmess your JavaScript code. Clean & organize your JS for better readability & debugging. Boost developer productivity!'
			},
			{
				label: 'JavaScript Minifier',
				path: '/javascript-minifier',
				component: lazy(() => import('./JavaScriptMinifier/JavaScriptMinifier.component')),
				icon: CompressOutlined,
				alias: ['JavaScript JS Minify', 'JavaScript JS Uglifier', 'JavaScript JS Uglify'],
				description: 'Supercharge your site speed. JavaScript Minifier shrinks & optimizes JS files for blazing-fast load times & improved SEO.'
			}
		]
	},
	{
		label: 'Text tools',
		routes: [
			{
				label: 'Regex Tester',
				path: '/regex-tester',
				component: lazy(() => import('./RegexTester/RegexTester.component')),
				icon: TrademarkCircleOutlined,
				alias: ['Regular Expression Tester', 'Regular Expression Parser', 'Regular Expression Sandbox'],
				description: 'Regex Tester lets you write, test, and debug regular expressions with ease. Boost developer productivity!'
			},
			{
				label: 'Text Diff Checker',
				path: '/text-diff-checker',
				component: lazy(() => import('./TextDiffChecker/TextDiffChecker.component')),
				icon: BuildOutlined,
				alias: ['Text String Difference Checker', 'Compare Text String Difference'],
				description: 'Spot changes instantly. Text Diff Checker highlights differences between two text versions, streamlining code reviews and content comparisons.'
			},
			{
				label: 'Word Counter',
				path: '/word-counter',
				component: lazy(() => import('./WordCounter/WordCounter.component')),
				icon: OrderedListOutlined,
				alias: ['Text String Word Counter', 'Text String Character Counter', 'Text String Word Distribution'],
				description: 'Instantly analyze text content. Word Counter provides word, character counts and word distribution for flawless writing & editing.'
			},
			{
				label: 'Lorem Ipsum Generator',
				path: '/lorem-ipsum-generator',
				component: lazy(() => import('./LoremIpsumGenerator/LoremIpsumGenerator.component')),
				icon: FieldStringOutlined,
				alias: ['Random Text String Generator'],
				description: 'Generate dummy "Lorem ipsum" text to use as text placeholder in your app design. Focus on your app building instead of copywriting.'
			},
			{
				label: 'Random String Generator',
				path: '/random-string-generator',
				component: lazy(() => import('./RandomStringGenerator/RandomStringGenerator.component')),
				icon: FieldStringOutlined,
				alias: ['Random Text Generator'],
				description: 'Generate secure random strings at your fingertips. Random String Generator creates unique strings for passwords, tokens, and more.'
			},
			{
				label: 'Unicode to Hex Converter',
				path: '/unicode-to-hex-converter',
				component: lazy(() => import('./UnicodeToHexConverter/UnicodeToHexConverter.component')),
				icon: RetweetOutlined,
				alias: ['Unicode Text String to Hex Code Converter'],
				description: 'Effortlessly convert Unicode to Hex. Translate characters to their corresponding hex codes, simplifying web development and data analysis.'
			},
			{
				label: 'Hex to Unicode Converter',
				path: '/hex-to-unicode-converter',
				component: lazy(() => import('./HexToUnicodeConverter/HexToUnicodeConverter.component')),
				icon: RetweetOutlined,
				alias: ['Hex Code to Unicode Text String Converter'],
				description: 'Decode Hex to Unicode Instantly. Translate hexadecimal code into human-readable characters, simplifying data interpretation.'
			},
			{
				label: 'Text Case Converter',
				path: '/text-case-converter',
				component: lazy(() => import('./TextCaseConverter/TextCaseConverter.component')),
				icon: RetweetOutlined,
				alias: ['Text String Upper Lower Capitalized Case Converter'],
				description: 'Effortlessly convert text cases. Text Case Converter offers uppercase, lowercase, capitalized case for all your content needs.'
			},
			{
				label: 'Backslash Escape / Unescape',
				path: '/backslash-escape-unescape',
				component: lazy(() => import('./BackslashEscapeUnescape/BackslashEscapeUnescape.component')),
				icon: PercentageOutlined,
				alias: ['JavaScript JS Text String Backslash Escaper / Unescaper / Encoder / Decoder'],
				description: 'Secure your strings. Backslash Escape / Unescape safeguards data by encoding special characters for safe storage and transmission.'
			},
			{
				label: 'List Sorter / Randomizer',
				path: '/list-sorter-randomizer',
				component: lazy(() => import('./ListSorterRandomizer/ListSorterRandomizer.component')),
				icon: SortAscendingOutlined,
				alias: ['Text String List Line Sorter / Randomizer'],
				description: 'Effortlessly sort & randomize list. Sort a list of text lines in ascending, descending, reversed, or random order.'
			},
			{
				label: 'Markdown Preview',
				path: '/markdown-preview',
				component: lazy(() => import('./MarkdownPreview/MarkdownPreview.component')),
				icon: EyeOutlined,
				alias: ['Markdown Previewer', 'Markdown Viewer', 'Markdown Sandbox'],
				description: 'Write in markdown, preview instantly. Markdown Preview shows your formatted text as you write, saving you time and effort.'
			}
		]
	},
	{
		label: 'JSON tools',
		routes: [
			{
				label: 'JSON Formatter',
				path: '/json-formatter',
				component: lazy(() => import('./JsonFormatter/JsonFormatter.component')),
				icon: MenuUnfoldOutlined,
				alias: ['JSON Beautifier', 'JSON Beautify'],
				description: 'Beautify your JSON. JSON Formatter makes your JSON code readable & checks for errors, boosting development efficiency.'
			},
			{
				label: 'JSON Minifier',
				path: '/json-minifier',
				component: lazy(() => import('./JsonMinifier/JsonMinifier.component')),
				icon: CompressOutlined,
				alias: ['JSON Minify', 'JSON Uglifier', 'JSON Uglify'],
				description: 'Instantly minify JSON for flawless data exchange. JSON Minifier reduces JSON file size by trimming all whitespaces for faster transmission.'
			},
			{
				label: 'JSON to XML Converter',
				path: '/json-to-xml-converter',
				component: lazy(() => import('./JsonToXmlConverter/JsonToXmlConverter.component')),
				icon: RetweetOutlined,
				description: 'Effortlessly convert JSON to XML: JSON to XML Converter ensures seamless data exchange between formats, boosting your development workflow.'
			},
			{
				label: 'XML to JSON Converter',
				path: '/xml-to-json-converter',
				component: lazy(() => import('./XmlToJsonConverter/XmlToJsonConverter.component')),
				icon: RetweetOutlined,
				description: 'Effortlessly convert XML to JSON. True Devtools\' free online converter transforms your data with ease. Get clean, human-readable JSON in seconds!'
			},
			{
				label: 'JSON to YAML Converter',
				path: '/json-to-yaml-converter',
				component: lazy(() => import('./JsonToYamlConverter/JsonToYamlConverter.component')),
				icon: RetweetOutlined,
				description: 'Effortlessly convert JSON to YAML. JSON to YAML Converter simplifies data migration between formats, boosting your development workflow.'
			},
			{
				label: 'YAML to JSON Converter',
				path: '/yaml-to-json-converter',
				component: lazy(() => import('./YamlToJsonConverter/YamlToJsonConverter.component')),
				icon: RetweetOutlined,
				description: 'Effortlessly convert YAML to JSON. YAML to JSON Converter ensures seamless data exchange between formats, boosting your development workflow.'
			}
		]
	},
	{
		label: 'Web tools',
		routes: [
			{
				label: 'XML Formatter',
				path: '/xml-formatter',
				component: lazy(() => import('./XmlFormatter/XmlFormatter.component')),
				icon: MenuUnfoldOutlined,
				alias: ['XML Beautifier', 'XML Beautify'],
				description: 'Instantly beautify & validate your XML code! True Devtools\' XML Formatter makes editing & debugging XML a breeze.'
			},
			{
				label: 'XML Minifier',
				path: '/xml-minifier',
				component: lazy(() => import('./XmlMinifier/XmlMinifier.component')),
				icon: CompressOutlined,
				alias: ['XML Minify', 'XML Uglifier', 'XML Uglify'],
				description: 'Clean & optimize XML. XML Minifier shrinks file size for faster transmission, and boosts website performance.'
			},
			{
				label: 'Base64 Encoder / Decoder',
				path: '/base64-encoder-decoder',
				component: lazy(() => import('./Base64EncoderDecoder/Base64EncoderDecoder.component')),
				icon: FileZipOutlined,
				alias: ['Base64 Parser'],
				description: 'Effortlessly encode & decode Base64 with True Devtools! Convert text for secure data transmission.'
			},
			{
				label: 'Base64 Image Encoder / Decoder',
				path: '/base64-image-encoder-decoder',
				component: lazy(() => import('./Base64ImageEncoderDecoder/Base64ImageEncoderDecoder.component')),
				icon: FileZipOutlined,
				alias: ['Base64 Image Parser'],
				description: 'Effortlessly convert images to Base64 & vice versa. True Devtools\' Base64 Encoder / Decoder simplifies image processing for transmission & management.'
			},
			{
				label: 'URL Encoder / Decoder',
				path: '/url-encoder-decoder',
				component: lazy(() => import('./UrlEncoderDecoder/UrlEncoderDecoder.component')),
				icon: LinkOutlined,
				alias: ['URL Parser'],
				description: 'Decode encoded URLs or encode text for URLs with True Devtools\' URL Encoder / Decoder. Effortlessly navigate special characters & avoid errors.'
			},
			{
				label: 'URL Parser',
				path: '/url-parser',
				component: lazy(() => import('./UrlParser/UrlParser.component')),
				icon: LinkOutlined,
				alias: ['URL Decoder'],
				description: 'Uncover a URL\'s secrets. True Devtools\' URL Parser breaks down web addresses, revealing hidden details for developers & marketers.'
			},
			{
				label: 'Digital Certificate Decoder',
				path: '/digital-certificate-decoder',
				component: lazy(() => import('./DigitalCertificateDecoder/DigitalCertificateDecoder.component')),
				icon: LockOutlined,
				alias: ['X509 SSL Digital Certificate Decoder Parser'],
				description: 'Digital Certificate Decoder lets you decode and view certificate details for enhanced security analysis.'
			}
		]
	},
	{
		label: 'Image tools',
		routes: [
			{
				label: 'Image Resizer',
				path: '/image-resizer',
				component: lazy(() => import('./ImageResizer/ImageResizer.component')),
				icon: PictureOutlined,
				alias: ['Picture Photo Resizer'],
				description: 'Optimize images instantly. True Devtools\' Image Resizer shrinks file size for blazing-fast load times and improved website SEO.'
			},
			{
				label: 'JPEG / WEBP Compressor',
				path: '/image-compressor',
				component: lazy(() => import('./ImageCompressor/ImageCompressor.component')),
				icon: FileImageOutlined,
				alias: ['Picture Photo Compressor Compression'],
				description: 'Crush image size with an acceptable quality loss. True Devtools\' Image Compressor optimizes images for faster websites & better SEO.'
			},
			{
				label: 'JPG to PNG Converter',
				path: '/jpg-to-png-converter',
				component: lazy(() => import('./ImageFormatConverter/ImageFormatConverter.component')),
				icon: RetweetOutlined,
				alias: ['Image Picture Photo Format Converter'],
				description: 'Convert JPGs to PNGs with ease. True Devtools\' free JPG to PNG converter offers fast, high-quality conversion to optimize your images for web use.'
			},
			{
				label: 'PNG to JPG Converter',
				path: '/png-to-jpg-converter',
				component: lazy(() => import('./ImageFormatConverter/ImageFormatConverter.component')),
				icon: RetweetOutlined,
				alias: ['Image Picture Photo Format Converter'],
				description: 'Convert PNGs to JPGs effortlessly! True Devtools\' free converter shrinks file size without losing quality, perfect for web optimization.'
			},
			{
				label: 'Image Format Converter',
				path: '/image-format-converter',
				component: lazy(() => import('./ImageFormatConverter/ImageFormatConverter.component')),
				icon: RetweetOutlined,
				alias: ['Image Picture Photo Format Converter'],
				description: 'Convert images effortlessly. True Devtools\' Image Format Converter lets you switch between JPG, PNG, WEBP, GIF & more in seconds.'
			}
		]
	},
	{
		label: 'Utilities',
		routes: [
			{
				label: 'Color Converter',
				path: '/color-converter',
				component: lazy(() => import('./ColorConverter/ColorConverter.component')),
				icon: BgColorsOutlined,
				alias: ['HEX RGB HSL HSV HWB CMYK Converter'],
				description: 'Effortless color conversion. True Devtools\' Color Converter lets you switch between HEX, RGB & HSL codes in seconds. Design with confidence!'
			},
			{
				label: 'Number Base Converter',
				path: '/number-base-converter',
				component: lazy(() => import('./NumberBaseConverter/NumberBaseConverter.component')),
				icon: FieldBinaryOutlined,
				alias: ['Binary Octal Decimal Hex Base Converter'],
				description: 'Effortlessly convert numbers between bases (binary, octal, decimal, hex) with True Devtools\' Number Base Converter.'
			},
			{
				label: 'UUID Generator',
				path: '/uuid-generator',
				component: lazy(() => import('./UuidGenerator/UuidGenerator.component')),
				icon: FieldNumberOutlined,
				alias: ['UUID Randomizer'],
				description: 'Need a unique identifier? Generate strong, random UUIDs with True Devtools for free. Easy to use and guaranteed uniqueness.'
			},
			{
				label: 'Hash Generator',
				path: '/hash-generator',
				component: lazy(() => import('./HashGenerator/HashGenerator.component')),
				icon: NumberOutlined,
				alias: ['MD2 MD4 MD5 SHA1 SHA224 SHA256 SHA384 SHA512 Hash Randomizer'],
				description: 'Generate secure hashes with True Devtools. Protect passwords & verify data integrity with various hashing algorithms.'
			},
			{
				label: 'Bcrypt Hash Generator & Checker',
				path: '/bcrypt-generator-checker',
				component: lazy(() => import('./BcryptHashGeneratorChecker/BcryptHashGeneratorChecker.component')),
				icon: NumberOutlined,
				alias: ['Bcrypt Hash Compare Validate Validator'],
				description: 'Securely hash passwords with True Devtools\'s free Bcrypt generator & checker. Verify encrypted passwords instantly.'
			},
			{
				label: 'JWT Decoder',
				path: '/jwt-decoder',
				component: lazy(() => import('./JwtDecoder/JwtDecoder.component')),
				icon: KeyOutlined,
				alias: ['Json Web Token Decoder Parser'],
				description: 'Decode JWTs with ease. True Devtools\' JWT Decoder cracks open JSON Web Tokens, revealing their content for streamlined debugging and analysis.'
			},
			{
				label: 'SQL Formatter',
				path: '/sql-formatter',
				component: lazy(() => import('./SqlFormatter/SqlFormatter.component')),
				icon: ConsoleSqlOutlined,
				alias: ['SQL Beautifier', 'SQL Beautify'],
				description: 'Unleash the power of readable queries. True Devtools\' SQL Formatter cleans and organizes your SQL code, making it easier to understand and debug.'
			},
			{
				label: 'Unix Timestamp Parser',
				path: '/unix-timestamp-parser',
				component: lazy(() => import('./UnixTimestampParser/UnixTimestampParser.component')),
				icon: ClockCircleOutlined,
				description: 'Unravel the mystery of Unix time. Unix Timestamp Parser converts cryptic timestamps into human-readable dates, making log analysis a breeze.'
			},
			{
				label: 'Cron Expression Parser',
				path: '/cron-expression-parser',
				component: lazy(() => import('./CronExpressionParser/CronExpressionParser.component')),
				icon: SyncOutlined,
				alias: ['Crontab Expression Parser'],
				description: 'Unscrambling Cron? True Devtools\' Cron Expression Parser makes scheduling tasks a breeze. Parse & validate your Cron expressions effortlessly.'
			}
		]
	}
]
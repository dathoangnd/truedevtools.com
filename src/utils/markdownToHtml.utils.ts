import { marked } from 'marked'

const markdownToHtml = async (markdown: string): Promise<string> => {
	const result = marked.parse(markdown)

	if (result instanceof Promise) {
		const html = await result
		return html
	} else {
		return result
	}
}

export default markdownToHtml
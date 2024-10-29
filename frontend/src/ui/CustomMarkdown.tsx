import Markdown, { defaultUrlTransform } from "react-markdown";
import remarkGfm from "remark-gfm";

export default function CustomMarkdown(props: { content: string }) {
  return <Markdown
    className="prose prose-sm leading-tight"
    remarkPlugins={[remarkGfm]}
    urlTransform={(url) => (url.startsWith('tel:') ? url : defaultUrlTransform(url))}
    components={{
      a: props => <a {...props} className="text-brand-primary-500 underline" target="_blank" />,
    }}
  >
    {props.content}
  </Markdown>;
}
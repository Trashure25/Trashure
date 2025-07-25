import { Footer } from "./footer"

interface TrashureFooterProps {
  className?: string
}

export function TrashureFooter(props: TrashureFooterProps) {
  return <Footer />
}

// ALSO export it as default in case any page relied on a default export.
export default TrashureFooter

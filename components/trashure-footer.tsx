import type React from "react"
import { Footer } from "./footer"

/**
 * Temporary compatibility wrapper.
 *
 * Older pages still import `TrashureFooter` from
 * "@/components/trashure-footer".  We forward that
 * request to the new unified <Footer/> component so
 * nothing breaks while you gradually update imports.
 */
export function TrashureFooter(props: React.ComponentProps<typeof Footer>) {
  return <Footer {...props} />
}

// ALSO export it as default in case any page relied on a default export.
export default TrashureFooter

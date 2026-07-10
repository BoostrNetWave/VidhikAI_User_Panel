import * as React from "react"
import {
    FileText,
    Gavel,
    Search,
    Users,
} from "lucide-react"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"

export function DashboardSearch() {
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    return (
        <>
            <div
                className="relative w-full cursor-pointer"
                onClick={() => setOpen(true)}
            >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <div className="flex items-center justify-between w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10 bg-gray-50 border-gray-200 hover:bg-white transition-colors text-muted-foreground">
                    <span>Search documents, cases, or insights...</span>
                </div>
            </div>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type to search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <div className="px-4 py-2 text-xs font-semibold text-muted-foreground bg-gray-50/50 border-b">
                        FOUND 5 MATCHING RESULTS ACROSS VIDHIK AI
                    </div>
                    <CommandGroup heading="DOCUMENTS" className="text-primary">
                        <CommandItem>
                            <div className="flex items-start gap-3">
                                <div className="h-8 w-8 rounded bg-red-100 flex items-center justify-center shrink-0">
                                    <FileText className="h-4 w-4 text-red-500" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 leading-none">Service_Agreement_v2.pdf</p>
                                    <p className="text-xs text-muted-foreground mt-1">Modified 2 hours ago • 2.4 MB</p>
                                </div>
                            </div>
                        </CommandItem>
                        <CommandItem>
                            <div className="flex items-start gap-3">
                                <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                                    <FileText className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 leading-none">Vendor_Service_Template_2024.docx</p>
                                    <p className="text-xs text-muted-foreground mt-1">Modified 1 day ago • 1.1 MB</p>
                                </div>
                            </div>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="CASES" className="text-primary">
                        <CommandItem>
                            <div className="flex items-start gap-3">
                                <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center shrink-0">
                                    <Gavel className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 leading-none">Sharma vs State</p>
                                    <p className="text-xs text-muted-foreground mt-1">High Court of Delhi • Civil Suit #402/23</p>
                                </div>
                            </div>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="CONSULTATIONS" className="text-primary">
                        <CommandItem>
                            <div className="flex items-start gap-3">
                                <div className="h-8 w-8 rounded bg-purple-100 flex items-center justify-center shrink-0">
                                    <Users className="h-4 w-4 text-purple-500" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 leading-none">Service Compliance Discussion</p>
                                    <p className="text-xs text-muted-foreground mt-1">Scheduled: Oct 25, 11:30 AM • Adv. Malhotra</p>
                                </div>
                            </div>
                        </CommandItem>
                    </CommandGroup>
                    <div className="p-2 border-t flex justify-between items-center bg-gray-50/50">
                        <span className="text-xs text-muted-foreground">Press <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">Esc</kbd> to close search</span>
                        <span className="text-xs font-medium text-primary cursor-pointer hover:underline">Advanced Search</span>
                    </div>
                </CommandList>
            </CommandDialog>
        </>
    )
}

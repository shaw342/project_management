"use client"

import NoteForm from "@/components/noteForm"
import { TabsContent,Tabs,TabsTrigger ,TabsList} from "@/components/ui/tabs"



export default function createNote() {

    return (
            <div className="w-[100%]">
                <Tabs>
                    <TabsList>
                    <TabsTrigger value="Create Note">
                        Create Note
                    </TabsTrigger >
                    <TabsTrigger value="All Notes">
                        All Notes
                    </TabsTrigger>
                    </TabsList>
                    <TabsContent value="Create Note">
                    <NoteForm/>
                    </TabsContent>
                    <TabsContent value="All Notes">
                        all Notes
                    </TabsContent>
                </Tabs>
            </div>
        )
}
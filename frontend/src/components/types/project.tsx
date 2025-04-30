export interface Project{
    id: string
    name:string
    description:string
    startDate: Date
    status:"Not Started" | "In Progress" | "Completed" | "On Hold"
    endDate:Date 
    manager: string
}



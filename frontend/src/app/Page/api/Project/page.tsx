import React  from "react";

export default function Project() {
    let numberProject = ["hello world project","blueberry","hello"]
    return(
        <div id="container" className="w-[100%] h-[100vh]">
            {numberProject.map(project => (
                <div className="w-[200px] h-[200px] border border-slate-950 grid grid-rows-5 grid-flow-col gap-y-4-4 place-content-stretch ">{project}</div>
            ))}
        </div>
        )
}

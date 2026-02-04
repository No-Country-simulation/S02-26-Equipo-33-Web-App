import { ApiResponse } from "@/types"
import { FC } from "react"

interface RenderDataProps {
    res: ApiResponse
}

const RenderData: FC<RenderDataProps> = (props) => {
    const { res } = props
    const { success, message, data } = res
    return (
        <div>
            <p>{success}</p>
            <p>{message}</p>
            <h1> { data.team }</h1>
            <h2> { data.status } </h2>
        </div>
    )
}
export default RenderData
import { ApiResponse } from "@/types";
import RenderData from "./RenderData";


export default async function GetServerData() {
  const response = await fetch( 'http://localhost:8031/test', {
    next: { revalidate: 5 }, // Revalida cada x segundos
  })
  if (!response.ok) {
    return <p>{response.statusText} </p>
  }
  const apiResponse: ApiResponse = await response.json()
  return  <RenderData res={apiResponse} />
}

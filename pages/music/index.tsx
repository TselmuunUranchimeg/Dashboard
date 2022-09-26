import Sidebar from "../../components/sidebar/sidebar"
import { Page } from "../../types/page.types"

const Music: Page = () => {
    return (
        <div className = "w-100 h-100 flex items-center justify-center">
            <h1>Coming soon</h1>
        </div>
    )
}

Music.getLayout = (page) => {
    return (
        <Sidebar>
            {page}
        </Sidebar>
    )
}

export default Music;
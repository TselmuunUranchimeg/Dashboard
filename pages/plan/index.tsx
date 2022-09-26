import { Page } from "../../types/page.types";
import Sidebar from "../../components/sidebar/sidebar";

const Planning: Page = () => {
    return (
        <div className = "flex w-100 h-100 items-center justify-center">
            <h1>Coming soon</h1>
        </div>
    )
}

Planning.getLayout = (page) => {
    return (
        <Sidebar>
            {page}
        </Sidebar>
    )
}

export default Planning;
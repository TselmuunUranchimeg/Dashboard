import { useState } from "react";
import Head from "next/head";
import { Page } from "../../types/page.types";
import Sidebar from "../../components/sidebar/sidebar";
import { WorkoutForm } from "../../components/form/form";
import { Exercise } from "../../types/general.types";

const WorkoutCreatePage: Page = () => {
    const [name, setName] = useState("");
    const [inputs, setInputFields] = useState<Array<Exercise>>([{
        exerciseName: "",
        requirement: 0
    }]);

    return (
        <div className = "h-full w-full box-border p-10">
            <Head>
                <title>Create workout routine</title>
            </Head>
            <WorkoutForm 
                name = {name}
                setName = {setName}
                destination = "/api/workout"
                callbackUrl = "/workout"
                inputs = {inputs}
                setInputFields = {setInputFields}
                method = "POST"
            />
        </div>
    );
};

WorkoutCreatePage.getLayout = (page) => {
    return <Sidebar>{page}</Sidebar>;
};

export default WorkoutCreatePage;

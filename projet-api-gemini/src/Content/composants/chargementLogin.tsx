import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRobot } from "@fortawesome/free-solid-svg-icons"
import { type JSX } from "react"

const loadingHome = ():JSX.Element =>{

    return(
        <div className="w-full h-auto flex item-center justify-center gap-x-3">
            <FontAwesomeIcon 
                icon={faRobot}
                className="text-4xl sm:text-6xl text-color4 bounce-spin-faster"
            />
        </div>
    )
}

export default loadingHome;
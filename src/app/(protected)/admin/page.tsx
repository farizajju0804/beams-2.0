"use client"

import { useCurrentRole } from "@/hooks/use-current-role"


const Adminpage = () => {
    const role = useCurrentRole()
  return (
    <div>
        current role : {role}
    </div>
  )
}

export default Adminpage
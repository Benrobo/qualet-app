import React from 'react'
import { Layout } from '../components'
import {
    Button
} from "../components/UI-COMP";

const userInfo = localStorage.getItem("qualet") === null ? null : JSON.parse(localStorage.getItem("qualet"))

function Settings() {
    return (
        <Layout sideBarActiveName="settings">
            <div className="relative  flex flex-row items-center justify-center w-full h-screen">
                <div className="w-[350px] h-auto p-5 rounded-md bg-white-100 shadow-lg flex flex-col items-center justify-center gap-6">
                    <img className=' w-[150px] rounded-[50%] bg-dark-100 ' src={`https://avatars.dicebear.com/api/micah/${userInfo?.username}.svg`} />
                    <p className="text-dark-100 font-sans font-extrabold text-[25px] capitalize ">{userInfo?.username}</p>
                    <p className="text-dark-100 font-extrabold text-[15px] ">{userInfo?.email}</p>
                    <div className="w-full flex flex-row items-center justify-between bg-dark-100 rounded-md overflow-hidden ">
                        <div id="left" className=' w-[120px] text-[12px] bg-dark-200 text-white-100 p-5 '>
                            OrganizationID
                        </div>
                        <div id="left" className=' w-[120px] text-[17px] text-white-100 '>
                            {userInfo?.orgId}
                        </div>
                    </div>
                    <Button type="danger" long={true} text={'Logout'} onClick={() => {
                        localStorage.clear()
                        window.location.reload()
                    }} />
                </div>
            </div>
        </Layout>
    )
}

export default Settings
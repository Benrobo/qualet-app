import React, { useState, useContext, useEffect } from 'react'
import { Layout, DomHead, NavBar } from "../components";
import SideBar from '../components/Navbar/SideBar';
import DataContext from '../context/DataContext';
import { Notification } from '../helpers';
import moment from "moment"
import API_ROUTES from '../config/apiRoutes';
import Fetch from '../helpers/fetch';

const notif = new Notification(5000)

const userInfo = localStorage.getItem("qualet") === null ? null : JSON.parse(localStorage.getItem("qualet"))


function Dashboard() {
    const { isAuthenticated } = useContext(DataContext)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [transactions, setTransactions] = useState([])

    useEffect(() => {
        getAllTransactions()
    }, [])

    async function getAllTransactions() {

        try {
            setLoading(true);
            const { res, data } = await Fetch(API_ROUTES.getTransaction, {
                method: "POST",
                body: JSON.stringify({
                    orgId: userInfo?.orgId,
                    userId: userInfo?.id
                })
            })
            setLoading(false);

            if (data.success === false) {
                setError(data.message)
                return notif.error(data?.message)
            }

            const { transactions } = data.data;
            setTransactions(transactions)
        } catch (e) {
            setLoading(false)
            setError(e.message)
        }

    }

    function filterTransactionsData(state = "approved") {
        return transactions.length === 0 ? 0 : transactions.filter(tran => tran.status === state).map(transaction => transaction.totalAmount).length === 0 ? 0 : transactions.filter(tran => tran.status === "pending").map(transaction => transaction.totalAmount).reduce((total, tran) => total += parseInt(tran), 0);
    }

    // Approved BALANCE
    const totalApprovedBalance = filterTransactionsData("approved")
    // PENDING
    const totalPendingBalance = filterTransactionsData("pending")
    //DENIED
    const totalDeniedTransactions = transactions.filter(tran => tran.status === "denied").length

    console.log(totalApprovedBalance, totalPendingBalance);

    return (
        <Layout sideBarActiveName="dashboard">
            <div className="relative  flex flex-col items-start justify-start w-full h-screen">
                <div id="head" className="p-5 w-full border-b-[.8px] border-solid border-b-white-300 flex flex-row items-center justify-between gap-10 ">
                    <div className="w-auto ml-5">
                        <p className="text-dark-300 text-[30px] ">Welcome Back</p>
                        <p className="text-white-400 text-[20px] font-bold capitalize ">{userInfo?.username}</p>
                    </div>
                    <div className="w-auto mr-10">
                        <p className="text-dark-300 text-[30px] ">Balance</p>
                        {/* <br /> */}
                        <p className="text-dark-100 text-[35px] font-extrabold ">
                            {loading ? <span className="text-dark-100 text-[12px]">Loading...</span> : <span className="text-dark-200 text-[20px] ">NGN <span className="text-dark-100 text-[35px] font-extrabold ">{totalApprovedBalance}</span> </span>}
                        </p>
                    </div>
                </div>
                <br />
                <div className="w-full h-auto flex items-start justify-start gap-10 px-4">
                    <div id="cards" className="w-[300px] h-[180px] p-5 rounded-md bg-dark-100 ">
                        <p className="text-white-200 font-extrabold">Balance</p>
                        <small className='text-white-200'>Total Balance</small>
                        <br />
                        <br />
                        <p className="text-white-100 text-[40px] font-extrabold ">
                            {loading ? <span className="text-white-100 text-[12px]">Loading...</span> : <span className="text-white-200 text-[15px] ">NGN <span className="text-white-100 text-[25px] font-extrabold ">{totalApprovedBalance}</span> </span>}
                        </p>
                    </div>
                    <div id="cards" className="w-[300px] h-[180px] p-5 rounded-md border-[2px] border-solid border-white-400 ">
                        <p className="text-dark-200 font-extrabold">Pending Balance</p>
                        <small className='text-dark-200'>Total Pending Balance</small>
                        <br />
                        <br />
                        <p className="text-dark-100 text-[40px] font-extrabold ">
                            {loading ? <span className="text-dark-100 text-[12px]">Loading...</span> : <span className="text-dark-200 text-[15px] ">NGN <span className="text-dark-100 text-[25px] font-extrabold ">{totalPendingBalance}</span> </span>}
                        </p>
                    </div>
                    <div id="cards" className="w-[300px] h-[180px] p-5 rounded-md border-[2px] border-solid border-white-400 ">
                        <p className="text-dark-200 font-extrabold">Denied Payments</p>
                        <small className="text-dark-100">Total Denied Transactions.</small>
                        <br />
                        <br />
                        <p className="text-dark-100 text-[40px] font-extrabold ">
                            {loading ? <span className="text-dark-100 text-[12px]">Loading...</span> : <span className="text-dark-200 text-[15px] ">NGN <span className="text-dark-100 text-[25px] font-extrabold ">{totalDeniedTransactions}</span> </span>}
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Dashboard

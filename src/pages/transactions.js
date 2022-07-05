import React, { useEffect, useState } from "react";
import { Layout } from "../components";
import {
  Button,
  Input,
  PendingState,
  SelectInput,
} from "../components/UI-COMP";
import API_ROUTES from "../config/apiRoutes";
import Fetch from "../helpers/fetch";
import { Notification } from "../helpers/"
import { Link } from "react-router-dom";
import { useParams } from "react-router"


const notif = new Notification(5000)

const userInfo = localStorage.getItem("qualet") === null ? null : JSON.parse(localStorage.getItem("qualet"))

function Transactions() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [transactions, setTransactions] = useState([])

  const { trackingId } = useParams()


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

  return (
    <Layout sideBarActiveName="transactions">
      <div className="relative  flex flex-col items-start justify-start w-full h-screen">
        {
          loading ?
            <div className="w-full h-[300px] text-center flex flex-col items-center justify-center">
              <p className="text-dark-100 font-extrabold text-[20px] ">Loading...</p>
              <p className="text-dark-100 text-[15px] ">Fetching all Transactions..</p>
            </div>
            :
            error !== null ?
              <div className="w-full h-[300px] text-center flex flex-col items-center justify-center">
                <p className="text-dark-100 font-extrabold text-[20px] ">{error}</p>
              </div>
              :
              <>
                {
                  typeof trackingId === "undefined" ? <TransactionsDetails transactions={transactions} /> : <VerifyTransaction />
                }
              </>
        }
      </div>
    </Layout>
  );
}

export default Transactions;

function TransactionsDetails({ transactions }) {

  const totalAmountTransactions = transactions.map(transaction => transaction.totalAmount).reduce((total, tran) => total += parseInt(tran), 0);

  return (
    <div className="w-full h-auto ">
      <div id="head" className="w-full h-auto">
        <br />
        <br />
        <div class="flex flex-row justify-between pb-5 px-5 mt-5 border-b border-gray-550">
          <div>
            <div class="font-semibold text-[25px] text-gray-650">
              <span class="text-med">NGN</span> {totalAmountTransactions}
            </div>
            <div class="text-gray-600 font-bold lg:mt-2 text-med">
              Total transaction
            </div>
          </div>
        </div>
      </div>
      <br />
      <div className="p-5 w-full">
        {
          transactions.length === 0 ?
            <div className="w-full h-[300px] text-center flex flex-col items-center justify-center">
              <p className="text-dark-100 font-extrabold text-[20px] ">No Transactions Available..</p>
              <p className="text-dark-100 text-[15px] ">Products Transactions would show here.</p>
            </div>
            :
            <>
              <table className="w-full table table-auto">
                <thead className="w-full bg-dark-300">
                  <tr className="">
                    <th className="text-white-100 px-4 py-3 text-left th font-extrabold ">
                      TRANSACTION DATE
                    </th>
                    <th className="text-white-100 px-4 py-3 text-left th font-extrabold ">
                      Name
                    </th>
                    <th className="text-white-100 px-4 py-3 text-left th font-extrabold ">
                      Email
                    </th>
                    <th className="text-white-100 px-4 py-3 text-left th font-extrabold ">
                      PHONE NUMBER
                    </th>
                    <th className="text-white-100 px-4 py-3 text-left th font-extrabold ">
                      AMOUNT
                    </th>
                    <th className="text-white-100 px-4 py-3 text-left th font-extrabold ">
                      Status
                    </th>
                    <th className="text-white-100 px-4 py-3 text-left th font-extrabold ">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="w-full">
                  {
                    transactions.map((data) => (
                      <tr className="bg-white-300" key={data.id}>

                        <td className="text-dark-300 px-4 text-sm py-3 td-left font-bold">
                          {data?.createdAt}
                        </td>
                        <td className="text-dark-300 px-4 text-sm py-3 td-left font-bold">
                          <p className="text-dark-100 font-extrabold">{data?.username}</p>
                        </td>
                        <td className="text-dark-300 px-4 text-sm py-3 td-left font-bold">
                          <p className="text-dark-100 font-extrabold">{data?.email}</p>
                        </td>
                        <td className="text-dark-300 px-4 text-sm py-3 td-left font-bold">
                          {data?.phonenumber}
                        </td>
                        <td className="text-dark-300 px-4 text-sm py-3 td-left font-bold">
                          <p className="text-dark-100 font-extrabold">${data?.totalAmount}</p>
                        </td>
                        <td className="text-dark-300 px-4 text-sm py-3 td-left font-bold">
                          <PendingState state={data?.status === "pending" ? "pending" : data?.status === "denied" ? "rejected" : data?.status === "approved" ? "approved" : ""} />
                        </td>
                        <td className="text-dark-300 px-4 text-sm py-3 td-left font-bold">
                          <Link to={`/transactions/verify/${data?.transactionId}`}>
                            <button className="px-4 py-2 bg-dark-100 text-white-100 rounded-md scale-[.70] ">
                              View More
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </>

        }
      </div>
    </div>
  );
}

function VerifyTransaction() {

  return (
    <div className="w-full h-auto">
      <div id="head" className="w-full">

      </div>
    </div>
  )
}

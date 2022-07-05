import React, { useState, useEffect } from "react";
import { IoIosCart, IoIosWallet, IoIosQrScanner, IoIosCheckmark } from "react-icons/io";
import Fetch from "../helpers/fetch"
import prodImg from "../assets/img/ecc.jpg";
import { Button, Input } from "../components/UI-COMP";
import { useParams } from "react-router";
import API_ROUTES from "../config/apiRoutes";
import { Notification } from "../helpers/"
import QRCode from "react-qr-code";

const notif = new Notification(5000)


const isPurchased = localStorage.getItem("qualet-isProductPurchased") === null ? null : JSON.parse(localStorage.getItem("qualet-isProductPurchased"))

const productTrackingId = localStorage.getItem("qualet-trackingId") === null ? null : localStorage.getItem("qualet-trackingId")

// create cart storage
if (localStorage.getItem("qualet-cart") === null) {
  localStorage.setItem("qualet-cart", JSON.stringify({ items: [] }))
}

// create isProductPurchase
if (localStorage.getItem("qualet-isProductPurchased") === null) {
  localStorage.setItem("qualet-isProductPurchased", JSON.stringify(null))
}

// create trackingID storage
if (localStorage.getItem("qualet-trackingId") === null) {
  localStorage.setItem("qualet-trackingId", JSON.stringify(null))
}



const sleep = (sec) => new Promise((res, rej) => setTimeout(res, sec * 1000))

const genId = (count = 5) => {
  let alph = "abcdefghijklmnopq1234567890".split("");
  let id = "";
  for (let i = 0; i < count; i++) {
    let rand = Math.floor(Math.random() * alph.length);
    id += alph[rand]
  }
  return id;
}

// change active in search params
function changeLocation(active) {
  let { origin, pathname } = window.location;
  let newUrl = `${origin}${pathname}?active=${active}`
  return newUrl
}

function Scanner() {

  const { search } = window.location;
  const activePage =
    search === "" ? "scanner" : search.replace("?", "").split("=")[1];

  const style1 =
    activePage === "scanner"
      ? "bg-dark-100 text-white-100"
      : "bg-white-300 text-dark-100 ";
  const style2 =
    activePage === "cart"
      ? "bg-dark-100 text-white-100"
      : "bg-white-300 text-dark-100 ";
  const style3 =
    activePage === "payment"
      ? "bg-dark-100 text-white-100"
      : "bg-white-300 text-dark-100 ";

  const iconStyle =
    activePage === "scanner"
      ? "text-white-100"
      : activePage === "cart"
        ? "text-white-100"
        : activePage === "payment"
          ? "text-white-100"
          : "";

  const navigate = (active = "scanner") =>
    (window.location = `/scanner?active=${active}`);

  return (
    <div className="w-screen h-screen overflow-hidden bg-dark-100 ">
      <div className="w-full md:w-[70vmin] h-screen m-auto relative bg-dark-200 ">
        <div id="head" className="w-full h-auto px-5 py-2 absolute top-2 ">
          <p className="text-white-200 text-[15px] text-center font-extrabold ">
            Quallet Scanner
          </p>
        </div>
        {/* body */}
        <br />
        <div id="quarlet-scanner-body" className="w-full h-full overflow-y-scroll ">
          {activePage === "scanner" && <ScannerSection />}
          {activePage === "cart" && <CartSection />}
          {activePage === "payment" && <PaymentSection />}
        </div>
        {/* bottom navbar */}
        <div
          id="navbar-bottom"
          className="w-full h-auto py-2 px-[50px] bg-dark-300 absolute bottom-0 left-0 flex flex-row items-center justify-center gap-1 md:px-[10px] "
        >
          <button
            className={`px-5 py-3 cursor-pointer transition-all hover:scale-[.85] flex flex-row items-center justify-start rounded-[30px] ${style1} font-extrabold  scale-[.75]`}
            onClick={() => navigate("scanner")}
          >
            <IoIosQrScanner
              className={`mr-2 text-[20px] text-dark-100 ${iconStyle}`}
            />
            Scanner
          </button>
          <button
            className={`px-5 py-3 cursor-pointer transition-all hover:scale-[.85] flex flex-row items-center justify-start rounded-[30px] ${style2} text-dark-100 font-extrabold scale-[.75] `}
            onClick={() => navigate("cart")}
          >
            <IoIosCart className={`mr-2 text-[20px] text-dark-100 ${iconStyle} `} /> Cart
          </button>
          <button
            className={`px-5 py-3 cursor-pointer transition-all hover:scale-[.85] flex flex-row items-center justify-start rounded-[30px] ${style3} font-extrabold scale-[.75] `}
            onClick={() => navigate("payment")}
          >
            <IoIosWallet className={`mr-2 text-[20px] text-dark-100 ${iconStyle} `} /> Payment
          </button>
        </div>
      </div>
    </div>
  );
}

export default Scanner;

function ProductPreview({ data, deleteproductData }) {

  const [productInfo, setProductInfo] = useState({
    price: data?.price,
    name: data?.title,
    description: data?.description,
    image: data?.image,
    orgId: data?.orgId,
    productId: data.id,
    currency: data?.currency,
    quantity: 1
  })
  const [quantity, setQuantity] = useState(1)
  const [cartAdded, setCartAdded] = useState(false);

  const imageStyle = {
    backgroundImage: `url("${productInfo.image}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  const incQty = () => setQuantity((prev) => (prev += 1))
  const decQty = () => setQuantity((prev) => (prev <= 1 ? prev = 1 : prev -= 1))

  const closeModal = async () => {
    const confirm = window.confirm("Are you sure about this?")
    if (!confirm) return;
    deleteproductData()
    await sleep(1)
    window.location.reload()
  }

  if (cartAdded) {
    setTimeout(() => {
      setCartAdded(false)
    }, 2000)
  }


  const addToCart = async () => {
    const cartDB = localStorage.getItem("qualet-cart") === null ? null : JSON.parse(localStorage.getItem("qualet-cart"));
    let item = cartDB === null ? null : cartDB?.items;
    const newProd = { ...productInfo, quantity, id: genId(5) };
    const fullItem = [...item, newProd]
    item = fullItem;
    localStorage.setItem("qualet-cart", JSON.stringify({ items: item }))
    setCartAdded(true)
    await sleep(1)
    setCartAdded(false)
    window.location = changeLocation("cart");
  }

  return (
    <div className="w-full h-screen absolute top-0 left-0 bg-dark-500 z-[100]">
      <div
        id="head"
        className="w-full h-auto p-3 flex flex-row items-start justify-start"
      >
        <button className="btn bg-dark-200 text-white-100 rounded-md scale-[.75] " onClick={closeModal}>
          Back
        </button>
      </div>
      <br />
      <div
        id="product-cont"
        className="w-full px-6 py-3 h-auto flex flex-col items-center justify-center"
      >
        <div
          id="img"
          className="w-full h-[300px] rounded-md "
          style={imageStyle}
        ></div>
        <br />
        <div className="w-full h-auto flex flex-row items-center justify-between">
          <div
            id="left"
            className="w-auto flex flex-col items-start justify-start"
          >
            <p className="text-white-100 font-extrabold text-[20px] capitalize ">
              {productInfo.title}
              <br />
              {productInfo.currency} {productInfo.price}
            </p>
            <p className="text-white-200 font-extrabold text-[15px] ">
              {productInfo.description}
            </p>
          </div>
          <div
            id="right"
            className="w-auto flex flex-row items-center justify-center gap-5 px-3"
          >

            <button className="px-3 bg-dark-200 rounded-md py-1 text-white-100 text-[20px]" onClick={decQty}>
              -
            </button>
            <p className="text-white-100 font-extrabold text-[20px] "> {quantity}</p>
            <button className="px-3 bg-dark-200 rounded-md py-1 text-white-100 text-[20px]" onClick={incQty}>
              +
            </button>
          </div>
        </div>
        <br />
        <button
          className={`px-5 py-4 w-full cursor-pointer transition-all hover:scale-[.85] flex flex-row items-center justify-center rounded-[30px] text-center bg-dark-100 ${cartAdded ? "text-green-400" : "text-white-100"} font-extrabold`}
          onClick={addToCart}
        >

          {cartAdded ? <IoIosCheckmark className={`mr-2 text-[25px] text-green-400`} /> : <IoIosCart className={`mr-2 text-[20px] text-white-100`} />}
          {cartAdded ? "Item Added To Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

function ScannerSection() {

  const [productParams, setProductParam] = useState({
    productId: undefined,
    orgId: undefined
  })

  let { productId, orgId } = useParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [productData, setProdData] = useState({})
  const [timer, setTimer] = useState(0)

  useEffect(() => {
    if (productId !== undefined && orgId !== undefined) {
      getProductById(productId, orgId)
    }
  }, [])

  useEffect(() => {
    if (productParams.productId !== undefined && productParams.orgId !== undefined) {
      const { productId, orgId } = productParams
      getProductById(productId, orgId)
    }
  }, [productParams.orgId, productParams.productId])

  const videoElement = document.querySelector("#qrcode-scanner")

  function handleQRCodeReader(result, error) {
    if (!!error) {
      // setError("Something went wrong scanning QR CODE. Try again.!!")
      // console.error("Something went wrong scanning QR CODE. Try again.!!");
    }

    const checkProductIdIsUndefined = (productId === undefined && orgId === undefined)

    if (checkProductIdIsUndefined) {
      if (result?.text !== undefined) {
        const params = checkProductIdIsUndefined ? new URL(result?.text).pathname.split("/").slice(2, 4) : new URL(window.location.href).pathname.split("/").slice(2, 4);
        const prodId = params[1]
        const orgId = params[0]

        // videoElement.setAttribute("autoplay", false);
        // videoElement.setAttribute("hidden", true);
        return setProductParam((prev) => ({ ...prev, ["productId"]: prodId, ["orgId"]: orgId }))
      }
    }
  }

  async function getProductById(productId, orgId) {
    try {
      setLoading(true)
      const body = JSON.stringify({ productId })
      const { res, data } = await Fetch(API_ROUTES.getProductById, {
        method: "POST",
        body
      })
      setLoading(false);
      if (data && data.status === 400) {
        console.error(data.message)
        return notif.error(`Something went wrong fetching product. ${data.message}`)
      }

      if (data && data.status === 404) {
        notif.error("Oops, looks like this product no longer exists.")
        await sleep(4)
        const { origin } = window.location;
        return window.location = `${origin}/scanner`
      }

      // console.log(data);
      if (Object.entries(data.data).length > 0) {
        setProdData(data?.data[0])
        setProductParam((prev) => ({ ...prev, ["productId"]: undefined, ["orgId"]: undefined }))
        return
      }
      setProdData({})
    } catch (e) {
      setLoading(false);
      notif.error(`Something went wrong fetching product. ${e?.message}`)
      setError(`Something went wrong fetching product. ${e.message}`)
      throw new Error(e)
    }
  }

  const deleteproductData = () => setProdData({})

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-9">
      <div
        id="scanner-screen"
        className="w-full h-auto bg-dark-400 text-center p-5 flex flex-col  rounded-md "
      >
        {/* This would be made posible later */}
        {/* <QrReader
          onResult={(result, error) => handleQRCodeReader(result, error)}
          constraints={{ facingMode: "environment" }}
          videoId="qrcode-scanner"
          scanDelay={500}
          style={{ width: "100%" }}
        /> */}
        <p className="text-white-100 text-[20px] font-extrabold">Qualet  Scanner</p>
        <br />
        <p className="text-white-200 text-[15px] font-extrabold">COMING SOON!!!</p>
      </div>
      <br />
      {Object.entries(productData).length > 0 && <div className="w-full h-screen flex flex-col items-center justify-center absolute p-5 text-center top-0 left-0 bg-dark-500 z-[100]">
        {
          loading ?
            <div className="w-full h-screen flex flex-col items-center justify-center">
              <p className="text-white-100 font-extrabold text-[20px]">Loading...</p>
              <p className="text-white-100 text-[15px] ">Fetching Product Details</p>
            </div>
            :
            Object.entries(productData).length > 0 && <ProductPreview data={productData} deleteproductData={deleteproductData} />
        }
      </div>}
      {/* <div className="w-full h-auto flex items-center justify-center flex-col">
        <button
          className={`px-5 py-4 cursor-pointer transition-all hover:scale-[.85] flex flex-row items-center justify-start rounded-[30px] bg-dark-100 text-white-100 font-extrabold  scale-[.75]`}
          onClick={""}
        >
          <IoIosQrScanner className={`mr-2 text-[20px] text-white-100`} />
          Start Scanning
        </button>
      </div> */}
    </div>
  );
}

function CartSection() {

  const cartItems = JSON.parse(localStorage.getItem("qualet-cart")).items;

  const [total, setTotal] = useState(0)


  useEffect(() => {
    calcProductTotal()
  }, [])

  function calcProductTotal() {
    if (cartItems.length > 0) {
      let total = cartItems.map((item) => {
        return parseInt(item.price) * parseInt(item.quantity)
      }).reduce((total, price) => total + price)

      setTotal(total)
    }
  }


  const deleteCartItem = async (e) => {
    let dataset = e.target.dataset;
    if (Object.entries(dataset).length > 0) {
      const { id } = dataset;
      const filteredData = cartItems.filter(items => items.id !== id);
      localStorage.setItem("qualet-cart", JSON.stringify({ items: filteredData }))
      notif.success("Item removed")
      await sleep(1)
      window.location.reload()
    }
  }

  return (
    <div className="w-full h-auto flex flex-col items-center justify-center p-3">
      <br />
      <div className="w-full h-auto">
        {
          cartItems.length > 0 ?
            cartItems.map((item) => {
              return (
                <div className="w-full h-auto p-3 flex flex-row items-center justify-between gap-5 mt-3 bg-dark-100 ">
                  <img src={item?.image} alt="" className=" w-[50px] rounded-sm " />
                  <p className="text-white-100 font-extrabold">
                    <span id="price" className="mr-2 ml-1">
                      {item?.currency} {item?.price}
                    </span>
                    <span id="price" className="mr-2 ml-1 text-white-300 font-light">
                      (x {item?.quantity})
                    </span>
                  </p>
                  <button
                    className={`px-5 py-3 cursor-pointer transition-all hover:scale-[.85] flex flex-row items-center justify-start rounded-[30px] bg-red-200 text-white-100 font-extrabold scale-[.65] `}
                    onClick={deleteCartItem}
                    data-id={item?.id}
                  >
                    Delete
                  </button>
                </div>
              )
            })
            :
            <div className="w-full h-[350px] flex flex-col items-center justify-center">
              <p className="text-white-100 text-center font-extrabold">No Items In Cart</p>
            </div>
        }

      </div>
      <br />
      <div className="w-full h-auto flex flex-row items-center justify-between">
        <div id="total" className="w-auto flex">
          {total > 0 && <p className="text-white-200 text-[25px]  ">TOTAL:</p>}
          {total > 0 && <p className="ml-2 text-white-100 text-[25px] font-extrabold ">
            {total}
          </p>}
        </div>
      </div>
      <br />
      <br />
      {total > 0 && <button
        className={`px-5 py-4 w-full cursor-pointer transition-all hover:scale-[.85] flex flex-row items-center justify-center rounded-[30px] text-center bg-dark-100 text-white-100 font-extrabold`}
        onClick={() => window.location = changeLocation("payment")}
      >
        <IoIosWallet className={`mr-2 text-[20px] text-white-100`} />
        Checkout & Pay
      </button>}
    </div>
  );
}

function PaymentSection() {
  const cartItems = JSON.parse(localStorage.getItem("qualet-cart")).items;
  const { pathname } = window.location;

  const [total, setTotal] = useState(0)
  const [steps, setSteps] = useState(1)
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    phonenumber: "",
    cardNumber: "",
    cardExp: "",
    cardCvv: ""
  })
  const [loading, setLoading] = useState(false)
  const [paymentResult, setPaymentResult] = useState({})

  let elements;

  useEffect(() => {
    calcProductTotal()
  }, [])

  function calcProductTotal() {
    if (cartItems.length > 0) {
      let total = cartItems.map((item) => {
        return parseInt(item.price) * parseInt(item.quantity)
      }).reduce((total, price) => total + price)

      setTotal(total)
    }
  }

  function nextStep() {
    const { username, email, phonenumber, cardNumber, cardCvv, cardExp } = inputs;
    if (steps === 1 && (username === "" || email === "" || phonenumber === "")) {
      console.log(steps);
      return notif.error("Missing some fields.")
    }
    if (steps === 2 && (cardNumber === "" || cardCvv === "" || cardExp === "")) {
      return notif.error("Missing some fields.")
    }
    setSteps((prev) => (prev > 3 ? prev = 3 : prev += 1))
  }

  let prevStep = () => setSteps((prev) => (prev < 1 ? prev = 1 : prev -= 1))

  let handleInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setInputs((prev) => ({ ...prev, [name]: value }))
  }


  async function MakePayment() {
    const { username, email, phonenumber, cardNumber, cardCvv, cardExp } = inputs;
    if (username === "" || email === "" || phonenumber === "" || cardNumber === "" || cardCvv === "" || cardExp === "") {
      return notif.error("Some inputs are empty.")
    }

    const productsPayload = []
    cartItems.map((item) => {
      productsPayload.push({ orgId: item.orgId, productId: item.productId, name: item.name, price: item.price, quantity: item.quantity })
    })
    const params = pathname.split("/").slice(2)
    const orgId = params[0]

    const bodyData = {
      ...inputs,
      orgId,
      total,
      productsPayload
    }

    try {
      setLoading(true)
      const { res, data } = await Fetch(API_ROUTES.createTransaction, {
        method: "POST",
        body: JSON.stringify(bodyData)
      })
      setLoading(false)

      if (data.success === false) {
        notif.error(data.message)
        return
      }

      const paymentDetails = data.data.savedProdTran
      localStorage.setItem("qualet-trackingId", paymentDetails?.transactionId)
      notif.success(data.message);
      localStorage.setItem("qualet-isProductPurchased", JSON.stringify(true))
      await sleep(1)
      window.location.reload()
      return
    } catch (e) {
      console.log(e);
      setLoading(false)
      notif.error("An error occured while making payment.")
    }
  }

  if (steps === 1) {
    elements = <UserInfo prev={prevStep} next={nextStep} input={inputs} handleInputs={handleInputs} />
  }
  if (steps === 2) {
    elements = <CardSection prev={prevStep} next={nextStep} input={inputs} handleInputs={handleInputs} makePayment={MakePayment} loading={loading} />
  }



  return (
    <div className="w-full h-auto flex flex-col items-center justify-center p-3">
      <br />
      <div className="w-full h-auto">
        <div id="head" className="w-full text-center flex flex-col items-center justify-center">
          <p className="text-white-100 text-[20px]  ">Organization Name</p>
          <p className="text-white-200 text-[15px]  ">Goods Purchased.</p>
          <br />
          <p className="text-white-100 font-extrabold text-[30px]  "> <span className="text-white-200 text-[15px]">NGN</span> {total} </p>
        </div>
      </div>
      <br />
      <div className="w-full h-auto flex flex-col items-center justify-center">
        {elements}
      </div>
      <PaymentAlertModal />
    </div>
  );
}

function PaymentAlertModal() {

  const [visible, setVisible] = useState(false)

  const { origin } = window.location;
  const verificationLink = `${origin}/transactions/verify/${productTrackingId}`

  const modalBoxStyle = {
    transition: "all .3s ease-in-out",
    transform: `scale(${visible ? 1 : 0})`
  }

  useEffect(() => {
    (async () => {
      await sleep(1)
      setVisible(true)
    })()
  }, [])

  return (
    <>
      {isPurchased === true && <div className="w-full h-full flex flex-col items-center justify-center bg-dark-500 absolute top-0 left-0 z-[1000] ">
        <div className="w-[350px] h-auto p-4 rounded-md bg-white-100 flex flex-col items-center justify-center" style={modalBoxStyle}>
          <div id="head" className="w-full text-center ">
            <p className="text-green-800 text-[25px] font-extrabold ">Purchased Successfull</p>
            <p className="text-dark-100 text-[15px] ">Transaction made successful.</p>
          </div>
          <div className="w-full bg-white-100 p-5 flex flex-col items-center justify-center ">
            <QRCode value={verificationLink} width={250} height={250} />
          </div>
          <h2 className={`text-red-200 font-extrabold text-[15px] text-center font-sans `}>
            Verify and Approve Your Purchased.
          </h2>
          <br />
          <Button type="secondary" text="Close" />
        </div>
      </div>}
    </>
  )
}

function UserInfo({ next, handleInputs, input }) {

  return (
    <div className="w-full flex flex-col items-center justify-between gap-7">
      <Input value={input.username} type="text" name="username" placeholder="Full Name" bgType="max" onChange={handleInputs} maxLength={200} />
      <Input value={input.email} type="email" name="email" placeholder="Email" bgType="max" onChange={handleInputs} maxLength={300} />
      <Input value={input.phonenumber} type="text" name="phonenumber" placeholder="Phonenumber" bgType="max" onChange={handleInputs} maxLength={12} />
      <Button type="secondary" text="Next" long={true} style={{ padding: "12px" }} onClick={next} />
    </div>
  )
}

function CardSection({ loading, prev, input, handleInputs, makePayment }) {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <Input value={input.cardNumber} maxLength={20} type="text" name="cardNumber" placeholder="4242-4242-4242" bgType="max" onChange={handleInputs} />
      <div className="w-full flex flex-row items-center justify-between gap-5">
        <Input value={input.cardExp} maxLength={5} type="text" name="cardExp" placeholder="09/22" bgType="max" onChange={handleInputs} />
        <Input value={input.cardCvv} maxLength={3} type="text" name="cardCvv" placeholder="838" bgType="max" onChange={handleInputs} />
      </div>
      <br />
      <div className="w-full flex flex-row items-center justify-between gap-5">
        <Button type="secondary" text="Prev Step" long={false} style={{ padding: "12px" }} onClick={prev} />
      </div>
      <br />
      <Button type="secondary" text={loading ? "Loading...." : "Make Payment"} long={true} style={{ padding: "12px" }} onClick={makePayment} />
    </div>
  )
}
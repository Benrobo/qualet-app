import React, { useEffect, useRef, useState } from "react";
import { Layout } from "../components";
import { Button, Input, StarRate } from "../components/UI-COMP";
import {
    IoIosCall,
    IoLogoFacebook,
    IoMdHeartEmpty,
    IoIosCart,
    IoIosTrash,
    IoIosPrint,
    IoIosDownload,
    IoIosCopy,
} from "react-icons/io";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import QRCode from "react-qr-code";
import { Notification } from "../helpers"
import prodImg from "../assets/img/ecc.jpg";
import API_ROUTES from "../config/apiRoutes";
import Fetch from "../helpers/fetch";


const notif = new Notification(5000)

const userInfo = localStorage.getItem("qualet") === null ? "" : JSON.parse(localStorage.getItem("qualet"))

function Products() {
    const [activeProduct, setActiveProduct] = useState(false);
    const [activeAddProduct, setActiveAddProduct] = useState(false);
    const [productType, setProductType] = useState("add");
    const [selectedProduct, setSelectedProduct] = useState({});
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null);
    const [productsData, setProductsData] = useState([])


    const closeSelectedProductModal = () => setActiveProduct(!activeProduct)

    const toggleProductModal = (e) => {
        const dataset = e.target.dataset;
        if (Object.entries(dataset).length > 0) {
            const { id } = dataset;
            const filteredData = productsData.filter(products => products.id === id)[0];
            setActiveProduct(!activeProduct);
            setSelectedProduct(filteredData)
        }
    };

    const openAddProductModal = (action = "add", e) => {
        if (action === "edit") {
            const dataset = e.target.dataset;
            if (Object.entries(dataset).length > 0) {
                const { id } = dataset;
                const filteredData = productsData.filter(products => products.id === id)[0];
                setSelectedProduct(filteredData)
                setActiveAddProduct(true);
                setProductType(action);
            }
            return;
        }
        setActiveAddProduct(true);
    };

    const closeAddProductModal = () => {
        setActiveAddProduct(false);
    };


    useEffect(() => {
        getProducts()
        console.log(productsData);
    }, [])

    async function getProducts() {
        try {
            setLoading(true)
            // const body = JSON.stringify({ orgId: userInfo?.orgId })
            const { res, data } = await Fetch(API_ROUTES.getProductByOrgId, {
                method: "POST",
                body: JSON.stringify({ orgId: userInfo?.orgId })
            })
            setLoading(false);

            if (data && data.status === 400) {
                notif.error(`Something went wrong fetching product. ${data.message}`)
                setError(`Something went wrong fetching product. ${data.message}`)
                throw new Error(data.message)
            }

            const { products, organization } = data.data;
            console.log(products);
            setProductsData(products)
        } catch (e) {
            setLoading(false);
            notif.error(`Something went wrong fetching product. ${e.message}`)
            setError(`Something went wrong fetching product. ${e.message}`)
            throw new Error(e.message)
        }
    }

    return (
        <Layout sideBarActiveName="products">
            <div className="relative  w-full h-screen overflow-y-scroll">
                <div
                    id="head"
                    className="w-full h-auto px-4 py-2 mt-5 flex flex-row items-start justify-between"
                >
                    <p className="text-dark-100 text-[20px] font-extrabold ">
                        Your Products
                    </p>

                    <Button
                        text="Add Products"
                        type="secondary"
                        onClick={() => openAddProductModal("add")}
                    />
                </div>

                <br />
                <div className="w-full  flex flex-wrap items-center justify-start gap-5 p-5">
                    {
                        loading ?
                            <div className="w-full h-[300px] text-center flex flex-col justify-center">
                                <p className="text-dark-100 font-extrabold text-[20px] ">Loading...</p>
                                <p className="text-dark-100 font-extrabold text-[15px] ">Fetching Products...</p>
                            </div>
                            :
                            error !== null ?
                                <div className="w-full h-[300px] text-center flex flex-col justify-center">
                                    <p className="text-dark-100 font-extrabold text-[20px] ">{error}</p>
                                </div>
                                :
                                productsData.length === 0 ?
                                    <div className="w-full h-[300px] text-center flex flex-col justify-center">
                                        <p className="text-dark-100 font-extrabold text-[20px] ">No Products Avaliable.</p>
                                    </div>
                                    :
                                    productsData.map((list, i) => (
                                        <>
                                            <ProductCards
                                                toggleProductModal={toggleProductModal}
                                                closeForm={closeAddProductModal}
                                                openForm={openAddProductModal}
                                                list={list}
                                            />
                                        </>
                                    ))}
                </div>

                {activeProduct && (
                    <SelectedProduct
                        activeProduct={activeProduct}
                        data={selectedProduct}
                        closeSelectedProductModal={closeSelectedProductModal}

                    />
                )}

                {activeAddProduct && (
                    <AddProducts
                        type={productType}
                        data={selectedProduct}
                        closeForm={closeAddProductModal}
                    />
                )}

                <br />
                <br />
                <br />
            </div>
        </Layout>
    );
}

export default Products;

function AddProducts({ data, closeForm, type }) {

    const [loading, setLoading] = useState(false)
    const [inputs, setInputs] = useState({
        name: data.title === undefined ? "" : data?.title,
        description: data.description === undefined ? "" : data?.description,
        price: data.price === undefined ? "" : data?.price,
        category: data.categories === undefined ? "" : data?.categories,
        currency: data.currency === undefined ? "" : data?.currency,
        image: data.image === undefined ? "" : data?.image,
    })


    const handleTextInputs = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setInputs((prev) => ({ ...prev, [name]: value }))
    }

    const handleImageUpload = (e) => {
        const validType = ["jpg", "png", "jpeg", "JPG", "JPEG", "PNG"]
        const file = e.target.files[0]
        let type = file?.type.split("/")[1]

        if (!validType.includes(type)) {
            return notif.error("Invalid file type uploaded")
        }
        const reader = new FileReader();
        reader.addEventListener("load", function () {
            // convert image file to base64 string
            setInputs((preVal) => ({ ...preVal, ["image"]: reader.result }))
        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }
    }

    const imageStyle = {
        backgroundImage: `url("${inputs.image}")`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
    }

    async function ProductController() {

        const { price, name, description, category, currency, image } = inputs;

        if (price === "") return notif.error("product price cant be empty.")
        if (name === "") return notif.error("product name cant be empty.")
        if (description === "") return notif.error("product description cant be empty.")
        if (category === "") return notif.error("product category cant be empty.")
        if (currency === "") return notif.error("product currency cant be empty.")
        if (image === "" && type === "add") return notif.error("product image cant be empty.")

        const apiURL = type === "add" ? API_ROUTES.addProduct : API_ROUTES.updateProduct;
        const body = type === "add" ? JSON.stringify({ ...inputs, userId: userInfo?.id }) : JSON.stringify({ ...inputs, productId: data?.id, userId: userInfo?.id })

        if (type === "add") {
            try {
                setLoading(true)
                const { res, data } = await Fetch(apiURL, {
                    method: "POST",
                    body
                })
                setLoading(false);

                if (data && data.status === 400) {
                    notif.error(`Something went wrong adding product. ${data.message}`)
                    throw new Error(data.message)
                }

                closeForm()
                notif.success(data.message)
                return window.location.reload()
            } catch (e) {
                setLoading(false);
                notif.error(`Something went wrong adding product. ${e.message}`)
                throw new Error(e.message)
            }
        }
        if (type === "edit") {
            try {
                setLoading(true)
                const { res, data } = await Fetch(apiURL, {
                    method: "PUT",
                    body
                })
                setLoading(false);

                if (data && data.status === 400) {
                    notif.error(`Something went wrong updating product. ${data.message}`)
                    throw new Error(data.message)
                }
                console.log(data);
                closeForm()
                notif.success(data.message)
                return window.location.reload()
            } catch (e) {
                setLoading(false);
                notif.error(`Something went wrong updating product. ${e.message}`)
                throw new Error(e.message)
            }
        }
    }

    return (
        <div className="w-full h-screen absolute top-[-20px] left-0 flex flex-col items-center justify-start p-10 bg-dark-400">
            <div className="w-[400px] bg-white-100 rounded-md overflow-hidden ">
                <div
                    id="head"
                    className="w-full h-auto fle flex-col items-start justify-start  p-5 bg-dark-200 "
                >
                    <p className="text-white-100 font-extrabold">Add Store</p>
                    <small className="text-white-100 font-extrabold">
                        Creating of online virtual store just got better.{" "}
                    </small>
                </div>
                <div className="w-full h-auto items-start flex-col justify-start p-3">
                    <div
                        id="preview"
                        className="w-[70px] h-[70px] rounded-[50%] bg-dark-100 m-auto flex flex-row items-center justify-between gap-5 p-3"
                        style={imageStyle}
                    ></div>
                    <Input placeholder="Product Image" id="image-upload" name="image" onChange={handleImageUpload} type="file" />
                    <br />
                    <div className="w-full flex flex-row items-center justify-center gap-5">
                        <Input placeholder="Name" onChange={handleTextInputs} name="name" value={inputs.name} />

                        <Input placeholder="Category" onChange={handleTextInputs} name="category" type="text" value={inputs.category} />
                    </div>
                    <Input placeholder="Description" onChange={handleTextInputs} name="description" value={inputs.description} />
                    <div className="w-full flex flex-row items-center justify-center gap-5">
                        <Input placeholder="Price" onChange={handleTextInputs} name="price" type="number" value={inputs.price} />
                        <select name="currency" className="w-full h-auto px-4 py-3 mt-3 rounded-md text-white-200 bg-dark-100" onChange={handleTextInputs}>
                            <option value="">Currency</option>
                            <option value="NG">NG</option>
                            <option value="$">$</option>
                        </select>
                    </div>
                    <br />
                    <div className="w-full flex flex-row items-center justify-between gap-5">
                        <button
                            className="btn text-dark-100 font-extrabold "
                            onClick={closeForm}
                        >
                            <span className="font-extrabold text-dark-100">Close</span>
                        </button>
                        <Button
                            text={type === "add" ? `${loading ? "Adding Product..." : "Add Product "}` : `${loading ? "Updating Product..." : "Save Edit. "} `}
                            type="secondary"
                            onClick={ProductController}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProductCards({ toggleProductModal, closeForm, openForm, list }) {
    const imageStyle = {
        backgroundImage: `url("${list?.image}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
    };

    return (
        <div
            className="w-[250px] h-[300px] rounded-md bg-white-200 shadow-lg shadow-dark-400 relative overflow-hidden  "
            style={imageStyle}
            key={list?.id}
        >
            <div className="w-full flex flex-row items-end justify-end absolute top-2 right-0">
                <button
                    className="bg-dark-200 cursor-pointer text-white-100 font-extrabold px-3 py-1 rounded-md scale-[.70] "
                    onClick={toggleProductModal}
                    data-id={list?.id}
                >
                    View
                </button>
                <button
                    className="bg-dark-200 cursor-pointer text-white-100 font-extrabold px-3 py-1 rounded-md scale-[.70] "
                    onClick={(e) => openForm("edit", e)}
                    data-id={list?.id}
                >
                    edit
                </button>
            </div>
            {/* <Button type="success" text="edit" style={{ transform: "scale(.70)" }} /> */}
            <div
                id="bottom"
                className="w-full h-[120px] bg-dark-500 absolute bottom-0 left-0 flex flex-col items-center justify-between"
            >
                <div
                    id="top"
                    className="w-full flex flex-col px-3 pt-3 items-start justify-start"
                >
                    <p className="text-white-100 text-[20px] font-extrabold capitalize ">
                        {list?.title}
                    </p>
                    <small className="text-white-200">{list?.description}</small>
                </div>
                <div
                    id="top"
                    className="w-full flex flex-row px-3 pb-4 items-start justify-between"
                >
                    <p className="text-white-100 text-[20px] font-extrabold ">{list?.currency} {list?.price}</p>
                    {/* <IoMdHeartEmpty className="p-2 rounded-md bg-dark-300 text-[35px] scale-[.90] hover:scale-[.95] transition-all cursor-pointer text-white-100 " /> */}
                </div>
            </div>
        </div>
    );
}

function SelectedProduct({ activeProduct, data, closeSelectedProductModal }) {

    const [loading, setLoading] = useState(false)
    const [isCopied, setIsCopied] = useState(false)

    const { origin } = window.location;
    const QRCODE_URL = `${origin}/scanner/${data?.orgId}/${data?.id}`
    const QRCODE_NODE = useRef(null);

    useEffect(() => {
        console.log(QRCODE_URL);
        if (activeProduct) {
            let modal = document.querySelector("#product-modal");
            modal.style.height = "auto";
            modal.style.bottom = "0px";
        }
    }, []);

    const downloadQRcode = () => {
        toPng(QRCODE_NODE.current)
            .then(function (dataUrl) {
                const link = document.createElement('a');
                link.download = 'quarlet-qrcode.jpeg';
                link.href = dataUrl;
                link.click();

                notif.success("Downloaded Successfull.")
            })
            .catch(function (error) {
                notif.error('oops, something went wrong!', error.message);
            });
    }

    if (isCopied) {
        setTimeout(() => {
            setIsCopied(false)
        }, 2000);
    }

    const copyUrl = () => {
        navigator.clipboard.writeText(QRCODE_URL);
        setIsCopied(true)
    }

    async function deleteProduct(e) {
        const dataset = e.target.dataset;
        if (Object.entries(dataset).length > 0) {
            const { id } = dataset;
            const confirm = window.confirm("Are you sure about this action.?")

            if (!confirm) return;

            try {
                setLoading(true)
                const { res, data } = await Fetch(API_ROUTES.deleteProduct, {
                    method: "DELETE",
                    body: JSON.stringify({
                        productId: id,
                        userId: userInfo?.id
                    })
                })
                setLoading(false);

                if (data && data.status === 400) {
                    notif.error(`Something went wrong deleting product. ${data.message}`)
                    throw new Error(data.message)
                }

                notif.success(data.message)
                return window.location.reload()
            } catch (e) {
                setLoading(false);
                notif.error(`Something went wrong deleting product. ${e.message}`)
                throw new Error(e.message)
            }
        }
    }

    return (
        <div
            className={`w-full h-screen fixed top-0 left-0 m-auto p-5 bg-dark-400 flex flex-col items-center justify-center`}
        >
            <div
                id="product-modal"
                className={`w-[450px] h-0 bg-white-100 rounded-sm p-4 absolute bottom-[-50px] transition-all`}
            >
                <button
                    className="bg-dark-200 text-white-100 font-extrabold relative top-2 left-0 px-3 py-1 rounded-md scale-[.90] "
                    onClick={closeSelectedProductModal}
                >
                    Close
                </button>
                <br />
                <div className="w-full flex flex-col text-center items-center justify-center">
                    <p className="text-dark-100 font-extrabold text-[25px] capitalize ">
                        {data?.title}
                    </p>
                    <p className="text-dark-100 text-[15px]">{data?.description}</p>
                    <div ref={QRCODE_NODE} className="w-full bg-white-100 flex flex-col text-center items-center justify-center p-2 scale-[.70] ">
                        <QRCode value={QRCODE_URL} width={250} height={250} />
                    </div>
                    <div className="w-full h-auto flex items-center justify-center gap-5">
                        <button className="px-5 py-3 cursor-pointer transition-all hover:scale-[.85] flex flex-row items-center justify-start rounded-[30px] bg-white-300 text-dark-100 font-extrabold  scale-[.75] hover:bg-dark-100 hover:text-white-100 shadow-md shadow-dark-400" onClick={copyUrl}>
                            <IoIosCopy className="mr-2 text-[20px] " /> {isCopied ? "Copied" : "Copy"}
                        </button>
                        <button className="px-5 py-3 cursor-pointer transition-all hover:scale-[.85] flex flex-row items-center justify-start rounded-[30px] bg-white-300 text-dark-100 font-extrabold scale-[.75]  hover:bg-dark-100 hover:text-white-100 shadow-md shadow-dark-400" data-id={data?.id} onClick={deleteProduct}>
                            <IoIosTrash className="mr-2 text-[20px] " /> {loading ? "Deleting" : "Delete"}
                        </button>
                        <button className="px-5 py-3 cursor-pointer transition-all hover:scale-[.85] flex flex-row items-center justify-start rounded-[30px] bg-white-300 text-dark-100 font-extrabold scale-[.75]  hover:bg-dark-100 hover:text-white-100 shadow-md shadow-dark-400" onClick={downloadQRcode}>
                            <IoIosDownload className="mr-2 text-[20px] " />{" "}
                            Download
                        </button>
                    </div>
                    <br />
                    <p className="text-dark-100 text-[15px]">
                        Download and Attach the QRCode to your physical product.
                    </p>
                </div>
                <br />
                <div className="w-full h-auto flex flex-row items-start justify-between">
                    <div id="top" className="w-ful"></div>
                </div>
            </div>
        </div>
    );
}

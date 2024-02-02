import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import LapTopCard from "./LapTopCard";

const Laptop = () => {
  const axiosPoint = useAxiosPublic();
  const location = useLocation();
  const [AllLaptop, setLaptop] = useState([]);
  const [UseLaptop, setUseLaptop] = useState([]);
  const [Range, setRange] = useState(0);
  const [MinPrice, setMinPrice] = useState(0);
  const [CurrentPage, setPage] = useState(1);
  const [postPerPage, setPost] = useState(12);
  const [MaxPrice, setMaxPrice] = useState(0);
  const param = location.state;

  const indexOfFirstCard = (currentPage) => (currentPage - 1) * postPerPage;
  const indexOfLastCard = (currentPage) => currentPage * postPerPage;

  const setCurrentPost = () => {
    const start = indexOfFirstCard(CurrentPage);
    const end = indexOfLastCard(CurrentPage);
    setUseLaptop(AllLaptop.slice(start, end));
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setCurrentPost();
  };

  const generatePageNumbers = (totalPages, currentPage) => {
    const pageNumbers = [];

    if (currentPage > 1) {
      pageNumbers.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="prev-btn underline hover:text-red-600"
          disabled={currentPage === 1}
        >
          Previous
        </button>
      );
    } else {
      pageNumbers.push(
        <button key="prev" className="prev-btn btn-disabled text-gray-400">
          Previous
        </button>
      );
    }

    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={
            i === currentPage
              ? "active text-white px-3 bg-red-600 rounded-md"
              : ""
          }
          disabled={i === currentPage}
        >
          {i}
        </button>
      );
    }

    if (currentPage < totalPages) {
      pageNumbers.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="next-btn underline hover:text-red-600"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      );
    } else {
      pageNumbers.push(
        <button key="next" className="next-btn btn-disabled text-gray-400">
          Next
        </button>
      );
    }

    return pageNumbers;
  };
  const getAllLaptop = async () => {
    try {
      const response = await axiosPoint.get("/laptop");
      console.log(response.data);
      setLaptop(response.data);
      setUseLaptop(response.data.slice(0, 12));
      setMinPrice(
        Math.min(
          ...response.data.map((item) => item.keyFeatures.discountedPrice)
        )
      );
      setMaxPrice(
        Math.max(
          ...response.data.map((item) => item.keyFeatures.discountedPrice)
        )
      );
    } catch (error) {
      console.error("Error fetching laptop data:", error);
    }
  };

  const getLaptopByBrand = async (parameter) => {
    try {
      const response = await axiosPoint.get(`/laptop/${parameter}`);
      console.log(response.data);
      setLaptop(response.data);
      setUseLaptop(response.data);
      setMinPrice(
        Math.min(
          ...response.data.map((item) => item.keyFeatures.discountedPrice)
        )
      );
      setMaxPrice(
        Math.max(
          ...response.data.map((item) => item.keyFeatures.discountedPrice)
        )
      );
    } catch (error) {
      console.error("Error fetching laptop data:", error);
    }
  };
  //------------------------Price filter-----------------
  const handleOnchange = (value) => {
    setRange(value);
    setUseLaptop(
      AllLaptop.filter((item) => item.keyFeatures.discountedPrice <= value)
    );
  };
  //-------------------------UserDefinedFilter--------------------
  const HandleChoice = (container, attribute, value) => {
    console.log(
      AllLaptop.filter((item) => item[container][attribute] == value)
    );
    setUseLaptop(
      AllLaptop.filter((item) => item[container][attribute] == value)
    );
  };
  //-------------------------Shorting------------------------------------
  const shortingDesc = (laptop) => {
    const filter =  laptop.sort(
      (a, b) => b.keyFeatures.discountedPrice - a.keyFeatures.discountedPrice
    ); 
    console.log(filter[0].keyFeatures.discountedPrice)
    return filter;
  };
 
 

  const shortingAsc = (laptop) => {
    const filterLaptop = laptop.sort(
      (a, b) => a.keyFeatures.discountedPrice - b.keyFeatures.discountedPrice
    );
    console.log(filterLaptop[0].keyFeatures.discountedPrice);
    return filterLaptop;
  };

  const handleSortByPrice = (event) => {
    const sortBy = parseInt(event.target.value);

    switch (sortBy) {
      case 2:
        const sortedByPrice = shortingAsc(UseLaptop);
        setUseLaptop(sortedByPrice);
        console.log(UseLaptop)
        break;
      case 3:
        const sortedByPriceDescending = shortingDesc(UseLaptop);
        setUseLaptop(sortedByPriceDescending);
        console.log(UseLaptop)
        break;
      default:
        break;
    }
  };
  //-----------------------fetching data-------------------------
  useEffect(() => {
    if (param === "All") {
      getAllLaptop();
    } else {
      getLaptopByBrand(param);
    }
    setCurrentPost();
  }, [param]);

  
  return (
    <div className="bg-indigo-100 px-10 py-5 grid grid-cols-4 gap-5">
      <div className=" flex flex-col gap-2">
        {/*-------------------------- Price range adjuster-------------------------------- Intel*/}

        <div className=" bg-white rounded-md">
          <h1 className=" text-lg font-medium py-2 px-5 "> Price Range</h1>
          <hr />
          <div className="px-5 py-3">
            <div className=" flex justify-between px-2">
              <p>{MinPrice}$</p>
              <p>{MaxPrice}$</p>
            </div>
            <input
              onChange={(event) => handleOnchange(event.target.value)}
              type="range"
              min={MinPrice}
              max={MaxPrice}
              defaultValue={MaxPrice}
              className="range border-2 bg-white range-error "
            />
          </div>

          <div className="px-5 pb-2 text-center">
            <h1> Under</h1>
            <hr className="mx-2/3" />
            <h1>{Range} $</h1>
          </div>
        </div>

        {/*-----------------------------Processor Filter---------------------------------- */}
        <div className=" bg-white rounded-md ">
          <h1 className=" text-lg font-medium py-2 px-5 "> Processor</h1>
          <hr />
          <div className=" px-5 py-2 class-name flex gap-2">
            <button
              onClick={() => HandleChoice("processor", "brand", "Intel")}
              className=" px-3 bg-blue-700 text-white btn btn-active hover:bg-blue-700 "
            >
              Intel
            </button>
            <button
              onClick={() => HandleChoice("processor", "brand", "AMD")}
              className=" px-3 bg-red-600 text-white btn btn-active hover:bg-red-600 "
            >
              AMD
            </button>
          </div>
        </div>
        {/* ------------------------------Processor core------------------------ */}
        <div className=" bg-white rounded-md ">
          <h1 className=" text-lg font-medium py-2 px-5 "> Number of Core</h1>
          <hr />
          <div className="px-5 py-2 flex flex-col gap-2">
            <label
              className="flex hover:cursor-pointer gap-2 hover:bg-indigo-50 p-1 rounded-sm"
              htmlFor="core1"
            >
              <input
                type="checkbox"
                onChange={() => HandleChoice("processor", "core", 4)}
                className="w-5"
                value=""
                id="core1"
              />{" "}
              <p> 4</p>
            </label>
            <label
              className="flex hover:cursor-pointer gap-2 hover:bg-indigo-50 p-1 rounded-sm"
              htmlFor="core2"
            >
              <input
                type="checkbox"
                onChange={() => HandleChoice("processor", "core", 6)}
                className="w-5"
                value=""
                id="core2"
              />{" "}
              <p> 6</p>
            </label>
            <label
              className="flex hover:cursor-pointer gap-2 hover:bg-indigo-50 p-1 rounded-sm"
              htmlFor="core3"
            >
              <input
                type="checkbox"
                onChange={() => HandleChoice("processor", "core", 8)}
                className="w-5"
                value=""
                id="core3"
              />{" "}
              <p> 8</p>
            </label>
          </div>
        </div>

        {/*-----------------------------graphics---------------------------------- */}
        <div className=" bg-white rounded-md ">
          <h1 className=" text-lg font-medium py-2 px-5 "> Graphics</h1>
          <hr />
          <div className=" px-5 py-2 class-name flex  gap-2">
            <button
              onClick={() => HandleChoice("graphics", "brand", "Intel")}
              className=" px-2 bg-blue-700 text-white btn btn-active hover:bg-blue-700 "
            >
              Intel
            </button>
            <button
              onClick={() => HandleChoice("graphics", "brand", "AMD")}
              className=" px-2 bg-red-600 text-white btn btn-active hover:bg-red-600 "
            >
              AMD Radeon
            </button>
            <button
              onClick={() => HandleChoice("graphics", "brand", "Nvidia")}
              className=" px-2 bg-[#73B301] text-white btn btn-active hover:bg-[#73B301] "
            >
              NVIDIA
            </button>
          </div>
        </div>
      </div>

      <div className=" col-span-3 ">
        <div className=" px-5 py-3 bg-white items-center  flex justify-between  rounded-md">
          <h1 className="font-semibold text-lg">{param.toUpperCase()}</h1>
          <div className=" flex items-center gap-2">
            <p className=" text-gray-500">Sort By : </p>{" "}
            <div>
              <select
                onChange={handleSortByPrice}
                className="bg-slate-200 w-42 rounded-md px-3 py-2 outline-none"
              >
                <option value="1">Default</option>
                <option value="2">Price (low -> high)</option>
                <option value="3"> Price (high -> low)</option>
              </select>
            </div>
          </div>
        </div>
        <div className=" grid grid-cols-3 gap-5 pt-2 ">
          {UseLaptop.length > 1 ? (
            UseLaptop.map((item, index) => (
              <LapTopCard key={item._id} state={item} sl={index} />
            ))
          ) : (
            <h1>Sorry No Laptop Found</h1>
          )}
        </div>
        <div className="pagination flex gap-6 py-6">
          {generatePageNumbers(
            Math.ceil(AllLaptop.length / postPerPage),
            CurrentPage
          )}
        </div>
      </div>
    </div>
  );
};

export default Laptop;

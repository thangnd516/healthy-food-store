import { Button, DatePicker, Table } from "antd";
import { DatePickerProps } from "antd/es/date-picker";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import axios from "axios";

const ManageStatisticalPage = () => {
  const [title, setTitles] = useState("Doanh thu 7 ngày gần nhất");
  const [series, setSeries] = useState([44]);
  const [dataInfo, setDataInfo] = useState([]);
  const [dataDate, setDataDate] = useState("");
  const [searchParams] = useSearchParams();
  const isSearch = searchParams.get("searchBy");
  const navigate = useNavigate();
  useEffect(() => {
    const handleFetch = async () => {
      try {
        let response: any;
        switch (isSearch) {
          case "day":
            response = await axios.get(
              `http://localhost:5001/api/payment/statistical?day=${dataDate}`
            );
            setSeries([response.data.total]);
            setDataInfo(response.data.orderInfo);
            setTitles(
              `Doanh thu ngày ${dataDate}: ` +
                response.data?.total?.toLocaleString("it-IT") +
                "VND"
            );
            break;
          case "week":
            response = await axios.get(
              `http://localhost:5001/api/payment/statistical?week=${dataDate}`
            );
            setSeries([response.data.total]);
            setDataInfo(response.data.orderInfo);
            setTitles(
              "Doanh thu tuần: " +
                response.data?.total?.toLocaleString("it-IT") +
                "VND"
            );
            break;
          case "month":
            response = await axios.get(
              `http://localhost:5001/api/payment/statistical?month=${dataDate}`
            );
            setSeries([response.data.total]);
            setDataInfo(response.data.orderInfo);
            setTitles(
              "Doanh thu tháng: " +
                response.data?.total?.toLocaleString("it-IT") +
                "VND"
            );
            break;
          case "year":
            response = await axios.get(
              `http://localhost:5001/api/payment/statistical?year=${dataDate}`
            );
            setSeries([response.data.total]);
            setDataInfo(response.data.orderInfo);
            setTitles(
              "Doanh thu năm: " +
                response.data?.total?.toLocaleString("it-IT") +
                "VND"
            );
            break;
          default:
            response = await axios.get(
              `http://localhost:5001/api/payment/statistical`
            );
            setSeries([response.data.total]);
            setDataInfo(response.data.orderInfo);
            setTitles(
              "Doanh thu 7 ngày gần nhất: " +
                response.data?.total?.toLocaleString("it-IT") +
                "VND"
            );
            break;
        }
      } catch (e) {
        console.log(e);
      }
    };
    handleFetch();
  }, [dataDate]);
  const [options, _] = useState<any>({
    chart: {
      width: 380,
      type: "pie",
    },
    labels: [title],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  });
  const dataSource = dataInfo?.map((items: any, index: any) => {
    const day = new Date(items.dateOrder).getDate();
    const month = new Date(items.dateOrder).getMonth() + 1;
    const year = new Date(items.dateOrder).getFullYear();
    const hours =
      new Date(items?.dateOrder).getHours() <= 9
        ? `0${new Date(items?.dateOrder).getHours()}`
        : new Date(items?.dateOrder).getHours();
    const minutes =
      new Date(items?.dateOrder).getMinutes() <= 9
        ? `0${new Date(items?.dateOrder).getMinutes()}`
        : new Date(items?.dateOrder).getMinutes();
    const seconds =
      new Date(items?.dateOrder).getSeconds() <= 9
        ? `0${new Date(items?.dateOrder).getSeconds()}`
        : new Date(items?.dateOrder).getSeconds();
    return {
      key: items._id,
      stt: index + 1,
      typeOrder:
        items.typeOrder === "CASH"
          ? "Thanh toán khi nhận hàng"
          : items.typeOrder === "VNPAY"
          ? "Thanh toán online"
          : "",
      price: items.price.toLocaleString("it-IT"),
      userId: items.userId.username,
      dayOrder: `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`,
    };
  });
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: "Tổng tiền (VND)",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Loại thanh toán",
      dataIndex: "typeOrder",
      key: "typeOrder",
    },
    {
      title: "Ngày đặt",
      dataIndex: "dayOrder",
      key: "dayOrder",
    },
  ];
  const onDateChange: DatePickerProps["onChange"] = (_, dateString: any) => {
    if (isSearch == "day") {
      setDataDate(dateString);
    } else if (isSearch == "week") {
      setDataDate(dateString);
    } else if (isSearch == "month") {
      const newDate = dateString.split("-");
      const result = `${newDate[0]}-${newDate[1]}`;
      setDataDate(result);
    } else if (isSearch == "year") {
      const newDate = dateString.split("-");
      setDataDate(newDate[0]);
    }
  };
  return (
    <div className="pt-8">
      <div className="w-[800px] mx-auto">
        <div id="chart">
          <ReactApexChart
            options={options}
            series={series}
            type="pie"
            width={380}
          />
        </div>
        <div className="mx-auto w-max">
          <DatePicker className="mt-2" onChange={onDateChange} />
        </div>
        <div className="pl-3 my-3 space-x-5">
          <Button
            onClick={() => {
              navigate({
                search: createSearchParams({
                  searchBy: "day",
                }).toString(),
              });
            }}
          >
            Xem theo ngày
          </Button>
          <Button
            onClick={() => {
              navigate({
                search: createSearchParams({
                  searchBy: "week",
                }).toString(),
              });
            }}
          >
            Xem theo tuần
          </Button>
          <Button
            onClick={() => {
              navigate({
                search: createSearchParams({
                  searchBy: "month",
                }).toString(),
              });
            }}
          >
            Xem theo tháng
          </Button>
          <Button
            onClick={() => {
              navigate({
                search: createSearchParams({
                  searchBy: "year",
                }).toString(),
              });
            }}
          >
            Xem theo năm
          </Button>
          <Button
            onClick={() => {
              navigate({
                search: createSearchParams({
                  searchBy: "",
                }).toString(),
              });
            }}
          >
            7 ngày gần nhất
          </Button>
        </div>
        <p className="pl-3">{title}</p>
        <div className="pl-3 mt-3">
          <p className="pb-3">Chi tiết đơn</p>
          <Table
            dataSource={dataSource}
            columns={columns}
            rowKey={"_id"}
            pagination={{
              defaultPageSize: 2,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageStatisticalPage;

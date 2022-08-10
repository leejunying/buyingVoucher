import "./detail.css";
import { Row, Col, Image, Rate, Checkbox, Button } from "antd";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { Request_User, Request_Admin } from "../../../../API/api";
import { useEffect, useState, Suspense } from "react";
import axios from "axios";
import { Spin } from "antd";
import { ConsoleSqlOutlined, LoadingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { Select } from "antd";

import { Commonfc } from "../../../../Ultis/Commonfunction";
import { addItem } from "../../../../Redux/Reducer/Cart";
import { useDispatch } from "react-redux";
import zIndex from "@mui/material/styles/zIndex";
import { Tabs } from "antd";
const { TabPane } = Tabs;

const { Option } = Select;

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Detail = () => {
  //antd tab

  window.scrollTo(0, 0);

  const dispatch = useDispatch();

  let { slug } = useParams();

  useEffect(() => {}, [slug]);

  //init value and state

  const [tab, setTab] = useState("detail");

  const [post, setPost] = useState([]);

  const [data, setData] = useState({});

  const [price, setPrice] = useState(0);

  const [color, setColor] = useState(0);

  const [room, setRoom] = useState(0);

  const [duration, setDuration] = useState(0);

  const displaydetailByType = (type) => {
    if (post.length > 0) {
      return post.filter((item) => {
        return item.type == type;
      })[0].content;
    }
  };

  const getdetail = () => {
    axios
      .get(`${Request_Admin.getDetailpostByVoucherid(data._id)}`)
      .then((res) => {
        if (res.status == 200) setPost(res.data);
      });
  };

  const getdata = () => {
    axios
      .get(`${Request_User.findvoucher}/${slug}`)
      .then((res) => {
        setData(res.data);

        if (res.data["key"] == "CV") {
          setPrice(res.data["price_options"]["price"]);
        }
        if (res.data["key"] == "DVHK") {
          setPrice(res.data["price_options"]["package"][0].value);
        }

        if (res.data["key"] == "DVND" || res.data["key"] == "G") {
          let value = res.data["price_options"]["duration"][0].value;

          setDuration(value);
          setPrice(value);
        }
        if (res.data["key"] == "DVLK") {
          var getCredit = res.data["price_options"]["duration"][0].value;

          setPrice(getCredit);
          setDuration(getCredit);
        }
      })
      .catch((err) => {});
  };

  useEffect(() => {
    getdetail();
  }, [data]);

  useEffect(() => {
    getdata();
  }, [slug]);

  const onChangeTab = (key) => {
    setTab(key);
  };

  const onChangepackage = (value) => {
    setPrice(value);
  };

  const onChangecolor = (value) => {
    setColor(value);

    setPrice(totalND(duration, value, room));
  };

  const onChangeduration = (value) => {
    setDuration(value);

    if (data["key"] == "DVND") setPrice(totalND(value, color, room));
    else setPrice(value);
  };

  const onChangeRoom = (value) => {
    setRoom(value);
    setPrice(totalND(duration, color, value));
  };

  const totalND = (duration, color, room) => {
    let percentColor = color != 0 ? (color * duration) / 100 : 0;
    let percentRoom = room != 0 ? (room * duration) / 100 : 0;

    let result =
      parseInt(duration) + parseInt(percentColor) + parseInt(percentRoom);

    return result;
  };

  const addTocart = () => {
    const itemobj = {
      title: data.title,
      img_url: data.img_url,
      price: price,
    };

    // console.log(itemobj)

    console.log(data);

    dispatch(addItem(itemobj));
  };

  return (
    <Grid
      style={{
        backgroundColor: "white",
        minHeight: "600px",
        marginTop: "20px",
        position: "relative",
        zIndex: "1",
        width: "100%",
      }}
    >
      <Suspense fallback={<Spin indicator={antIcon} />}>
        <Grid container spacing={1} className=" flex jus-center">
          <Grid item={true} xs={5} className="flex jus-center">
            <img style={{ width: "350px" }} src={data.img_url}></img>
          </Grid>

          <Grid item={true} xs={7} className="voucher-info ">
            <h2 style={{ fontSize: 30, marginTop: 20 }}>{data["title"]}</h2>
            <Grid>
              {data["categorys"] != undefined
                ? data["categorys"].map((data, indx) => {
                    return (
                      <a key={indx} style={{ color: "blue" }}>
                        {data.title}
                      </a>
                    );
                  })
                : null}
            </Grid>

            <Grid style={{ margin: "20px 20px 20px 0" }}>
              {
                //Key G
                data["key"] == "DVG" ? (
                  <Grid container spacing={2} className="flex options">
                    <Grid item={true} xs={2}>
                      Thời hạn
                    </Grid>

                    <Grid item={true} xs={6}>
                      <Select
                        defaultValue={
                          data["price_options"]["duration"][0].value
                        }
                        style={{ width: "100%" }}
                        placeholder="Choose duration"
                        optionFilterProp="children"
                        onChange={onChangeduration}
                      >
                        {data["price_options"]["duration"].map(
                          (duration, indx) => {
                            return (
                              <Option key={indx} value={duration.value}>
                                {duration.title} Tháng
                              </Option>
                            );
                          },
                        )}
                      </Select>
                    </Grid>
                  </Grid>
                ) : null
              }

              {
                //Key HK

                data["key"] == "DVHK" ? (
                  <Grid container spacing={2} className="flex options">
                    <Grid item={true} xs={2}>
                      {" "}
                      Gói tháng
                    </Grid>

                    <Grid item={true} xs={6}>
                      <Select
                        defaultValue={
                          Commonfc.valuesofObj(
                            data["price_options"]["package"][0],
                          )[0]
                        }
                        style={{ width: "100%" }}
                        placeholder="Choose package"
                        optionFilterProp="children"
                        onChange={onChangepackage}
                      >
                        {data["price_options"]["package"].map(
                          (packages, indx) => {
                            return (
                              <Option key={indx} value={packages.value}>
                                {packages.title} Tháng
                              </Option>
                            );
                          },
                        )}
                      </Select>
                    </Grid>
                  </Grid>
                ) : null
              }
              {
                //Key ND

                data["key"] == "DVND" ? (
                  <Grid container spacing={2} className=" flex  options">
                    <Grid item={true} className="flex" xs={10}>
                      <Grid item={true} xs={2}>
                        Màu sắc
                      </Grid>

                      <Grid item={true} xs={6}>
                        <Select
                          defaultValue={data["price_options"]["color"][0].value}
                          style={{ width: "100%" }}
                          placeholder="Choose color"
                          optionFilterProp="children"
                          onChange={onChangecolor}
                        >
                          {data["price_options"]["color"].map((color, indx) => {
                            return (
                              <Option key={indx} value={color.value}>
                                {color.title}
                              </Option>
                            );
                          })}
                        </Select>
                      </Grid>
                    </Grid>

                    <Grid item={true} className="flex" xs={10}>
                      <Grid item={true} xs={2}>
                        Thời hạn
                      </Grid>

                      <Grid item={true} xs={6}>
                        <Select
                          defaultValue={
                            data["price_options"]["duration"][0].value
                          }
                          style={{ width: "100%" }}
                          placeholder="Choose duration"
                          optionFilterProp="children"
                          onChange={onChangeduration}
                        >
                          {data["price_options"]["duration"].map(
                            (duration, indx) => {
                              return (
                                <Option key={indx} value={duration.value}>
                                  {duration.title} Tháng
                                </Option>
                              );
                            },
                          )}
                        </Select>
                      </Grid>
                    </Grid>

                    <Grid item={true} className="flex" xs={10}>
                      <Grid item={true} xs={2}>
                        Số phòng
                      </Grid>

                      <Grid item={true} xs={6}>
                        <Select
                          defaultValue={data["price_options"]["room"][0].title}
                          style={{ width: "100%" }}
                          placeholder="Choose duration"
                          optionFilterProp="children"
                          onChange={onChangeRoom}
                        >
                          {data["price_options"]["room"].map((room, indx) => {
                            return (
                              <Option key={indx} value={room.value}>
                                {room.title}
                              </Option>
                            );
                          })}
                        </Select>
                      </Grid>
                    </Grid>
                  </Grid>
                ) : null
              }
              {
                //Key LK

                data["key"] == "DVLK" ? (
                  <Grid container spacing={2} className=" flex  options">
                    <Grid item={true} className="flex" xs={10}>
                      <Grid item={true} xs={2}>
                        Hạn mức
                      </Grid>

                      <Grid item={true} xs={6}>
                        <Select
                          defaultValue={data["price_options"].duration[0].value}
                          style={{ width: "100%" }}
                          placeholder="Choose Credit"
                          optionFilterProp="children"
                          onChange={onChangeduration}
                        >
                          {data["price_options"].duration.map(
                            (lineofcredit, indx) => {
                              return (
                                <Option key={indx} value={lineofcredit.value}>
                                  {lineofcredit.title} Tháng
                                </Option>
                              );
                            },
                          )}
                        </Select>
                      </Grid>
                    </Grid>
                  </Grid>
                ) : null
              }
            </Grid>

            <Grid
              container
              spacing={1}
              justifyContent="flex-start"
              className="flex col total"
            >
              <Grid item={true} display="flex" xs={12}>
                Tổng :{" "}
                {price != undefined
                  ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                    "VND"
                  : 0}
              </Grid>
            </Grid>

            <Grid className="div_btn">
              <Button
                type="primary"
                onClick={addTocart}
                block
                style={{ width: "50%", margin: 10 }}
              >
                Thêm Vào giỏ Hàng
              </Button>
              <Button type="red-7" block style={{ width: "50%", margin: 10 }}>
                Mua Ngay
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          style={{ margin: "30px" }}
          container
          display="flex"
          className="tab-voucherdetail"
        >
          <Grid item={true} md={6}>
            <Tabs defaultActiveKey={tab} onChange={onChangeTab}>
              <TabPane tab="Thông tin chi tiết" key="detail">
                <Grid
                  dangerouslySetInnerHTML={{
                    __html: displaydetailByType(tab),
                  }}
                ></Grid>
                {}
              </TabPane>
              <TabPane tab="Chính sách" key="policy">
                <Grid
                  dangerouslySetInnerHTML={{
                    __html: displaydetailByType(tab),
                  }}
                ></Grid>
              </TabPane>
            </Tabs>
          </Grid>
        </Grid>
      </Suspense>
    </Grid>
  );
};

export default Detail;

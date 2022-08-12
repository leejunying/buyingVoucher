import React, { useEffect, useState, Suspense } from "react";
import { Spin, Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Contacts from "../Contacts";
import { BrowserRouter as Router, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from "react-redux";
import useMediaQuery from "@mui/material/useMediaQuery";
import { clientLogin } from "../../../Redux/Reducer/Account";
import { Commonfc } from "../../../Ultis/Commonfunction";
import { addItem, removeItem } from "../../../Redux/Reducer/Cart";
import Grid from "@mui/material/Grid";
import Banner from "../../../Components/Banner/Banner";
import CardItem from "../Vounchers/Card/index";
import axios from "axios";
import "./Home.css";
import { Request_User } from "../../../API/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
const Home = () => {
  //define using
  const dispatch = useDispatch();
  const state = useSelector((state) => (state = state));
  const [sreen, setScreen] = useState({
    size: 2,
  });

  //local state

  const [topvoucher, Settopvoucher] = useState([]);

  const mbhorizon = useMediaQuery("(max-width:320px)");

  const mbverti = useMediaQuery("(max-width:480px)");

  const menuimgstyle = {
    img1: { width: "100px", height: "100px" },
    img2: { width: "30px", height: "30px" },
    img3: { width: "15px", height: "15px" },
  };

  const menufrontstyle = {
    text1: { fontSize: "12px" },
    text2: { fontSize: "7px" },
  };

  const Mainmenustyle = () => {
    const result = {
      img: {},
      text: {},
    };

    if (mbhorizon == true) {
      result.img = menuimgstyle.img3;
      result.text = menufrontstyle.text2;
    }
    if (mbverti == true) {
      result.img = menuimgstyle.img2;
      result.text = menufrontstyle.text2;
    }

    if (mbhorizon == false && mbverti == false) {
      result.img = menuimgstyle.img1;
      result.text = menufrontstyle.text1;
    }

    return result;
  };

  //Mount

  useEffect(() => {
    axios
      .get(Request_User.topvoucher)
      .then((res) => {
        if (res.status == 200) {
          Settopvoucher(res["data"]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //init value
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  //init state

  //Effect

  //mount

  return (
    <div>
      <section
        style={{ position: "relative", zIndex: "1" }}
        className="flex jus-center Slider"
      >
        <Banner></Banner>
      </section>
      <section
        style={{ display: mbverti == true ? "none" : "flex" }}
        className="Main-menu"
      >
        <Grid
          style={{ margin: "15px" }}
          display={"flex"}
          container
          justifyContent={"center"}
        >
          <Grid item={true} xs={3} md={2}>
            {" "}
            <Link to="/categorys/combovouchers">
              <Grid
                className="item"
                direction="column"
                alignItems={"center"}
                display={"flex"}
                justifyContent="center"
              >
                <img style={Mainmenustyle().img} src="./gift-voucher.png"></img>
                <small style={Mainmenustyle().text}>COMBO VOUCHERS</small>
              </Grid>
            </Link>
          </Grid>
          <Grid item={true} xs={3} md={2}>
            {" "}
            <Link to="/categorys/dichvunghiduong">
              <Grid
                className="item"
                display={"flex"}
                justifyContent="center"
                direction="column"
                alignItems={"center"}
              >
                <img style={Mainmenustyle().img} src="./island.png"></img>
                <small style={Mainmenustyle().text}>DỊCH VỤ NGHỈ DƯỠNG</small>
              </Grid>
            </Link>
          </Grid>
          <Grid item={true} xs={3} md={2}>
            {" "}
            <Link to="/categorys/dichvuhangkhong">
              <Grid
                className="item"
                display={"flex"}
                direction="column"
                justifyContent="center"
                alignItems={"center"}
              >
                <img style={Mainmenustyle().img} src="./world.png"></img>
                <small style={Mainmenustyle().text}>DỊCH VỤ HÀNG KHÔNG</small>
              </Grid>
            </Link>
          </Grid>
          <Grid item={true} xs={3} md={2}>
            {" "}
            <Link to="/categorys/dichvulienket">
              <Grid
                className="item"
                display={"flex"}
                direction="column"
                alignItems={"center"}
                justifyContent="center"
              >
                <img style={Mainmenustyle().img} src="./credit.png"></img>
                <small style={Mainmenustyle().text}>DỊCH VỤ LIÊN KẾT</small>
              </Grid>
            </Link>
          </Grid>
          <Grid item={true} xs={3} md={2}>
            {" "}
            <Link to="/categorys/dichvugolf">
              <Grid
                className="item"
                display={"flex"}
                direction="column"
                alignItems={"center"}
                justifyContent="center"
              >
                <img style={Mainmenustyle().img} src="./golf.png"></img>
                <small style={Mainmenustyle().text}>DỊCH VỤ GOLF</small>
              </Grid>
            </Link>
          </Grid>
        </Grid>
      </section>
      <section className="Vouchers-box">
        {topvoucher ? (
          topvoucher.map((main, indx) => {
            return (
              <div>
                <div
                  className="productSection d-flex justify-content-center flex-column"
                  key={indx}
                >
                  <div className="productTitle">{main["title"]}</div>
                  <div className="products">
                    {main["items"].map((item, indx) => {
                      return (
                        <div className="card col-md-5 col-sm-12">
                          <Link to={`vouchers/${item.slug}`}>
                            <img
                              className="card-img-top"
                              src={item.img_url}
                              alt="Card image cap"
                            />
                            <div className="card-body">
                              <Grid display={"flex"} flexDirection="column">
                                <label style={{ fontSize: "16px" }}>
                                  {item.title}
                                </label>

                                <Button type="primary" className="btn-color">
                                  Xem thông tin...
                                </Button>
                              </Grid>
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="spinner-border text-info" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
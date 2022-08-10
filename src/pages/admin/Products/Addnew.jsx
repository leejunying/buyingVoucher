import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { Request_Admin } from "../../../API/api";
import axios from "axios";
import { message, Image, Input } from "antd";
import { Select, InputNumber } from "antd";
import "./Addnew.css";
import { useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import { LeftOutlined } from "@ant-design/icons";
import successAnimation from "./effectbtn/successbtn.json";
import Lottie from "react-lottie";
import { Button } from "antd";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: successAnimation,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const StatusOptions = ["NEW", "HOT", "DISCOUNT", "SOLD-OUT"];

const Addproduct = (props) => {
  const voucher = props.item;
  const info_Admin = useSelector((state) => state["account"]["Admin"]);
  const { Option } = Select;
  ///// common state
  const [category, setCategory] = useState();
  const [image, setImage] = useState();
  const [locations, setLocations] = useState([]); //location choose
  const [categorys, setCategorys] = useState([]); //filter tabs
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("NEW");
  //solution state
  const [price, setPrice] = useState(0);
  const [monthoptions, setMonthoptions] = useState([]);
  const [coloropt, setColoropt] = useState([]);
  const [roomopt, setRoomopt] = useState([]);
  const [onOk, setOnok] = useState(false);
  //if prop not null is will fill to update
  useEffect(() => {
    if (!!voucher) {
      setCategory(voucher.key);
      setTitle(voucher.title);
      setStatus(voucher.status);
      setImage(voucher.img_url);

      //set locations
      if (voucher.categorys.length > 1) {
        let newcategorys = voucher.categorys.map((item, indx) => {
          if (indx > 0) return item._id;
        });
        newcategorys.shift();
        setLocations(newcategorys);
      }
      if (voucher.key == "CV") {
        setPrice(voucher.price_options.price);
      }
      if (voucher.key == "DVHK") {
        setMonthoptions(voucher.price_options.package);
      }
      if (voucher.key == "DVND") {
        setMonthoptions(voucher.price_options.duration);
        setColoropt(voucher.price_options.color);
        setRoomopt(voucher.price_options.room);
      }
      if (voucher.key == "DVLK") {
        setMonthoptions(voucher.price_options.duration);
      }
      if (voucher.key == "DVG") {
        setMonthoptions(voucher.price_options.duration);
      }
    } else {
      setCategory("CV");
    }
    axios.get(Request_Admin.getcategory).then((res) => {
      if (res.status == 200) {
        setCategorys(res.data);
        console.log(res.data);
      }
    });
  }, []);

  useEffect(() => {}, [image]);

  //function
  //Common onChange

  //auto create array obj by number

  const createArrobj = (statenumber, array) => {
    console.log(statenumber, array);
    if (array == undefined || statenumber == 0) {
      array = [];
    }
    if (statenumber < array.length) {
      array.splice(0, statenumber);
      // console.log("smaller");
      return array;
    }
    if (statenumber > array.length) {
      for (let i = array.length; i < statenumber; i++)
        array.push({ title: "1", value: "0" });
      // console.log("bigger");
      return array;
    }

    if (statenumber == 0) {
      array = [];
      // console.log("zero");
      return array;
    }
  };

  //for monthy voucher
  const onChangePackage = (indx, type, e) => {
    if (type == "title") monthoptions[indx].title = e.target.value;
    if (type == "value") monthoptions[indx].value = e.target.value;
  };
  const onChangeColor = (indx, type, e) => {
    if (type == "title") coloropt[indx].title = e.target.value;
    if (type == "value") coloropt[indx].value = e.target.value;
  };
  const onChangeRoom = (indx, type, e) => {
    if (type == "title") roomopt[indx].title = e.target.value;
    if (type == "value") roomopt[indx].value = e.target.value;
  };
  const onUpdate = async () => {
    let tags = [];
    if (locations.length > 0) {
      tags = [findCategoryID(), ...locations];
    } else tags = [findCategoryID()];

    let file = await fetch(image).then((r) => r.blob());
    console.log(file);
    const body = new FormData();
    body.set("key", "821358b6cb84839ab5031d22a6594bdd");
    body.append("image", file);
    body.append("name", "voucherdemo");
    // body.append('expi ration',`${cleartime}`)
    const res = await axios({
      method: "post",
      url: "https://api.imgbb.com/1/upload",
      data: body,
    });
    const updateobj = {
      id: voucher._id,
      title: title,
      key: category,
      categorys: tags,
      img_url: res.data.data.display_url,
      price_options: createPriceOptions(),
      status: status,
    };
    await axios
      .put(Request_Admin.putUpdatevoucher, updateobj, {
        headers: {
          Authorization: `Basic ${info_Admin.accessToken}`,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          setOnok(true);

          setTimeout(() => {
            setOnok(false);
            props.backtoList();
          }, [2000]);
        }
      });
  };

  const findCategoryID = () => {
    const categoryid = categorys.filter((item) => {
      return item.key == category;
    })[0]._id;
    return categoryid;
  };

  const createPriceOptions = () => {
    let priceoptionssend = {
      price: 0,
      package: [],
      room: [],
      color: [],
      duration: [],
    };
    if (category == "CV") {
      priceoptionssend.price = price;
      priceoptionssend.package = [];
      priceoptionssend.room = [];
      priceoptionssend.color = [];
      priceoptionssend.duration = [];
    }

    if (category == "DVHK") {
      priceoptionssend.package = monthoptions;
      priceoptionssend.price = 0;
      priceoptionssend.room = [];
      priceoptionssend.color = [];
      priceoptionssend.duration = [];
    }
    if (category == "DVND") {
      priceoptionssend.room = roomopt;
      priceoptionssend.duration = monthoptions;
      priceoptionssend.color = coloropt;
      priceoptionssend.price = 0;
      priceoptionssend.package = [];
    }
    if (category == "DVLK") {
      priceoptionssend.price = 0;
      priceoptionssend.package = [];
      priceoptionssend.room = [];
      priceoptionssend.color = [];
      priceoptionssend.duration = monthoptions;
    }
    if (category == "DVG") {
      priceoptionssend.duration = monthoptions;
    }

    return priceoptionssend;
  };

  const onClickAdd = () => {
    //

    //Excute categorys

    const categoryssend = [];

    categoryssend.push(findCategoryID);

    locations.map((location) => {
      categoryssend.push(location);
    });

    //Excute priceoptions

    // Excute Image

    let body = new FormData();
    body.set("key", "821358b6cb84839ab5031d22a6594bdd");
    body.append("image", image);
    body.append("name", title);
    // body.append('expi ration',`${cleartime}`)

    axios({
      method: "post",
      url: "https://api.imgbb.com/1/upload",
      data: body,
    }).then((result) => {
      let image_url = "";
      if (result.data.status == 200) {
        image_url = result.data.data.display_url;
        const submititem = {
          key: `${category}`,
          title: title,
          img_url: image_url,
          categorys: categoryssend,
          price_options: createPriceOptions(),
          status: status,
        };

        axios
          .post(Request_Admin.postNewvoucher, submititem, {
            headers: {
              Authorization: `Basic ${info_Admin.accessToken}`,
            },
          })
          .then((res) => {
            if (res.status == 200) {
              resetfield();
            }
          });
      }
    });
  };

  const resetfield = () => {
    setRoomopt([]);
    setTitle("");
    setColoropt([]);
    setLocations([]);
    setMonthoptions([]);
    setImage(undefined);
    setPrice(0);
  };

  const onChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const onChangePrice = (value) => {
    setPrice(value);
  };

  const onChangeMonthoptions = (value) => {
    let duration = createArrobj(value, monthoptions);
    setMonthoptions([...duration]);
    console.log(duration);
  };

  const onChangeColoroptions = (value) => {
    let color = createArrobj(value, coloropt);
    setColoropt([...color]);
  };
  const onChangeRoomoptions = (value) => {
    let room = createArrobj(value, roomopt);
    setRoomopt([...room]);
  };

  const Displayoptions = () => {
    if (category == "CV") {
      return (
        <Grid style={{ width: "100%" }}>
          <Grid>
            <h5>Price</h5>
            <InputNumber
              style={{ width: "100%" }}
              onChange={onChangePrice}
              defaultValue={
                voucher != undefined ? voucher.price_options.price : 0
              }
              addonAfter="VND"
            />
          </Grid>
        </Grid>
      );
    }

    if (category == "DVHK") {
      return (
        <Grid style={{ width: "100%" }}>
          <h5>Monthly options</h5>

          <Select
            onChange={onChangeMonthoptions}
            style={{ width: "100%" }}
            placeholder="How many options"
            defaultValue={monthoptions.length}
          >
            {Array.from(Array(5).keys()).map((num) => {
              return <Option key={num} value={num}></Option>;
            })}
          </Select>

          <Grid>
            {voucher != undefined
              ? Array.from(Array(monthoptions.length)).map((item, indx) => {
                  return (
                    <Grid
                      key={item}
                      style={{ width: "100%", marginTop: "15px" }}
                      className=" flex sp-bot"
                    >
                      <Grid
                        container
                        style={{ width: "100%" }}
                        className="flex"
                      >
                        <Grid
                          className="flex al-center jus-start"
                          item={true}
                          md={5}
                        >
                          <TextField
                            label="Duration/month"
                            defaultValue={monthoptions[indx].title}
                            onChange={(e) => onChangePackage(indx, "title", e)}
                          ></TextField>
                        </Grid>
                        <Grid
                          className="flex al-center jus-center"
                          item={true}
                          md={6}
                        >
                          <TextField
                            label="value"
                            defaultValue={monthoptions[indx].value}
                            onChange={(e) => onChangePackage(indx, "value", e)}
                            placeholder="Value"
                          ></TextField>
                        </Grid>
                      </Grid>
                    </Grid>
                  );
                })
              : Array.from(Array(monthoptions.length)).map((num, indx) => {
                  return (
                    <Grid
                      key={num}
                      style={{ width: "100%", marginTop: "15px" }}
                      className=" flex sp-bot"
                    >
                      <Grid
                        container
                        style={{ width: "100%" }}
                        className="flex"
                      >
                        <Grid
                          className="flex al-center jus-start"
                          item={true}
                          md={5}
                        >
                          <TextField
                            label="Monthy"
                            defaultValue={1}
                            onChange={(e) => onChangePackage(indx, "title", e)}
                          ></TextField>
                        </Grid>
                        <Grid
                          className="flex al-center jus-center"
                          item={true}
                          md={6}
                        >
                          <TextField
                            label="value"
                            defaultValue={0}
                            onChange={(e) => onChangePackage(indx, "value", e)}
                            placeholder="Value"
                          ></TextField>
                        </Grid>
                      </Grid>
                    </Grid>
                  );
                })}
          </Grid>
        </Grid>
      );
    }
    if (category == "DVND") {
      return (
        <Grid
          container
          display={"flex"}
          rowSpacing={1}
          flexDirection={"column"}
          style={{ width: "100%" }}
        >
          <Grid item={true} className="duration">
            <h5>Duration options</h5>
            <Select
              onChange={onChangeMonthoptions}
              style={{ width: "100%" }}
              placeholder="How many options"
              defaultValue={monthoptions.length}
            >
              {Array.from(Array(5).keys()).map((num) => {
                return <Option key={num} value={num}></Option>;
              })}
            </Select>

            <Grid>
              {voucher != undefined
                ? Array.from(Array(monthoptions.length)).map((num, indx) => {
                    return (
                      <Grid
                        key={num}
                        style={{ width: "100%", marginTop: "15px" }}
                        className=" flex sp-bot"
                      >
                        <Grid
                          container
                          style={{ width: "100%" }}
                          className="flex"
                        >
                          <Grid
                            className="flex al-center jus-start"
                            item={true}
                            md={5}
                          >
                            <TextField
                              label="Duration/month"
                              defaultValue={monthoptions[indx].title}
                              onChange={(e) =>
                                onChangePackage(indx, "title", e)
                              }
                            ></TextField>
                          </Grid>
                          <Grid className="flex jus-center" item={true} md={6}>
                            <TextField
                              label="price VND"
                              defaultValue={monthoptions[indx].value}
                              onChange={(e) =>
                                onChangePackage(indx, "value", e)
                              }
                            ></TextField>
                          </Grid>
                        </Grid>
                      </Grid>
                    );
                  })
                : Array.from(Array(monthoptions.length)).map((num, indx) => {
                    return (
                      <Grid
                        key={num}
                        style={{ width: "100%", marginTop: "15px" }}
                        className=" flex sp-bot"
                      >
                        <Grid
                          container
                          style={{ width: "100%" }}
                          className="flex"
                        >
                          <Grid
                            className="flex al-center jus-start"
                            item={true}
                            md={5}
                          >
                            <TextField
                              label="Duration/monthy"
                              defaultValue={1}
                              onChange={(e) =>
                                onChangePackage(indx, "title", e)
                              }
                              placeholder="Duration"
                            ></TextField>
                          </Grid>
                          <Grid className="flex jus-center" item={true} md={6}>
                            <TextField
                              label="price VND"
                              defaultValue={0}
                              onChange={(e) =>
                                onChangePackage(indx, "value", e)
                              }
                            ></TextField>
                          </Grid>
                        </Grid>
                      </Grid>
                    );
                  })}
            </Grid>
          </Grid>

          <Grid item={true} className="color">
            <h5>Color options</h5>
            <Select
              onChange={onChangeColoroptions}
              style={{ width: "100%" }}
              placeholder="How many options"
              defaultValue={coloropt.length}
            >
              {Array.from(Array(5).keys()).map((num) => {
                return <Option key={num} value={num}></Option>;
              })}
            </Select>

            <Grid>
              {voucher != undefined
                ? Array.from(Array(coloropt.length)).map((num, indx) => {
                    return (
                      <Grid
                        key={num}
                        style={{ width: "100%", marginTop: "15px" }}
                        className=" flex sp-bot"
                      >
                        <Grid
                          container
                          style={{ width: "100%" }}
                          className="flex"
                        >
                          <Grid className="flex jus-start" item={true} md={5}>
                            <TextField
                              label="color"
                              defaultValue={coloropt[indx].title}
                              onChange={(e) => onChangeColor(indx, "title", e)}
                            ></TextField>
                          </Grid>
                          <Grid className="flex jus-center" item={true} md={6}>
                            <TextField
                              label="percent %"
                              defaultValue={coloropt[indx].value}
                              onChange={(e) => onChangeColor(indx, "value", e)}
                              placeholder="Value"
                            ></TextField>
                          </Grid>
                        </Grid>
                      </Grid>
                    );
                  })
                : Array.from(Array(coloropt.length)).map((num, indx) => {
                    return (
                      <Grid
                        key={num}
                        style={{ width: "100%", marginTop: "15px" }}
                        className=" flex sp-bot"
                      >
                        <Grid
                          container
                          style={{ width: "100%" }}
                          className="flex"
                        >
                          <Grid className="flex jus-start" item={true} md={5}>
                            <TextField
                              label="color"
                              defaultValue={"White"}
                              onChange={(e) => onChangeColor(indx, "title", e)}
                            ></TextField>
                          </Grid>
                          <Grid className="flex jus-center" item={true} md={6}>
                            <TextField
                              label="percent %"
                              defaultValue={0}
                              onChange={(e) => onChangeColor(indx, "value", e)}
                              placeholder="Value"
                            ></TextField>
                          </Grid>
                        </Grid>
                      </Grid>
                    );
                  })}
            </Grid>
          </Grid>
          <Grid item={true} className="room">
            <h5>Room options</h5>
            <Select
              onChange={onChangeRoomoptions}
              style={{ width: "100%" }}
              placeholder="How many options"
              defaultValue={roomopt.length}
            >
              {Array.from(Array(5).keys()).map((num) => {
                return <Option key={num} value={num}></Option>;
              })}
            </Select>

            <Grid>
              {voucher != undefined
                ? Array.from(Array(roomopt.length)).map((num, indx) => {
                    return (
                      <Grid
                        key={num}
                        style={{ width: "100%", marginTop: "15px" }}
                        className=" flex sp-bot"
                      >
                        <Grid
                          container
                          style={{ width: "100%" }}
                          className="flex"
                        >
                          <Grid className="flex jus-start" item={true} md={5}>
                            <TextField
                              label="Room"
                              defaultValue={roomopt[indx].title}
                              onChange={(e) => onChangeRoom(indx, "title", e)}
                              placeholder="Room"
                            ></TextField>
                          </Grid>
                          <Grid className="flex jus-center" item={true} md={6}>
                            <TextField
                              label="percent %"
                              defaultValue={roomopt[indx].value}
                              onChange={(e) => onChangeRoom(indx, "value", e)}
                              placeholder="Value"
                            ></TextField>
                          </Grid>
                        </Grid>
                      </Grid>
                    );
                  })
                : Array.from(Array(roomopt.length)).map((num, indx) => {
                    return (
                      <Grid
                        key={num}
                        style={{ width: "100%", marginTop: "15px" }}
                        className=" flex sp-bot"
                      >
                        <Grid
                          container
                          style={{ width: "100%" }}
                          className="flex"
                        >
                          <Grid className="flex jus-start" item={true} md={5}>
                            <TextField
                              label="Room"
                              defaultValue={1}
                              onChange={(e) => onChangeRoom(indx, "title", e)}
                              placeholder="Room"
                            ></TextField>
                          </Grid>
                          <Grid className="flex jus-center" item={true} md={6}>
                            <TextField
                              label="percent %"
                              defaultValue={0}
                              onChange={(e) => onChangeRoom(indx, "value", e)}
                              placeholder="Value"
                            ></TextField>
                          </Grid>
                        </Grid>
                      </Grid>
                    );
                  })}
            </Grid>
          </Grid>
        </Grid>
      );
    }

    if (category == "DVLK") {
      return (
        <Grid
          style={{ width: "100%" }}
          container
          rowSpacing={1}
          display="flex"
          flexDirection={"column"}
        >
          <Grid item={true} className="duration">
            <h5>Duration options</h5>
            <Select
              onChange={onChangeMonthoptions}
              style={{ width: "100%" }}
              placeholder="How many options"
              defaultValue={monthoptions.length}
            >
              {Array.from(Array(5).keys()).map((num) => {
                return <Option key={num} value={num}></Option>;
              })}
            </Select>

            <Grid>
              {voucher != undefined
                ? Array.from(Array(monthoptions.length)).map((num, indx) => {
                    return (
                      <Grid
                        key={num}
                        style={{ width: "100%", marginTop: "15px" }}
                        className=" flex sp-bot"
                      >
                        <Grid
                          container
                          style={{ width: "100%" }}
                          className="flex"
                        >
                          <Grid
                            className="flex al-center jus-start"
                            item={true}
                            md={5}
                          >
                            <TextField
                              label="Duration/month"
                              defaultValue={monthoptions[indx].title}
                              onChange={(e) =>
                                onChangePackage(indx, "title", e)
                              }
                            ></TextField>
                          </Grid>
                          <Grid className="flex jus-center" item={true} md={6}>
                            <TextField
                              label="price VND"
                              defaultValue={monthoptions[indx].value}
                              onChange={(e) =>
                                onChangePackage(indx, "value", e)
                              }
                            ></TextField>
                          </Grid>
                        </Grid>
                      </Grid>
                    );
                  })
                : Array.from(Array(monthoptions.length)).map((num, indx) => {
                    return (
                      <Grid
                        key={num}
                        style={{ width: "100%", marginTop: "15px" }}
                        className=" flex sp-bot"
                      >
                        <Grid
                          container
                          style={{ width: "100%" }}
                          className="flex"
                        >
                          <Grid
                            className="flex al-center jus-start"
                            item={true}
                            md={5}
                          >
                            <TextField
                              label="Duration/monthy"
                              defaultValue={1}
                              onChange={(e) =>
                                onChangePackage(indx, "title", e)
                              }
                              placeholder="Duration"
                            ></TextField>
                          </Grid>
                          <Grid className="flex jus-center" item={true} md={6}>
                            <TextField
                              label="price VND"
                              defaultValue={0}
                              onChange={(e) =>
                                onChangePackage(indx, "value", e)
                              }
                            ></TextField>
                          </Grid>
                        </Grid>
                      </Grid>
                    );
                  })}
            </Grid>
          </Grid>
        </Grid>
      );
    }

    if (category == "DVG") {
      return (
        <Grid style={{ width: "100%" }}>
          <Grid className="duration">
            <h5>Duration options</h5>
            <Select
              onChange={onChangeMonthoptions}
              style={{ width: "100%" }}
              placeholder="How many options"
              defaultValue={monthoptions.length}
            >
              {Array.from(Array(5).keys()).map((num) => {
                return <Option key={num} value={num}></Option>;
              })}
            </Select>

            <Grid>
              {voucher != undefined
                ? Array.from(Array(monthoptions.length)).map((num, indx) => {
                    return (
                      <Grid
                        key={num.title}
                        style={{ width: "100%", marginTop: "15px" }}
                        className=" flex sp-bot"
                      >
                        <Grid
                          container
                          style={{ width: "100%" }}
                          className="flex"
                        >
                          <Grid
                            className="flex al-center jus-start"
                            item={true}
                            md={5}
                          >
                            <TextField
                              label="Duration/month"
                              defaultValue={num.title}
                              onChange={(e) =>
                                onChangePackage(indx, "title", e)
                              }
                              placeholder="Duration"
                            ></TextField>
                          </Grid>
                          <Grid className="flex jus-center" item={true} md={6}>
                            <TextField
                              label="price VND"
                              defaultValue={num.value}
                              onChange={(e) =>
                                onChangePackage(indx, "value", e)
                              }
                            ></TextField>
                          </Grid>
                        </Grid>
                      </Grid>
                    );
                  })
                : Array.from(Array(monthoptions.length)).map((num, indx) => {
                    return (
                      <Grid
                        key={num}
                        style={{ width: "100%", marginTop: "15px" }}
                        className=" flex sp-bot"
                      >
                        <Grid
                          container
                          style={{ width: "100%" }}
                          className="flex"
                        >
                          <Grid
                            className="flex al-center jus-start"
                            item={true}
                            md={5}
                          >
                            <TextField
                              label="Monthy"
                              defaultValue={1}
                              onChange={(e) =>
                                onChangePackage(indx, "title", e)
                              }
                              placeholder="Duration"
                            ></TextField>
                          </Grid>
                          <Grid className="flex jus-center" item={true} md={6}>
                            <TextField
                              label="price VND"
                              defaultValue={0}
                              onChange={(e) =>
                                onChangePackage(indx, "value", e)
                              }
                            ></TextField>
                          </Grid>
                        </Grid>
                      </Grid>
                    );
                  })}
            </Grid>
          </Grid>
        </Grid>
      );
    }
  };

  const onChangeCategory = (value) => {
    setCategory(value);
    console.log(value);
  };

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      {
        setImage(URL.createObjectURL(e.target.files[0]));
      }

      // console.log(e.target.files[0]);
    }
  };

  //render

  return (
    <Grid className="Box-container">
      {categorys != undefined ? (
        <Grid className=" Add-voucher">
          <Grid container>
            <Grid item={true} xs={6}>
              <Grid
                container
                direction="column"
                columns={{ xs: 4, md: 6, sm: 2 }}
                rowSpacing={2}
              >
                {voucher != undefined ? (
                  <Grid
                    item={true}
                    onClick={() => props.backtoList()}
                    style={{ width: "150px", color: "blue", cursor: "pointer" }}
                    display="flex"
                    alignItems={"center"}
                  >
                    <LeftOutlined> </LeftOutlined>
                    BACK TO LIST
                  </Grid>
                ) : null}

                <Grid item={true}>
                  <h5>Category</h5>
                  <Grid item={true} xs={5}>
                    <Select
                      value={category}
                      onChange={onChangeCategory}
                      style={{ width: "100%" }}
                    >
                      {categorys.map((item, indx) => {
                        if (item.key.includes("Lo") == false)
                          return (
                            <Select.Option key={item.key} value={item.key}>
                              {item.title}
                            </Select.Option>
                          );
                      })}
                    </Select>
                  </Grid>
                </Grid>
                <Grid item={true}>
                  <h5>Title</h5>
                  <Grid item={true} xs={5}>
                    {" "}
                    <Input value={title} onChange={onChangeTitle}></Input>
                  </Grid>
                </Grid>
                <Grid item={true}>
                  <h5>Status</h5>
                  <Grid item={true} xs={5} style={{ width: "100%" }}>
                    <Select
                      style={{ width: "100%" }}
                      value={status}
                      onChange={setStatus}
                    >
                      {StatusOptions.map((value) => {
                        return (
                          <Select.Option key={value} value={value}>
                            {value}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Grid>
                </Grid>
                <Grid item={true}>
                  <h5>TAGS</h5>
                  <Grid item={true} xs={5}>
                    {" "}
                    <Select
                      mode="multiple"
                      placeholder="Inserted are removed"
                      value={locations}
                      onChange={setLocations}
                      style={{
                        width: "100%",
                      }}
                    >
                      {categorys.map((item, indx) => {
                        if (item.key.includes("Lo") == true)
                          return (
                            <Select.Option key={item._id} value={item._id}>
                              {item.title}
                            </Select.Option>
                          );
                      })}
                    </Select>
                  </Grid>
                </Grid>
                <Grid item={true}>
                  <h5>Demo image</h5>
                  <Grid item={true} xs={5}>
                    <img
                      src={image}
                      style={{ width: "100%", height: "400px" }}
                    ></img>
                  </Grid>
                  <Grid item={true}>
                    <input
                      onChange={(e) => imageChange(e)}
                      type="file"
                      accept="image/*"
                      id="contained-button-file"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid item={true} xs={6}>
              <Grid
                container
                direction="column"
                columns={{ xs: 4, md: 6, sm: 2 }}
                rowSpacing={2}
                justifyContent="center"
              >
                <Grid className="Price-options" item={true}>
                  {category != undefined ? Displayoptions() : null}
                </Grid>

                <Grid item={true} display="flex">
                  <Grid>
                    {" "}
                    {voucher != undefined ? (
                      <Grid>
                        {onOk == false ? (
                          <button onClick={onUpdate} className="update-btn">
                            UPDATE
                          </button>
                        ) : (
                          <Lottie
                            options={defaultOptions}
                            height={150}
                            width={150}
                          />
                        )}
                      </Grid>
                    ) : (
                      <button onClick={onClickAdd} className="create-btn">
                        CREATE VOUCHER
                      </button>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : null}
    </Grid>
  );
};

export default Addproduct;

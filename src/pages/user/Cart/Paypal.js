import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import { Request_User } from "../../../API/api";
import { useDispatch, useSelector } from "react-redux";
import { removeItem, clearItems } from "../../../Redux/Reducer/Cart";
const PaypalButton = (props) => {
  const initialOptions = {
    "client-id":
      "Af8rG_BzQB0X4GuvNvL0zQSv4J6KcynMmcPmCts-Nq6sRbQ8HBHm-71pIC1Q-nTXYGT3bApJkeNdQlBN",
    currency: "USD",
    intent: "capture",
  };

  const dispatch = useDispatch();
  const { total, cart, user, address, phone } = props;

  var sendtotal = Math.floor(total / 23460);

  const saveData = () => {
    const payment = {
      userid: user._id,
      purchase_items: cart,
      total: total,
      status: "success",
      shipaddress: address,
      contactphone: phone,
    };

    axios
      .post(Request_User.submitpayment, payment, {
        headers: {
          Authorization: `Basic ${user.accessToken}`,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          dispatch(clearItems([]));
          props.showModal();
          props.alertcontent("Transaction successful!");
          props.ischeckout();
        } else {
          props.showModal();
          props.alertcontent("Transaction failed!");
        }
      });
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  currency_code: "USD",
                  value: sendtotal.toString(),
                },
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          console.log(data);
          saveData();
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PaypalButton;

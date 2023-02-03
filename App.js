import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ActionSheetIOS,
  Linking,
} from "react-native";
import * as Location from "expo-location";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [location, setLocation] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [dt, setDt] = useState(new Date().toLocaleString());
  const latitude = location["coords"]["latitude"];
  const longitude = location["coords"]["longitude"];

  function handleClick() {
    axios
      .post("https://9c7c-217-131-110-243.ngrok.io/home", {
        latitude: latitude,
        longitude: longitude,
        title: "current location",
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  useEffect(() => {
    let secTimer = setInterval(() => {
      setDt(new Date().toLocaleString());
    });
    console.log(dt);
  }, []);

  return (
    <View style={styles.container}>
      <Button onPress={handleClick} title="Press"></Button>
      <Text style={styles.red}>{dt}</Text>
      <Text style={styles.red}></Text>

      <Text style={styles.paragraph}>{text}</Text>
      <StatusBar style="auto" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontSize: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

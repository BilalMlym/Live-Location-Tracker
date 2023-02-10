import * as Location from "expo-location";
import React, { useState, useEffect } from "react";
import axios from "axios";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";

export default function App() {
  const [latitude, setLatitude] = useState([]);
  const [longitude, setLongitude] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [dt, setDt] = useState(new Date().toLocaleString());

  const ref = [];

  useEffect(() => {
    ref.location = setInterval(sendLocation, 3000);

    return () => {
      if (ref.location) {
        clearInterval(ref.location);
      }
    };
  }, []);

  function sendLocation() {
    axios
      .post(
        "https://e02e-31-223-44-119.ngrok.io/home",

        {
          latitude: { latitude },
          longitude: { longitude },
        }
      )
      .then(function (response) {})
      .catch(function (error) {
        console.log(error);
      });
  }

  useEffect(() => {
    (async () => {
      const { status: foregroundStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus === "granted") {
        const { status: backgroundStatus } =
          await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus === "granted") {
          console.log("hello");
          await Location.startLocationUpdatesAsync(YOUR_TASK_NAME, {
            accuracy: Location.Accuracy.Balanced,
          });
        }
      }

      let location = await Location.getCurrentPositionAsync({});
      const latitude = location["coords"]["latitude"];
      const longitude = location["coords"]["longitude"];
      setLatitude(latitude);
      setLongitude(longitude);
    })();
  }, []);

  const YOUR_TASK_NAME = "first-task";

  TaskManager.defineTask(YOUR_TASK_NAME, ({ data: { locations }, error }) => {
    if (error) {
      // check `error.message` for more details.
      return;
    }
    console.log("Received new locations", "locations");
  });

  let text2 = "Waiting..";
  if (errorMsg) {
    text2 = errorMsg;
  } else if (latitude) {
    text2 = JSON.stringify(latitude);
  }
  let text3 = "Waiting..";
  if (errorMsg) {
    text3 = errorMsg;
  } else if (longitude) {
    text3 = JSON.stringify(longitude);
  }

  useEffect(() => {
    let secTimer = setInterval(() => {
      setDt(new Date().toLocaleString());
    });
  }, []);

  return (
    <View style={styles.container}>
      <Button onPress={sendLocation} title="SARITUTKU"></Button>

      <Text style={styles.red}>{dt}</Text>

      {/* <Text style={styles.paragraph}> {text}</Text> */}
      <Text style={styles.paragraph}>latitude: {text2}</Text>
      <Text style={styles.paragraph}>longitude: {text3}</Text>
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

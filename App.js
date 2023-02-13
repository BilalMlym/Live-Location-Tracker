import * as Location from "expo-location";
import React, { useState, useEffect } from "react";
import axios from "axios";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";

const BACKGROUND_FETCH_TASK = "background-fetch";
const TASK_NAME = "background";

TaskManager.defineTask(BACKGROUND_FETCH_TASK, () => {
  const now = Date.now();

  console.log(
    `Got background fetch call at date: ${new Date(now).toISOString()}`
  );

  return BackgroundFetch.BackgroundFetchResult.NewData;
});

export default function App() {
  const [latitude, setLatitude] = useState([]);
  const [longitude, setLongitude] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [dt, setDt] = useState(new Date().toLocaleString());

  const [isRegistered, setIsRegistered] = useState(false);
  const [status, setStatus] = useState(null);

  const ref = [];

  useEffect(() => {
    checkStatusAsync();
  }, []);

  const checkStatusAsync = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_FETCH_TASK
    );
    setStatus(status);
    setIsRegistered(isRegistered);
  };

  const toggleFetchTask = async () => {
    if (isRegistered) {
      await unregisterBackgroundFetchAsync();
      console.log("registered");
    } else {
      await registerBackgroundFetchAsync();
      console.log("not registered");
    }

    checkStatusAsync();
  };

  async function registerBackgroundFetchAsync() {
    return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minInterval: 900, // 15 minutes
    });
  }

  async function unregisterBackgroundFetchAsync() {
    return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
  }

  useEffect(() => {
    ref.location = setInterval(sendLocation, 20000);

    return () => {
      if (ref.location) {
        clearInterval(ref.location);
      }
    };
  }, []);

  function sendLocation() {
    axios
      .post(
        "https://c6a2-31-223-50-5.ngrok.io/home",

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
          await Location.startLocationUpdatesAsync(BACKGROUND_FETCH_TASK, {
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
      <View style={styles.screen}>
        <View style={styles.Container}>
          <Text>
            Background fetch status:{" "}
            <Text style={styles.boldText}>
              {status && BackgroundFetch.BackgroundFetchStatus[status]}
            </Text>
          </Text>
          <Text>
            Background fetch task name:{" "}
            <Text style={styles.boldText}>
              {isRegistered ? BACKGROUND_FETCH_TASK : "Not registered yet!"}
            </Text>
          </Text>
        </View>
        <View style={styles.Container}></View>
        <Button
          title={
            isRegistered
              ? "Unregister BackgroundFetch task"
              : "Register BackgroundFetch task"
          }
          onPress={toggleFetchTask}
        />
      </View>
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
// 13:24

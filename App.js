import * as Location from 'expo-location'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import * as BackgroundFetch from 'expo-background-fetch'
import * as TaskManager from 'expo-task-manager'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, Button } from 'react-native'

const TASK_NAME = 'BACKGROUND_TASK'

TaskManager.defineTask(TASK_NAME, () => {
  const now = Date.now()

  console.log(
    `Got background fetch call at date: ${new Date(now).toISOString()}`,
  )

  // Be sure to return the successful result type!
  return BackgroundFetch.BackgroundFetchResult.NewData
})

registerBackgroundTask = async () => {
  return BackgroundFetch.registerTaskAsync(TASK_NAME, {
    minimumInterval: 5, // 15 minutes
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  })
}

export default function App() {
  const [latitude, setLatitude] = useState([])
  const [longitude, setLongitude] = useState([])
  const [errorMsg, setErrorMsg] = useState(null)
  const [dt, setDt] = useState(new Date().toLocaleString())

  const ref = []

  useEffect(() => {
    registerBackgroundTask()
    console.log('here')
  }, [])

  useEffect(() => {
    ref.location = setInterval(sendLocation, 1000)

    return () => {
      if (ref.location) {
        clearInterval(ref.location)
      }
    }
  }, [])

  function sendLocation() {
    axios
      .post(
        'https://ed18-31-223-44-6.ngrok.io/home',

        {
          latitude: { latitude },
          longitude: { longitude },
        },
      )
      .then(function (response) {
        console.log(response)
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  useEffect(() => {
    ;(async () => {
      let response
      backgroundResponse = await Location.requestBackgroundPermissionsAsync()
      if (backgroundResponse.status !== 'granted') {
        setErrorMsg('Permission to access location was denied')
        return
      }
      foregroundResponse = await Location.requestForegroundPermissionsAsync()

      if (foregroundResponse.status !== 'granted') {
        setErrorMsg('Permission to access location was denied')
        return
      }

      let location = await Location.getCurrentPositionAsync({})
      const latitude = location['coords']['latitude']
      const longitude = location['coords']['longitude']
      setLatitude(latitude)
      setLongitude(longitude)
    })()
  }, [])

  let text2 = 'Waiting..'
  if (errorMsg) {
    text2 = errorMsg
  } else if (latitude) {
    text2 = JSON.stringify(latitude)
  }
  let text3 = 'Waiting..'
  if (errorMsg) {
    text3 = errorMsg
  } else if (longitude) {
    text3 = JSON.stringify(longitude)
  }

  useEffect(() => {
    let secTimer = setInterval(() => {
      setDt(new Date().toLocaleString())
    })
  }, [])

  return (
    <View style={styles.container}>
      <Button onPress={sendLocation} title="SARITUTKU"></Button>
      <Text style={styles.red}>{dt}</Text>

      {/* <Text style={styles.paragraph}> {text}</Text> */}
      <Text style={styles.paragraph}>latitude: {text2}</Text>
      <Text style={styles.paragraph}>longitude: {text3}</Text>
      <StatusBar style="auto" />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontSize: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

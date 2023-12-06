import { StatusBar } from 'expo-status-bar';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import {useEffect, useState} from "react";
import axios from "axios";

export default function App() {
  const hostname = "https://certain-allowing-killdeer.ngrok-free.app/"
  const [state, setState] = useState({
    relayState: 'DISABLED',
    powerState: 'OFF',
    desiredTemp: 0.0,
    currentTemp: 20.0,
    mode: 'HEATER',
  });
  useEffect(() => {
    setInterval(() => {
      axios.get(`${hostname}/status`, {timeout: 800}).then((res) => {
        setState(res.data);
      }).catch((err) => {});
    }, 1000);

  }, []);
  const sendCommand = (cmd) => {
    axios.post(`${hostname}/control/${cmd}`).then((res) => {
      setState(res.data);
    })
  }
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={{color: 'white', fontSize: 18, paddingTop: 16, textAlign: 'center'}}>팬코일 제어</Text>
        <NameBox powerState={state.powerState} mode={state.mode}/>
        <View style={styles.superTempBar}>
          <TouchableOpacity onPress={() => {
            sendCommand('tempdown')
          }}>
            <FontAwesomeIcon icon={faChevronLeft} color={"#ffffff"} size={24}/>
          </TouchableOpacity>

          <View style={styles.tempBar}>
            <Text style={{color: '#FFFFFF' , fontSize: 48}}>{parseInt(state.desiredTemp)}</Text>
            <Text style={{color: '#FFFFFF', fontSize: 36}}>°C</Text>
          </View>
          <TouchableOpacity onPress={() => {
            sendCommand('tempup')
          }}>
            <FontAwesomeIcon icon={faChevronRight} color={"#ffffff"} size={24}/>
          </TouchableOpacity>

        </View>
        <Text style={{color: 'white', fontSize: 18, paddingTop: 16, paddingBottom: 16, textAlign: 'center'}}>현재 온도: {state.currentTemp}°C</Text>

        <View style={styles.colFlex}>
          <View style={styles.rowFlex}>
            <Button name={"ON"} onClick={() => sendCommand('on')}/>
            <Button name={"OFF"} onClick={() => sendCommand('off')}/>
            <Button name={"모드변경 (에어컨/히터)"} onClick={() => {
              if(state.mode === 'HEATER') sendCommand('ac')
              else sendCommand('heater')
            }}/>
          </View>
        </View>

        <StatusBar style="light" />
      </SafeAreaView>
    </View>
  );
}

function NameBox({powerState, mode}){
  if(powerState === 'OFF')
    return <Text style={{color: '#FFFFFF', fontSize: 18, paddingTop: 32, textAlign: 'center', fontWeight: "bold"}}>OFF</Text>
  else if(mode === 'HEATER')
    return <Text style={{color: '#FF8585', fontSize: 18, paddingTop: 32, textAlign: 'center', fontWeight: "bold"}}>HEATER</Text>
  else
    return <Text style={{color: '#76E4FD', fontSize: 18, paddingTop: 32, textAlign: 'center', fontWeight: "bold"}}>AIR-CONDITIONER</Text>
}

function Button({name, onClick}) {
  return <TouchableOpacity style={styles.button} onPress={onClick}>
    <View>
      <Text>{name}</Text>
    </View>
  </TouchableOpacity>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171717',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  tempBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  superTempBar: {
    paddingTop: 32,
    paddingBottom: 64,
    flex: 1,
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    padding: 16,
    flexGrow: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowFlex: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '80%',
    gap: 16,
  },
  colFlex: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%',
  }
});

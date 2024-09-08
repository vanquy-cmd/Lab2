import React, { useState, useEffect } from "react";
import { 
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Vibration,
  Modal,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { evaluate, sqrt } from 'mathjs';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentNumber, setCurrentNumber] = useState('');
  const [lastNumber, setLastNumber] = useState('');
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [historyVisible, setHistoryVisible] = useState(false);
  const [history, setHistory] = useState([]);
  const [isOpenBracket, setIsOpenBracket] = useState(false); // Trạng thái cho dấu ngoặc


  const buttons = [
    'H', '^', 'C', 'DEL',
    '√', '()', '%', '/', 
    7, 8, 9, '*', 
    4, 5, 6, '-', 
    1, 2, 3, '+', 
    '+/-', 0, '.', '=',  
  ];

  useEffect(() => {
    let timer;
    if (notificationVisible) {
      timer = setTimeout(() => {
        setNotificationVisible(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [notificationVisible]);

  function calculator() {
    if (!currentNumber) {
      return;
    }

    // Thay thế phần trăm bằng số thập phân
  const adjustedExpression = currentNumber.replace(/(\d+)%/g, (match, num) => {
    return `(${parseFloat(num) / 100})`;
  });

    let lastArr = currentNumber[currentNumber.length - 1];
    if (['/', '*', '-', '+', '.'].includes(lastArr)) {
      return;
    } else {
      try {
        let result = evaluate(currentNumber).toString();
        setCurrentNumber(result);
        setLastNumber(currentNumber + '=');
        setHistory([...history, currentNumber + '=' + result]); // lưu lịch sử
      } catch (error) {
        setCurrentNumber('Error');
        console.error("Tính toán lỗi:", error);
      }
    }
  }

  function handleInput(buttonPressed) {
    Vibration.vibrate(35);
    switch (buttonPressed) {
      case 'DEL':
        setCurrentNumber(currentNumber.substring(0, currentNumber.length - 1));
        break;
      case 'C':
        setLastNumber('');
        setCurrentNumber('');
        break;
      case '=':
        calculator();
        break;
      case '√':
        if (currentNumber) {
          const result = sqrt(evaluate(currentNumber)).toString();
          setCurrentNumber(result);
          setLastNumber('√' + currentNumber + '=');
          setHistory([...history, '√' + currentNumber + '=' + result]); // Lưu lịch sử
        }
        break;
      case '^':
        if (currentNumber === '' || /[+\-*/%]$/.test(currentNumber)) {
          setNotificationMessage('Định dạng không hợp lệ');
          setNotificationVisible(true);
        } else {
          setCurrentNumber(currentNumber + '^');
        }
        break;
      case 'H':
        setHistoryVisible(!historyVisible); // Hiện/ẩn lịch sử
        break;
      case '()':
      const lastChar = currentNumber[currentNumber.length - 1];
      if (isOpenBracket && lastChar !== '(' && lastChar !== undefined) {
        // Thêm ) chỉ khi không có dấu ( ở cuối
        setCurrentNumber(currentNumber + ')');
        setIsOpenBracket(false);
      } else if (!isOpenBracket && !/[+\-*/%]$/.test(lastChar)) {
        // Thêm ( chỉ khi không kết thúc bằng dấu toán học
        setCurrentNumber(currentNumber + '(');
        setIsOpenBracket(true);
      }
      break;
      case '+/-':
        if (currentNumber === '') {
          setCurrentNumber('(-');
        } else {
          const lastChar = currentNumber[currentNumber.length - 1];
          if (!/[+\-*/]/.test(lastChar)) {
            setCurrentNumber('(-' + currentNumber + ')');
          } else {
            setCurrentNumber(currentNumber + '(-' + currentNumber.slice(-1) + ')');
          }
        }
        break;
      default:
        setCurrentNumber(currentNumber + buttonPressed);
        break;
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: 50,
    },
    results: {
      backgroundColor: darkMode ? '#282f3b' : '#f5f5f5',
      width: '100%',
      minHeight: 200,
      padding: 20,
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      elevation: 5,
    },
    resultText: {
      color: '#00b9d6',
      fontSize: 48,
      fontWeight: 'bold',
    },
    historyText: {
      color: darkMode ? '#B5B7BB' : '#7c7c7c',
      fontSize: 24,
      marginBottom: 10,
    },
    notificationContainer: {
      position: 'absolute',
      top: 50,
      left: 90,
      right: 90,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 10,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },
    notificationText: {
      color: 'white',
      fontSize: 13,
    },
    themeButton: {
      position: 'absolute',
      top: 15,
      left: 15,
      backgroundColor: darkMode ? '#7b8084' : '#e5e5e5',
      alignItems: 'center',
      justifyContent: 'center',
      width: 50,
      height: 50,
      borderRadius: 25,
      elevation: 2,
    },
    buttons: {
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
    },
    button: {
      borderRadius: 35,
      elevation: 3,
      margin: 5,
      alignItems: 'center',
      justifyContent: 'center',
      height: 70,
      width: 70,
      backgroundColor: '#e0e0e0',
    },
    textButton: {
      color: '#333',
      fontSize: 25,
      fontWeight: '600',
    },
    operationButton: {
      backgroundColor: '#00b9d6',
    },
    historyModal: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    historyContainer: {
      width: '80%',
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 20,
    },
    historyTextModal: {
      fontSize: 16,
    },
    historyButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
  });

  // Hàm xóa lịch sử
  const clearHistory = () => {
    setHistory([]);
    setNotificationMessage('Lịch sử đã được xóa');
    setNotificationVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.results}>
        <TouchableOpacity style={styles.themeButton} onPress={() => setDarkMode(!darkMode)}>
          <Entypo 
            name={darkMode ? 'light-up' : 'moon'} 
            size={24} 
            color={darkMode ? 'white' : 'black'} />
        </TouchableOpacity>
        <Text style={styles.historyText}>{lastNumber}</Text>
        <Text style={styles.resultText}>{currentNumber}</Text>
      </View>
      {notificationVisible && (
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationText}>{notificationMessage}</Text>
        </View>
      )}
      <View style={styles.buttons}>
        {buttons.map((button, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.button, (button === '=' || ['/', '*', '-', '+'].includes(button)) ? styles.operationButton : null]} 
            onPress={() => handleInput(button=== '()' ? '()' : button)}>
            <Text style={[styles.textButton, (button === '=' || ['/', '*', '-', '+'].includes(button)) ? { color: 'white' } : null]}>
              {button}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {historyVisible && (
        <Modal
          transparent={true}
          visible={historyVisible}
          onRequestClose={() => setHistoryVisible(false)}
        >
          <View style={styles.historyModal}>
            <View style={styles.historyContainer}>
              <Text style={styles.historyTextModal}>Lịch sử tính toán</Text>
              {history.map((item, index) => (
                <Text key={index} style={styles.historyTextModal}>{item}</Text>
              ))}
              <View style={styles.historyButtons}>
                <TouchableOpacity onPress={clearHistory}>
                  <Text style={{ color: '#ff0000', marginTop: 10 }}>Xóa lịch sử</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setHistoryVisible(false)}>
                  <Text style={{ color: '#00b9d6', marginTop: 10 }}>Đóng</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}